// Module Federation 2.0: HOST application (shell) configuration.
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
// Only the shareAll helper is used from @angular-architects: it builds a plain `shared`
// object from package.json "dependencies", including Angular secondary entry points
// (@angular/common/http etc.) — otherwise each remote would get its own copy of them.
const { shareAll } = require('@angular-architects/module-federation/webpack');

module.exports = {
  output: {
    publicPath: 'auto',
    uniqueName: 'shell',
  },
  optimization: {
    runtimeChunk: false,
  },
  // Angular CLI emits ES modules, so remoteEntry.js is an ES module as well.
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      library: { type: 'module' },
      // remotes are not listed here: they are registered at runtime
      // from public/mf.manifest.json (see src/main.ts).

      // Shares Angular with Angular micro frontends. React/Vue micro frontends
      // share their own packages among themselves and do not depend on this list.
      shared: shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),

      // No TypeScript type generation/fetching for remotes.
      dts: false,
    }),
  ],
};
