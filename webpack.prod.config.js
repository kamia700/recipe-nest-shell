// The prod config is the same as dev: remote URLs are not baked into the build;
// for production, public/mf.manifest.json is swapped instead.
module.exports = require('./webpack.config');
