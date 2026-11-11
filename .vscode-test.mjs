import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
    version: "1.94.0",
    files: "out/test/**/*.test.js",
});
