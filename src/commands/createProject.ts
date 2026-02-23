import * as vscode from "vscode";
import { fileExists, writeFile, createDirectory } from "../utils/fileSystem";

let isCreating = false;
let templateCache: string[] | null = null;

async function getTemplates(context: vscode.ExtensionContext): Promise<string[]> {
    if (templateCache) return templateCache;

    const templatePath = context.extensionUri;
    const htmlUri = vscode.Uri.joinPath(templatePath, "templates", "html.template");
    const cssUri = vscode.Uri.joinPath(templatePath, "templates", "css.template");
    const jsUri = vscode.Uri.joinPath(templatePath, "templates", "js.template");

    const decoder = new TextDecoder();
    const [html, css, js] = await Promise.all([
        vscode.workspace.fs.readFile(htmlUri),
        vscode.workspace.fs.readFile(cssUri),
        vscode.workspace.fs.readFile(jsUri),
    ]);

    templateCache = [decoder.decode(html), decoder.decode(css), decoder.decode(js)];
    return templateCache;
}

export async function createProject(context: vscode.ExtensionContext, uri?: vscode.Uri) {
    if (isCreating) {
        vscode.window.showWarningMessage("Project creation already in progress.");
        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage(
            "Please open a workspace folder to create a project.",
        );
        return;
    }

    // Determine target root: either from context (right-click) or workspace picker
    let workspaceRoot: vscode.Uri;
    if (uri) {
        workspaceRoot = uri;
    } else if (workspaceFolders.length === 1) {
        workspaceRoot = workspaceFolders[0].uri;
    } else {
        const pick = await vscode.window.showWorkspaceFolderPick({
            placeHolder: "Select a workspace folder to create the project in",
        });
        if (!pick) return;
        workspaceRoot = pick.uri;
    }

    isCreating = true;

    const createdUris: vscode.Uri[] = [];

    try {
        const config = vscode.workspace.getConfiguration("htmlGenerator");
        const [defaultHtml, defaultCss, defaultJs] = await getTemplates(context);

        const htmlContent = config.get<string>("customHtmlTemplate") || defaultHtml;
        const cssContent = config.get<string>("customCssTemplate") || defaultCss;
        const jsContent = config.get<string>("customJsTemplate") || defaultJs;

        const createdNames: string[] = [];

        // Handle HTML file
        const htmlUri = vscode.Uri.joinPath(workspaceRoot, "index.html");
        await ensureFile(htmlUri, htmlContent, createdNames, createdUris);

        // CSS
        const cssDirUri = vscode.Uri.joinPath(workspaceRoot, "css");
        const cssFileUri = vscode.Uri.joinPath(cssDirUri, "style.css");
        await createDirectory(cssDirUri);
        // Note: directory creation isn't easily "rolled back" if it existed, but we can track files
        await ensureFile(cssFileUri, cssContent, createdNames, createdUris, "css/");

        // JS
        const jsDirUri = vscode.Uri.joinPath(workspaceRoot, "js");
        const jsFileUri = vscode.Uri.joinPath(jsDirUri, "script.js");
        await createDirectory(jsDirUri);
        await ensureFile(jsFileUri, jsContent, createdNames, createdUris, "js/");

        // Open index.html
        const doc = await vscode.workspace.openTextDocument(htmlUri);
        await vscode.window.showTextDocument(doc);

        // Try Live Server
        try {
            await vscode.commands.executeCommand("liveServer.goLive");
        } catch {
            vscode.window.showInformationMessage(
                "Project created. Start Live Server manually if needed.",
            );
        }

        if (createdNames.length > 0) {
            vscode.window.showInformationMessage(
                `Successfully created: ${createdNames.join(", ")}`,
            );
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(
            `Error creating project: ${error.message}. Cleaning up...`,
        );
        // Rollback created files
        for (const uri of createdUris) {
            try {
                await vscode.workspace.fs.delete(uri);
            } catch (e) {
                // Ignore cleanup errors
            }
        }
    } finally {
        isCreating = false;
    }
}

async function ensureFile(
    uri: vscode.Uri,
    content: string,
    createdNames: string[],
    createdUris: vscode.Uri[],
    prefix: string = "",
): Promise<boolean> {
    const fileName = vscode.Uri.file(uri.path).path.split("/").pop() || "";
    if (await fileExists(uri)) {
        const answer = await vscode.window.showWarningMessage(
            `File ${prefix}${fileName} already exists. Overwrite?`,
            "Yes",
            "No",
        );
        if (answer !== "Yes") return false;
    } else {
        // Only track for rollback if it didn't exist before
        createdUris.push(uri);
    }
    await writeFile(uri, content);
    createdNames.push(`${prefix}${fileName}`);
    return true;
}
