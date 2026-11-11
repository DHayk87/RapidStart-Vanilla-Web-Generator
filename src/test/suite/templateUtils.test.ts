import * as assert from "assert";
import * as vscode from "vscode";
import {
    interpolateVariables,
    getProjectVariables,
    resolveTemplateDirectory,
} from "../../utils/templateUtils";

suite("Template Utilities Test Suite", () => {
    test("interpolateVariables replaces {{key}} and ${key} placeholders", () => {
        const raw = "<h1>{{title}}</h1><p>Created in ${year} by {{ author }}</p>";
        const vars = {
            title: "My Site",
            year: "2026",
            author: "Developer",
        };

        const result = interpolateVariables(raw, vars);
        assert.strictEqual(
            result,
            "<h1>My Site</h1><p>Created in 2026 by Developer</p>",
        );
    });

    test("interpolateVariables preserves unmapped variables", () => {
        const raw = "<div>{{title}} - ${unknownVar}</div>";
        const result = interpolateVariables(raw, { title: "Test" });
        assert.strictEqual(result, "<div>Test - ${unknownVar}</div>");
    });

    test("getProjectVariables formats project title and name correctly", () => {
        const sampleUri = vscode.Uri.file("/workspace/awesome-web-app");
        const vars = getProjectVariables(sampleUri);

        assert.strictEqual(vars.projectName, "awesome-web-app");
        assert.strictEqual(vars.title, "Awesome Web App");
        assert.strictEqual(vars.year, new Date().getFullYear().toString());
        assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(vars.date), "Date should match YYYY-MM-DD");
    });

    test("resolveTemplateDirectory handles relative and absolute paths", () => {
        const workspaceUri = vscode.Uri.file("/workspace/project");

        const relative = resolveTemplateDirectory(workspaceUri, ".templates");
        assert.ok(relative, "Relative path should resolve");
        assert.ok(relative.path.endsWith("/workspace/project/.templates"));

        const empty = resolveTemplateDirectory(workspaceUri, "   ");
        assert.strictEqual(empty, null, "Empty path should return null");
    });
});

