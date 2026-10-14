import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Shown in place of a micro frontend that failed to load.
@Component({
  selector: 'app-remote-unavailable',
  templateUrl: './remote-unavailable.html'
})
export class RemoteUnavailableComponent {
  protected readonly remoteName: string =
    inject(ActivatedRoute).snapshot.data['remoteName'] ?? 'unknown';

  // The Router caches the loadComponent/loadChildren result, so navigating
  // again would return the fallback again — a full page reload is needed.
  protected retry(): void {
    window.location.reload();
  }
}
