# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
