import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

suite("Templates Validation Test Suite", () => {
    const templatesDir = path.resolve(__dirname, "../../../templates");

    test("html.template exists and contains required elements", () => {
        const htmlPath = path.join(templatesDir, "html.template");
        assert.ok(fs.existsSync(htmlPath), "html.template must exist");

        const content = fs.readFileSync(htmlPath, "utf-8");
        assert.ok(content.includes("<!DOCTYPE html>"), "Must include HTML5 doctype");
        assert.ok(content.includes("viewport"), "Must include viewport meta tag");
        assert.ok(
            content.includes("./css/style.css"),
            "Must link to ./css/style.css",
        );
        assert.ok(
            content.includes("./js/script.js"),
            "Must include script pointing to ./js/script.js",
        );
    });

    test("css.template exists and contains essential styling rules", () => {
        const cssPath = path.join(templatesDir, "css.template");
        assert.ok(fs.existsSync(cssPath), "css.template must exist");

        const content = fs.readFileSync(cssPath, "utf-8");
        assert.ok(content.includes(":root"), "Must define CSS variables on :root");
        assert.ok(content.includes("box-sizing: border-box"), "Must include box-sizing reset");
        assert.ok(content.includes(".container"), "Must define container class");
    });

    test("js.template exists and has valid content", () => {
        const jsPath = path.join(templatesDir, "js.template");
        assert.ok(fs.existsSync(jsPath), "js.template must exist");

        const content = fs.readFileSync(jsPath, "utf-8");
        assert.ok(content.trim().length > 0, "js.template must not be empty");
    });
});

