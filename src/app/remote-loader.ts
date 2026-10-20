import { Routes } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { RemoteUnavailableComponent } from './remote-unavailable/remote-unavailable.component';
import { ForeignRemoteComponent, ForeignRemoteData } from './foreign-remote/foreign-remote.component';
import { MountFn } from './remote-contract';

// Loads micro frontends by name from public/mf.manifest.json (registered in main.ts).
// On any error a fallback is returned instead of failing navigation.

/** Angular micro frontend: exposes an array of routes, mounted via loadChildren. */
export function loadRemoteChildren(
  remoteName: string,
  exposedModule: string,
  exportName: string
): Promise<Routes> {
  return loadExport(remoteName, exposedModule, exportName)
    .then(children => {
      if (!Array.isArray(children)) {
        throw new Error(`Remote "${remoteName}" does not export routes "${exportName}" from "${exposedModule}"`);
      }
      return children;
    })
    .catch(err => fallback(remoteName, err));
}

/**
 * Micro frontend in any other framework (React, Vue, ...): exposes a mount function
 * (see remote-contract.ts). Also for loadChildren — every nested path ('**') renders
 * the same ForeignRemoteComponent, and the micro frontend routes inside itself.
 * `basePath` — URL prefix of the section in the shell, e.g. '/shopping'.
 */
export function loadRemoteMount(
  remoteName: string,
  basePath: string,
  exposedModule = './mount',
  exportName = 'mount'
): Promise<Routes> {
  return loadExport(remoteName, exposedModule, exportName)
    .then(mount => {
      if (typeof mount !== 'function') {
        throw new Error(`Remote "${remoteName}" does not export function "${exportName}" from "${exposedModule}"`);
      }
      const data: ForeignRemoteData = { remoteName, mount: mount as MountFn, basePath };
      return [{ path: '**', component: ForeignRemoteComponent, data }];
    })
    .catch(err => fallback(remoteName, err));
}

async function loadExport(remoteName: string, exposedModule: string, exportName: string) {
  // MF 2.0 id: '<remote name>/<expose without ./>', e.g. 'recipes/Routes'.
  const id = `${remoteName}/${exposedModule.replace(/^\.\//, '')}`;
  const module = await loadRemote<Record<string, unknown>>(id);
  if (!module) {
    throw new Error(`Remote module "${id}" was not loaded`);
  }
  return module[exportName];
}

function fallback(remoteName: string, err: unknown): Routes {
  console.error(`Failed to load remote "${remoteName}"`, err);
  // '**' — fallback for any nested path in this section.
  return [{ path: '**', component: RemoteUnavailableComponent, data: { remoteName } }];
}
