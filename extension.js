const vscode = require("vscode");
const fs = require("fs").promises; // Use promises for file system
const path = require("path");
const StatusBarAlignment = vscode.StatusBarAlignment;

async function activate(context) {
    // Create the status bar item
    const statusBarIcon = vscode.window.createStatusBarItem(
        StatusBarAlignment.Right,
        100
    );
    statusBarIcon.text = `$(file-code) Raw Project`;
    statusBarIcon.tooltip = `Click To Create Project`;
    statusBarIcon.command = "extension.createHtmlFile";
    statusBarIcon.show();
    context.subscriptions.push(statusBarIcon);

    // Register the command that generates the HTML file
    const disposable = vscode.commands.registerCommand(
        "extension.createHtmlFile",
        async () => {
            // Get the current workspace folder
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage(
                    "Please open a workspace folder to create an HTML file."
                );
                return;
            }

            const workspacePath = workspaceFolders[0].uri.fsPath;
            const htmlFileName = "index.html";
            const cssFileName = "style.css";
            const jsFileName = "script.js";

            // Define the HTML content
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New HTML Document</title>
    <link rel="stylesheet" href="./css/style.css">
</head>
<body>
    <h1>Hello, World!</h1>
    <script src="./js/script.js"></script>
</body>
</html>`;

            // Define the CSS content
            const cssContent = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

a {
    text-decoration: none;
}

ul,
ol {
    list-style: none;
}

img {
    max-width: 100%;
}

.container {
    max-width: 1340px;
    margin: auto;
}`;

            try {
                // Create HTML file
                const filePath = path.join(workspacePath, htmlFileName);
                if (!(await fileExists(filePath))) {
                    await writeFile(filePath, htmlContent);
                }

                // Create CSS folder and file
                await createDirectoryAndFile(
                    path.join(workspacePath, "css"),
                    cssFileName,
                    cssContent
                );

                // Create JS folder and file
                await createDirectoryAndFile(
                    path.join(workspacePath, "js"),
                    jsFileName,
                    "console.log('JavaScript Loaded');"
                );
            } catch (error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
            }
        }
    );
    6;

    context.subscriptions.push(disposable);
}

// Helper functions
async function writeFile(filePath, content) {
    await fs.writeFile(filePath, content);
    vscode.window.showInformationMessage(
        `${path.basename(filePath)} created successfully.`
    );
}

async function createDirectoryAndFile(dirPath, fileName, content) {
    try {
        await fs.mkdir(dirPath, { recursive: true }); // Create directory if it doesn't exist
        const filePath = path.join(dirPath, fileName);
        if (!(await fileExists(filePath))) {
            await writeFile(filePath, content);
        }
    } catch (error) {
        throw new Error(`Error creating directory or file: ${error.message}`);
    }
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true; // File exists
    } catch {
        return false; // File does not exist
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
