import { initFederation } from '@angular-architects/module-federation';

// Read remote URLs from the manifest and preload their remoteEntry.js
// so shared dependencies are negotiated before Angular starts.
// An error (remote not running) must not take down the shell — log it and start anyway:
// the unavailable remote's route will show a fallback (see app/remote-loader.ts).
initFederation('/mf.manifest.json')
	.catch(err => console.error(err))
	// The async import() boundary is required for Module Federation —
	// otherwise "Shared module is not available for eager consumption".
	.then(() => import('./bootstrap'))
	.catch(err => console.error(err));
