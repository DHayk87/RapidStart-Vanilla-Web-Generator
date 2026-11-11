import * as assert from "assert";
import * as vscode from "vscode";
import { COMMAND_ID } from "../../extension";
import { getTemplates, clearTemplateCache } from "../../commands/createProject";

suite("RapidStart Extension Test Suite", () => {
    suiteSetup(async () => {
        // Ensure extension is activated
        const ext = vscode.extensions.getExtension("DHayk.html-generator");
        if (ext && !ext.isActive) {
            await ext.activate();
        }
    });

    test("Command is registered in VS Code", async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(
            commands.includes(COMMAND_ID),
            `Command "${COMMAND_ID}" should be registered`,
        );
    });

    test("Configuration has expected default properties", () => {
        const config = vscode.workspace.getConfiguration("htmlGenerator");

        assert.strictEqual(
            config.get<boolean>("autoStartLiveServer"),
            true,
            "autoStartLiveServer should default to true",
        );
        assert.strictEqual(
            config.get<string>("customTemplateDirectory"),
            "",
            "customTemplateDirectory should default to empty string",
        );
        assert.strictEqual(
            config.get<string>("customHtmlTemplate"),
            "",
            "customHtmlTemplate should default to empty string",
        );
        assert.strictEqual(
            config.get<string>("customCssTemplate"),
            "",
            "customCssTemplate should default to empty string",
        );
        assert.strictEqual(
            config.get<string>("customJsTemplate"),
            "",
            "customJsTemplate should default to empty string",
        );
    });

    test("getTemplates loads all three templates and uses caching", async () => {
        const ext = vscode.extensions.getExtension("DHayk.html-generator");
        assert.ok(ext, "Extension DHayk.html-generator must be installed/found");

        clearTemplateCache();
        const templates = await getTemplates({ extensionUri: ext.extensionUri });

        assert.strictEqual(templates.length, 3, "Must load 3 templates [html, css, js]");
        assert.ok(templates[0].includes("<!DOCTYPE html>"), "First template must be HTML");
        assert.ok(templates[1].includes(":root"), "Second template must be CSS");
        assert.ok(templates[2].includes("console.log"), "Third template must be JS");

        // Verify cache returns identical array reference
        const cached = await getTemplates({ extensionUri: ext.extensionUri });
        assert.strictEqual(templates, cached, "Second call must return cached array");
    });
});
