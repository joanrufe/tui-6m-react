## Linter rules

If you use VS code skip to the next section, otherwise set your editor so it uses the configuration files in each linter file (.eslintrc, .stylelintrc and .prettierrc).

## VScode settings

If you are a VScode user, please enable this extensions in the project workspace:

- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [stylelint](https://marketplace.visualstudio.com/items?hex-ci.stylelint-plus)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

And make sure you have this settings in the root folder:

```json
{
  "eslint.workingDirectories": ["frontend"],
  "css.validate": false,
  "scss.validate": false,
  "editor.formatOnSave": true,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

# How to develop

Go to `frontend` folder and run:

```sh
npm install
npm run develop
```

Go to `middlelayer` folder and run:

```sh
npm start
```

# How to deploy

Go to the root folder of the project and execute:

```sh
npm run build
```
