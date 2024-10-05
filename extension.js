
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
    // Register the command that generates the HTML file
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
            // Ask the user for the file name
            // const fileName = await vscode.window.showInputBox({
            //     prompt: "Enter the name of the HTML file",
            //     value: "index.html",
            // });

            const fileName = "index.html"

            // if (!fileName) {
            //     vscode.window.showErrorMessage("File name is required.");
            //     return;
            // }

            // Define the HTML content
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New HTML Document</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
        `;

            // Define the full path for the HTML file
            const filePath = path.join(workspacePath, fileName);

            // Write the HTML content to the file
            fs.writeFile(filePath, htmlContent, (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Error creating file: ${err.message}`);
                    return;
                }
                vscode.window.showInformationMessage(
                    `HTML file created successfully: ${fileName}`
                );
            });
        }
    );

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
