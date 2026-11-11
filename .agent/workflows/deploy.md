---
description: How to build, package, and deploy the RapidStart Web Generator extension
---

# Deployment Workflow

Follow these steps to package and publish your VS Code extension.

## 1. Automated Release (Recommended via GitHub Actions)

The repository is configured with a GitHub Actions workflow (`.github/workflows/release.yml`):

1. Commit all your changes and ensure tests pass:
   ```powershell
   npm test
   ```
2. Create and push a version tag:
   ```powershell
   git tag v1.1.0
   git push origin v1.1.0
   ```
3. GitHub Actions will automatically:
   - Run compilation, linting, and extension tests.
   - Package the extension into `html-generator-1.1.0.vsix`.
   - Create a GitHub Release with the `.vsix` attached.
   - If `VSCE_PAT` secret is configured in repository secrets, publish directly to the VS Code Marketplace.

---

## 2. Manual Packaging via VSCE

If you prefer to build the `.vsix` locally:

### Run Build & Verification
```powershell
npm run pretest
```

### Package Extension
You can run `vsce` using `npx` without needing a global installation:
```powershell
npx @vscode/vsce package --no-dependencies
```
This generates `html-generator-<version>.vsix`.

> [!TIP]
> You can manually install this file in VS Code to test it:
> 1. Open the Extensions view (`Ctrl+Shift+X`).
> 2. Click the `...` (Views and More Actions) menu in the top right.
> 3. Select **Install from VSIX...** and pick the generated file.

---

## 3. Manual Publishing to the Marketplace

To publish manually, obtain a Personal Access Token (PAT) with *Marketplace (Manage)* scope from [Azure DevOps](https://aka.ms/azure-devops-pat):

```powershell
npx @vscode/vsce publish -p <your-personal-access-token> --no-dependencies
```

---

## Important Notes

- **Version Bump**: Increment `version` in `package.json` before publishing.
- **Publisher**: Ensure your publisher ID (`DHayk`) matches your Marketplace publisher profile.
- **Changelog**: Keep `CHANGELOG.md` synchronized with all releases.
