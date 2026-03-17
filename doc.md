## To run the project
Run  `bun install` then   `bun run dev`



## VS CODE ESLINT CONFIG
### .vscode/settings.json
{
  "files.watcherExclude": {
    "**/routeTree.gen.ts": true
  },
  "search.exclude": {
    "**/routeTree.gen.ts": true
  },
  "files.readonlyInclude": {
    "**/routeTree.gen.ts": true
  },
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.organizeImports.eslint": "always",
    "source.fixAll.eslint": "always",
  }
}