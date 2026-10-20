import { registerRemotes } from '@module-federation/enhanced/runtime';

// Entry in public/mf.manifest.json: either the remoteEntry.js URL (an ES module —
// Angular and Vite remotes both build that way), or an object with an explicit type
// (e.g. "var" for a remote built by webpack without library.type = 'module').
type ManifestEntry = string | { entry: string; type?: string };

/**
 * Reads remote URLs from the manifest and registers them in the Module Federation runtime.
 * The manifest key is the remote's name: it must match `name` in its federation config
 * and is the prefix in loadRemote('<name>/<expose>').
 */
export async function registerRemotesFromManifest(url: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  const manifest: Record<string, ManifestEntry> = await response.json();

  registerRemotes(
    Object.entries(manifest).map(([name, value]) =>
      typeof value === 'string'
        ? { name, entry: value, type: 'module' }
        : { name, entry: value.entry, type: value.type ?? 'module' }
    )
  );
}
