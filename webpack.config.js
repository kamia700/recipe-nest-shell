// Module Federation: HOST application (shell) configuration.
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'shell',
  // remotes are not listed here: their URLs are read at runtime from
  // public/mf.manifest.json (see src/main.ts).

  shared: {
    "@angular/core": { singleton: true, strictVersion: true },
    "@angular/common": { singleton: true, strictVersion: true },
    "@angular/router": { singleton: true, strictVersion: true },
    // shareAll shares ALL packages from package.json "dependencies"
    // (devDependencies are not shared).
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
