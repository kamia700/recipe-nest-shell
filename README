# RecipeNestShell

Host (shell) application of the RecipeNest micro-frontend setup. Owns the
layout (header + sidebar) and routing, and dynamically loads remote
micro-frontends via Webpack Module Federation
(`@angular-architects/module-federation`).

See the [top-level README](../README.md) for how to run this together with
the `recipenest-mf-recipes` remote.

## Development server

Standalone (routes that depend on a remote won't render unless the remote is
also running):

```bash
npm start
```

Runs on `http://localhost:4200`.

## Remotes

Configured in [`webpack.config.js`](./webpack.config.js) and consumed in
[`src/app/app.routes.ts`](./src/app/app.routes.ts):

| Path | Remote | Expected URL | Status |
| --- | --- | --- | --- |
| `/recipes` | `recipenest-mf-recipes` | `http://localhost:4201/remoteEntry.js` | implemented |
| `/shopping` | — | `http://localhost:4202/remoteEntry.js` | no project yet, will fail to load |

## Building

```bash
ng build
```

Build artifacts are stored in `dist/recipe-nest-shell`.

## Running unit tests

```bash
ng test
```

## Additional Resources

[Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
