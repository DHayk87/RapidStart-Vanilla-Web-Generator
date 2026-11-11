import * as vscode from "vscode";
import * as path from "path";
import { fileExists, readFile } from "./fileSystem";

/**
 * Replaces {{variable}} and ${variable} placeholders inside the template string.
 */
export function interpolateVariables(
    content: string,
    variables: Record<string, string>,
): string {
    return content.replace(
        /\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}|\$\{\s*([a-zA-Z0-9_-]+)\s*\}/g,
        (match, p1, p2) => {
            const key = p1 || p2;
            if (Object.prototype.hasOwnProperty.call(variables, key)) {
                return variables[key];
            }
            return match;
        },
    );
}

/**
 * Extracts sensible default project variables from the target folder URI.
 */
export function getProjectVariables(targetUri: vscode.Uri): Record<string, string> {
    const segments = targetUri.path.split("/").filter(Boolean);
    const rawName = segments.length > 0 ? segments[segments.length - 1] : "rapidstart-project";
    const projectName = decodeURIComponent(rawName);

    // Converts "my-cool-project" or "my_cool_project" into "My Cool Project"
    const title = projectName
        .split(/[-_]+/)
        .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
        .filter(Boolean)
        .join(" ") || "RapidStart Project";

    const now = new Date();
    const year = now.getFullYear().toString();
    const date = now.toISOString().split("T")[0];

    return {
        projectName,
        title,
        year,
        date,
    };
}

/**
 * Resolves a custom template directory URI from workspace or absolute path.
 */
export function resolveTemplateDirectory(
    workspaceRoot: vscode.Uri,
    customDir: string,
): vscode.Uri | null {
    const trimmed = customDir.trim();
    if (!trimmed) {
        return null;
    }

    if (path.isAbsolute(trimmed)) {
        return vscode.Uri.file(trimmed);
    }

    return vscode.Uri.joinPath(workspaceRoot, trimmed);
}

/**
 * Attempts to read a template from a directory, checking prioritized file candidates.
 */
export async function loadFirstExistingFile(
    dirUri: vscode.Uri,
    candidateNames: string[],
): Promise<string | null> {
    for (const name of candidateNames) {
        const fileUri = vscode.Uri.joinPath(dirUri, name);
        if (await fileExists(fileUri)) {
            try {
                return await readFile(fileUri);
            } catch {
                // If reading candidate fails, continue to next
            }
        }
    }
    return null;
}

