# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-11

### Added
- **File-Based Custom Templates**: New `htmlGenerator.customTemplateDirectory` setting allows loading custom templates directly from a workspace or absolute folder.
- **Dynamic Template Placeholders**: Support for `{{projectName}}`, `{{title}}`, `{{year}}`, and `{{date}}` (or `${variable}`) interpolated automatically during project generation.
- **Updated Default Boilerplate**:
  - HTML5 template with dynamic `{{title}}` placeholder.
  - Clean CSS template with responsive container, CSS variables, and configured default theme colors (`#24282B` background, `#ffffff` text).
  - Clean JavaScript entry point.
- **Live Server Setting**: Added `htmlGenerator.autoStartLiveServer` to toggle automatic Live Server launching.
- **Automated CI/CD Workflows**: Added GitHub Actions workflows for multi-OS CI testing and automated `.vsix` packaging on release tags.
- **TypeScript Test Suite**: Replaced stub tests with comprehensive TypeScript suites for templates, template utilities, and extension integration tests.

### Changed
- **Unified Conflict Resolution**: Replaced sequential overwrite prompts with an upfront, single dialog offering `Overwrite`, `Skip Existing`, or `Cancel`.
- **Softened Live Server Dependency**: Changed hard `extensionDependencies` to optional `extensionRecommendations` in `.vscode/extensions.json`.
- **Consistent Naming**: Aligned status bar and command titles to "Create Vanilla Project".
- **ESLint v9 Integration**: Configured `typescript-eslint` with global ignore rules for `.vscode-test`, `out`, and `node_modules`.

### Removed
- Removed unused `@vscode/codicons` runtime dependency.
- Removed invalid `"types": "./src/extension.ts"` from manifest.

## [1.0.0] - 2026-03-17

### Added

- **Enhanced Documentation**: Added high-quality demonstration GIFs to the README for each primary usage method.
- **Improved README**: Integrated Command Palette instructions and a central logo for a more professional presentation.
- **Stable Release**: First stable 1.0.0 release.

## [0.0.6] - 2026-02-23

### Fixed

- **Template Polish**: Updated default CSS and HTML templates for better modern web development defaults.
- **Project Structure**: Refined the initial project generation with improved container styling.
- **Maintenance**: Minor bug fixes and metadata improvements.

## [0.0.5] - 2026-02-23

### Added

- **Explorer Context Menu**: Right-click any folder in the Side Bar to initialize a project.
- **Customizable Templates**: Define your own boilerplate snippets via VS Code settings (`htmlGenerator.*`).
- **Atomic Operations**: Integrated a rollback mechanism to prevent partial file creation on errors.
- **Modern Core**: Full technical rewrite in TypeScript using the native `vscode.workspace.fs` API.
- **Multi-root Support**: Seamless project creation across multiple workspace folders.

### Changed

- Rebranded extension to **RapidStart Web Generator**.
- Improved professional documentation in README.
- Optimized status bar item visibility logic.

### Fixed

- Resolved race conditions during concurrent project creation attempts.
- Fixed inconsistent file overwriting behavior.

## [0.0.4] - 2024-10-30

### Added

- Status bar icon to create project files with one click.
- Support for generating `index.html`, `style.css`, and `script.js` files.
- Tooltips and clickable commands for status bar icons.

## [0.0.3] - 2024-10-10

### Added

- **Initial Release**: Launched the extension (originally "HTML CSS JS generator").
- Added the command `extension.createHtmlFile` to generate raw HTML projects.
- Integrated ESLint for code linting.
- Setup testing using `vscode-test`.

### Changed

- Updated dependencies to the latest versions.

## [0.0.2] - 2024-09-25

### Added

- Support for Node.js TypeScript definitions with `@types/node`.

### Fixed

- Minor bugs in the project generation flow.

## [0.0.1] - 2024-09-15

### Added

- Initial setup of the project structure.
- Configured the repository with ESLint and Mocha for testing.
