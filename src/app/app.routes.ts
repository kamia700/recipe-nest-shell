import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { angularRemote, foreignRemote } from './remote-routes';

export const routes: Routes = [
  {
    // Shell layout (header + sidebar), shared by all micro frontends.
    // Micro frontend pages render into the <router-outlet> in layout.html.
    path: '',
    component: LayoutComponent,
    children: [
      angularRemote('recipes'),
      foreignRemote('shopping'),
      { path: '', redirectTo: 'recipes', pathMatch: 'full' }
    ]
  }
];
