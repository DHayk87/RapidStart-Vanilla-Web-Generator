import * as vscode from "vscode";

/**
 * Checks if a file exists at the given URI.
 */
export async function fileExists(uri: vscode.Uri): Promise<boolean> {
    try {
        await vscode.workspace.fs.stat(uri);
        return true;
    } catch {
        return false;
    }
}

/**
 * Writes content to a file at the given URI.
 */
export async function writeFile(uri: vscode.Uri, content: string): Promise<void> {
    const encoder = new TextEncoder();
    await vscode.workspace.fs.writeFile(uri, encoder.encode(content));
}

/**
 * Creates a directory at the given URI.
 */
export async function createDirectory(uri: vscode.Uri): Promise<void> {
    await vscode.workspace.fs.createDirectory(uri);
}
