const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'shell',
  remotes: {
    recipes: 'recipes@http://localhost:4201/remoteEntry.js',
    shopping: 'shopping@http://localhost:4202/remoteEntry.js',
  },

  shared: {
    "@angular/core": { singleton: true, strictVersion: true },
    "@angular/common": { singleton: true, strictVersion: true },
    "@angular/router": { singleton: true, strictVersion: true },
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
