---
description: How to build and deploy the RapidStart Web Generator extension
---

# Deployment Workflow

Follow these steps to package and publish your VS Code extension.

## 1. Prerequisites

Ensure you have the Visual Studio Code Extension Manager (`vsce`) installed globally:

```powershell
npm install -g @vscode/vsce
```

## 2. Final Build Check

Run a fresh compile to ensure the latest changes are included in the build:
// turbo

```powershell
npm run compile
```

## 3. Package the Extension

Create the `.vsix` package. This command will generate a file named `html-generator-0.0.5.vsix`.

```powershell
vsce package
```

> [!TIP]
> You can manually install this file in VS Code to test it. Go to the Extensions view, click the `...` menu, and select **Install from VSIX...**.

## 4. Publish to the Marketplace

To publish, you will need a Personal Access Token (PAT) from [Azure DevOps](https://aka.ms/azure-devops-pat).

### Login (One-time setup)

```powershell
vsce login <publisher-id>
```

### Publish

```powershell
vsce publish
```

---

## Important Notes

- **Version Bump**: Remember to increment the `version` in `package.json` for subsequent updates.
- **Publisher**: Ensure your publisher ID (`DHayk`) matches your Marketplace account.
- **Changelog**: Keep `CHANGELOG.md` updated before each release.
