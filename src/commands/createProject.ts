import * as vscode from "vscode";
import { fileExists, writeFile, createDirectory, readFile } from "../utils/fileSystem";
import {
    interpolateVariables,
    getProjectVariables,
    resolveTemplateDirectory,
    loadFirstExistingFile,
} from "../utils/templateUtils";

let isCreating = false;
let templateCache: string[] | null = null;

export function clearTemplateCache(): void {
    templateCache = null;
}

export async function getTemplates(context: { extensionUri: vscode.Uri }): Promise<string[]> {
    if (templateCache) {
        return templateCache;
    }

    const templatePath = context.extensionUri;
    const htmlUri = vscode.Uri.joinPath(templatePath, "templates", "html.template");
    const cssUri = vscode.Uri.joinPath(templatePath, "templates", "css.template");
    const jsUri = vscode.Uri.joinPath(templatePath, "templates", "js.template");

    const [html, css, js] = await Promise.all([
        readFile(htmlUri),
        readFile(cssUri),
        readFile(jsUri),
    ]);

    templateCache = [html, css, js];
    return templateCache;
}

interface ProjectFile {
    uri: vscode.Uri;
    content: string;
    relativePath: string;
}

type ConflictResolution = "Overwrite" | "Skip Existing" | "Cancel";

export async function createProject(
    context: vscode.ExtensionContext,
    uri?: vscode.Uri,
): Promise<boolean> {
    if (isCreating) {
        vscode.window.showWarningMessage("Project creation already in progress.");
        return false;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage(
            "Please open a workspace folder to create a project.",
        );
        return false;
    }

    // Determine target root: from context (right-click) or workspace picker
    let workspaceRoot: vscode.Uri;
    if (uri) {
        workspaceRoot = uri;
    } else if (workspaceFolders.length === 1) {
        workspaceRoot = workspaceFolders[0].uri;
    } else {
        const pick = await vscode.window.showWorkspaceFolderPick({
            placeHolder: "Select a workspace folder to create the project in",
        });
        if (!pick) {
            return false;
        }
        workspaceRoot = pick.uri;
    }

    isCreating = true;
    const createdUris: vscode.Uri[] = [];

    try {
        const config = vscode.workspace.getConfiguration("htmlGenerator");
        const [defaultHtml, defaultCss, defaultJs] = await getTemplates(context);

        // Check for custom template directory
        const customTemplateDir = config.get<string>("customTemplateDirectory", "").trim();
        let customDirHtml: string | null = null;
        let customDirCss: string | null = null;
        let customDirJs: string | null = null;

        if (customTemplateDir) {
            const dirUri = resolveTemplateDirectory(workspaceRoot, customTemplateDir);
            if (dirUri && (await fileExists(dirUri))) {
                [customDirHtml, customDirCss, customDirJs] = await Promise.all([
                    loadFirstExistingFile(dirUri, ["html.template", "index.html"]),
                    loadFirstExistingFile(dirUri, ["css.template", "style.css"]),
                    loadFirstExistingFile(dirUri, ["js.template", "script.js"]),
                ]);
            }
        }

        // Precedence: Custom inline setting > Custom directory template > Default built-in template
        const rawHtml = config.get<string>("customHtmlTemplate") || customDirHtml || defaultHtml;
        const rawCss = config.get<string>("customCssTemplate") || customDirCss || defaultCss;
        const rawJs = config.get<string>("customJsTemplate") || customDirJs || defaultJs;
        const autoStartLiveServer = config.get<boolean>("autoStartLiveServer", true);

        // Interpolate template variables
        const projectVars = getProjectVariables(workspaceRoot);
        const htmlContent = interpolateVariables(rawHtml, projectVars);
        const cssContent = interpolateVariables(rawCss, projectVars);
        const jsContent = interpolateVariables(rawJs, projectVars);

        const htmlUri = vscode.Uri.joinPath(workspaceRoot, "index.html");
        const cssDirUri = vscode.Uri.joinPath(workspaceRoot, "css");
        const cssFileUri = vscode.Uri.joinPath(cssDirUri, "style.css");
        const jsDirUri = vscode.Uri.joinPath(workspaceRoot, "js");
        const jsFileUri = vscode.Uri.joinPath(jsDirUri, "script.js");

        const filesToCreate: ProjectFile[] = [
            { uri: htmlUri, content: htmlContent, relativePath: "index.html" },
            { uri: cssFileUri, content: cssContent, relativePath: "css/style.css" },
            { uri: jsFileUri, content: jsContent, relativePath: "js/script.js" },
        ];

        // Check for existing files upfront to prevent unwanted partial writes
        const existingFiles: ProjectFile[] = [];
        for (const file of filesToCreate) {
            if (await fileExists(file.uri)) {
                existingFiles.push(file);
            }
        }

        let skipExisting = false;
        if (existingFiles.length > 0) {
            const existingNames = existingFiles.map((f) => f.relativePath).join(", ");
            const choice = (await vscode.window.showWarningMessage(
                `The following file(s) already exist: ${existingNames}. How would you like to proceed?`,
                "Overwrite",
                "Skip Existing",
                "Cancel",
            )) as ConflictResolution | undefined;

            if (!choice || choice === "Cancel") {
                vscode.window.showInformationMessage("Project creation cancelled.");
                return false;
            }

            if (choice === "Skip Existing") {
                skipExisting = true;
            }
        }

        // Ensure subdirectories exist
        await createDirectory(cssDirUri);
        await createDirectory(jsDirUri);

        const writtenNames: string[] = [];

        for (const file of filesToCreate) {
            const alreadyExists = await fileExists(file.uri);
            if (alreadyExists && skipExisting) {
                continue;
            }

            if (!alreadyExists) {
                createdUris.push(file.uri);
            }

            await writeFile(file.uri, file.content);
            writtenNames.push(file.relativePath);
        }

        if (writtenNames.length > 0) {
            vscode.window.showInformationMessage(
                `Successfully created: ${writtenNames.join(", ")}`,
            );
        } else {
            vscode.window.showInformationMessage(
                "No files were written (existing files preserved).",
            );
        }

        // Open index.html if available
        if (await fileExists(htmlUri)) {
            const doc = await vscode.workspace.openTextDocument(htmlUri);
            await vscode.window.showTextDocument(doc);
        }

        // Optionally trigger Live Server
        if (autoStartLiveServer) {
            try {
                await vscode.commands.executeCommand("liveServer.goLive");
            } catch {
                // Live Server extension not active or installed; silent fallback
            }
        }

        return true;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(
            `Error creating project: ${message}. Cleaning up...`,
        );

        // Roll back only files newly created in this run
        for (const uriToDelete of createdUris) {
            try {
                await vscode.workspace.fs.delete(uriToDelete);
            } catch (_e) {
                // Ignore rollback errors
            }
        }
        return false;
    } finally {
        isCreating = false;
    }
}
