import { registerRemotesFromManifest } from './federation';

// Read remote URLs from the manifest and register them in the Module Federation runtime.
// Remotes themselves are loaded lazily, on the first visit to their route.
// An error (manifest unavailable) must not take down the shell — log it and start anyway:
// the remote's route will show a fallback (see app/remote-loader.ts).
registerRemotesFromManifest('/mf.manifest.json')
	.catch(err => console.error(err))
	// The async import() boundary is required for Module Federation —
	// otherwise "Shared module is not available for eager consumption".
	.then(() => import('./bootstrap'))
	.catch(err => console.error(err));
