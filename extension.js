const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const StatusBarAlignment = vscode.StatusBarAlignment;

function activate(context) {
    // Register the command that generates the HTML file
    // icon
    const statusBarIcon = vscode.window.createStatusBarItem(
        StatusBarAlignment.Right,
        100
    );

    statusBarIcon.text = `$(file-code) Raw Project`;
    statusBarIcon.tooltip = `Click To Create Project`;
    statusBarIcon.command = "extension.createHtmlFile";
    statusBarIcon.show();
    context.subscriptions.push(statusBarIcon);
    let disposable = vscode.commands.registerCommand(
        "extension.createHtmlFile",
        async function () {
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

            // Define the full path for the HTML file
            const filePath = path.join(workspacePath, htmlFileName);

            // Write the HTML content to the file
            if (!fs.existsSync(filePath)) {
                creatHtml(filePath, htmlContent);
            }
            // Write the CSS folder and content to the file
            createCSSFolder(workspacePath, cssFileName, cssContent);
            // Write the JS folder and content to the file
            createJSFolder(workspacePath, jsFileName);
        }
    );

    context.subscriptions.push(disposable);
}

function creatHtml(filePath, htmlContent) {
    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            vscode.window.showErrorMessage(`Error creating file: ${err.message}`);
            return;
        }
        vscode.window.showInformationMessage(`HTML file created successfully.`);
    });
}

function createCSSFolder(workspacePath, cssFileName, cssContent) {
    const cssPath = path.join(workspacePath, "css");
    if (!fs.existsSync(cssPath)) {
        fs.mkdirSync(cssPath, (err) => {
            if (err) {
                vscode.window.showErrorMessage(
                    `Error creating css folder: ${err.message}`
                );
                return;
            }
            vscode.window.showInformationMessage(`CSS folder created successfully.`);
        });
    }
    createCSS(cssPath, cssFileName, cssContent);
}

function createCSS(cssPath, cssFileName, cssContent) {
    if (!fs.existsSync(path.join(cssPath, cssFileName))) {
        fs.writeFile(path.join(cssPath, cssFileName), cssContent, (err) => {
            if (err) {
                vscode.window.showErrorMessage(`Error creating file: ${err.message}`);
                return;
            }
            vscode.window.showInformationMessage(`CSS file created successfully`);
        });
    }
}

function createJSFolder(workspacePath, jsFileName) {
    const jsPath = path.join(workspacePath, "js");
    if (!fs.existsSync(jsPath)) {
        fs.mkdirSync(jsPath, (err) => {
            if (err) {
                vscode.window.showErrorMessage(
                    `Error creating js folder: ${err.message}`
                );
                return;
            }
            vscode.window.showInformationMessage(`JS folder created successfully`);
        });
    }
    createJS(jsPath, jsFileName);
}

function createJS(jsPath, jsFileName) {
    if (!fs.existsSync(path.join(jsPath, jsFileName))) {
        fs.writeFile(
            path.join(jsPath, jsFileName),
            "console.log('JavaScript Loaded');",
            (err) => {
                if (err) {
                    vscode.window.showErrorMessage(
                        `Error creating js file: ${err.message}`
                    );
                    return;
                }
                vscode.window.showInformationMessage(`JS file created successfully`);
            }
        );
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
