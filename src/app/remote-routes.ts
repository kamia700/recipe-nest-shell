import { Route } from '@angular/router';
import { loadRemoteChildren, loadRemoteMount } from './remote-loader';

// Route helpers for micro frontends. `remote` — key in public/mf.manifest.json
// (= the remote's federation `name`), defaults to the route path.
// Nested pages (/recipes/42 etc.) are defined by the micro frontend itself.

/** Angular micro frontend: exposes './Routes' with export 'routes'. */
export const angularRemote = (path: string, remote = path): Route => ({
  path,
  loadChildren: () => loadRemoteChildren(remote, './Routes', 'routes')
});

/**
 * Micro frontend in any other framework (React, Vue, ...): exposes './mount'
 * with export 'mount' (contract in remote-contract.ts).
 * Assumes the route is mounted at the shell root, so basePath is '/<path>'.
 */
export const foreignRemote = (path: string, remote = path): Route => ({
  path,
  loadChildren: () => loadRemoteMount(remote, `/${path}`)
});
