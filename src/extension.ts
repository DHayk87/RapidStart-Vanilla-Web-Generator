import * as vscode from "vscode";
import { createProject } from "./commands/createProject";

export const COMMAND_ID = "htmlGenerator.createHtmlFile";

/**
 * Updates the visibility of the status bar item based on whether a workspace is open.
 */
function updateStatusBarVisibility(statusBarIcon: vscode.StatusBarItem) {
    const hasWorkspace =
        vscode.workspace.workspaceFolders !== undefined &&
        vscode.workspace.workspaceFolders.length > 0;
    if (hasWorkspace) {
        statusBarIcon.show();
    } else {
        statusBarIcon.hide();
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Create status bar item
    const statusBarIcon = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100,
    );
    statusBarIcon.text = "$(file-code) Raw Project";
    statusBarIcon.tooltip = "Click To Create Project";
    statusBarIcon.command = COMMAND_ID;

    // Initial visibility check
    updateStatusBarVisibility(statusBarIcon);

    // Subscriptions
    context.subscriptions.push(statusBarIcon);

    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(() =>
            updateStatusBarVisibility(statusBarIcon),
        ),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(COMMAND_ID, (uri: vscode.Uri) =>
            createProject(context, uri),
        ),
    );
}

export function deactivate() {
    // Resources are handled via context.subscriptions
}
