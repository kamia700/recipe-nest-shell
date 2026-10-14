# RecipeNestShell

Host (shell) application of the RecipeNest micro-frontend setup. Owns the
layout (header + sidebar) and routing, and dynamically loads remote
micro-frontends via Webpack Module Federation
(`@angular-architects/module-federation`).

See the [top-level README](../README.md) for how to run this together with
the `recipenest-mf-recipes` remote.

How the shell and the remote are wired together:
[docs/module-federation.md](./docs/module-federation.md).

## Development server

Standalone (routes that depend on a remote won't render unless the remote is
also running):

```bash
npm start
```

Runs on `http://localhost:4200`.

## Remotes

Remote URLs live in [`public/mf.manifest.json`](./public/mf.manifest.json)
(loaded at runtime by `initFederation` in [`src/main.ts`](./src/main.ts)) and
are consumed by name in [`src/app/app.routes.ts`](./src/app/app.routes.ts).
If a remote fails to load, the route shows a fallback
(`RemoteUnavailableComponent`) instead of breaking navigation.

| Path | Manifest key | URL | Status |
| --- | --- | --- | --- |
| `/recipes` | `recipes` | `http://localhost:4201/remoteEntry.js` | implemented |
| `/shopping` | — | — | no project / manifest entry yet, shows the fallback |

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
