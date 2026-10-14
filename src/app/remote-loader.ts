import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { RemoteUnavailableComponent } from './remote-unavailable/remote-unavailable.component';

// Loads a micro frontend's routes by name from public/mf.manifest.json.
// On any error a fallback is returned instead of failing navigation.

/** For loadChildren: the micro frontend exposes an array of routes. */
export function loadRemoteChildren(
  remoteName: string,
  exposedModule: string,
  exportName: string
): Promise<Routes> {
  return loadRemoteModule({ type: 'manifest', remoteName, exposedModule })
    .then(m => {
      const children = m[exportName];
      if (!Array.isArray(children)) {
        throw new Error(`Remote "${remoteName}" does not export routes "${exportName}" from "${exposedModule}"`);
      }
      return children;
    })
    .catch(err => {
      console.error(`Failed to load remote "${remoteName}"`, err);
      // '**' — fallback for any nested path in this section.
      return [{ path: '**', component: RemoteUnavailableComponent, data: { remoteName } }];
    });
}
