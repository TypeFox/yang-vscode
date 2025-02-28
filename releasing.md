Prepare Build

1. Update yang-lsp version in package.json

2. increase extension version

3. add a changelog.md entry

4. call `yarn` (also `yarn build`, `yarn --cwd webview build`)

5. Install vsce `npm install -g @vscode/vsce`

6. Prepare and test the extension: `vsce package`

Publish Open VSX

1. Create token `https://open-vsx.org/user-settings/tokens` or use existing

2. Publish OpenVSX `npx ovsx publish -p <open vsx access token>`

Publish VSCode

1. Create token in `https://dev.azure.com/typefox/_usersSettings/tokens`

2. Login `vsce login typefox`

3. Publish: `vsce publish`

Create and push release tag
