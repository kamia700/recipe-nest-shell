import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { loadRemoteChildren } from './remote-loader';

export const routes: Routes = [
  {
    // Shell layout (header + sidebar), shared by all micro frontends.
    // Micro frontend pages render into the <router-outlet> in layout.html.
    path: '',
    component: LayoutComponent,
    children: [
      // CRITICAL: shell <-> micro frontend integration points. All are wired the same way:
      // 1st argument — key in public/mf.manifest.json (which holds the remoteEntry.js URL);
      // './Routes'   — key in the micro frontend's webpack.config.js exposes;
      // 'routes'     — export name in its src/app/app.routes.ts.
      // Nested pages (/recipes/42 etc.) are defined by the micro frontend itself.
      {
        path: 'recipes',
        loadChildren: () => loadRemoteChildren('recipes', './Routes', 'routes')
      },
      {
        // No project or manifest entry yet — this shows the fallback for now.
        path: 'shopping',
        loadChildren: () => loadRemoteChildren('shopping', './Routes', 'routes')
      },
      {
        path: '',
        redirectTo: 'recipes',
        pathMatch: 'full'
      }
    ]
  }
];
