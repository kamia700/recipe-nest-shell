import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MountedRemote, MountFn } from '../remote-contract';
import { RemoteUnavailableComponent } from '../remote-unavailable/remote-unavailable.component';

/** Route data set by loadRemoteMount. */
export interface ForeignRemoteData {
  remoteName: string;
  mount: MountFn;
  /** URL prefix of the section in the shell, e.g. '/shopping'. */
  basePath: string;
}

// Host for a non-Angular micro frontend: calls its mount() on enter and unmount() on leave.
// Registered under '**' by loadRemoteMount, so the Angular Router keeps this component
// alive while the micro frontend's own router changes nested paths.
// Render errors inside the micro frontend are its own business (error boundary in the remote);
// here we only handle mount() throwing synchronously.
@Component({
  selector: 'app-foreign-remote',
  imports: [RemoteUnavailableComponent],
  template: '@if (failed()) { <app-remote-unavailable /> }'
})
export class ForeignRemoteComponent {
  protected readonly failed = signal(false);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);
    const { mount, basePath, remoteName } = inject(ActivatedRoute).snapshot.data as ForeignRemoteData;

    afterNextRender(() => {
      // Mount into a child, not the host itself: the remote may attach a shadow root
      // to its element, which would hide the fallback rendered by the template.
      const container = el.appendChild(document.createElement('div'));
      let remote: MountedRemote;
      try {
        remote = mount(container, { basePath, navigate: url => void router.navigateByUrl(url) });
      } catch (err) {
        console.error(`Failed to mount remote "${remoteName}"`, err);
        container.remove();
        this.failed.set(true);
        return;
      }
      const sync = forwardShellNavigation(router, basePath, remote);
      destroyRef.onDestroy(() => {
        sync.unsubscribe();
        remote.unmount();
      });
    });
  }
}

// The micro frontend's router only listens to popstate, so it does not see
// navigations made by the shell (pushState). Forward those to it.
// Back/forward ('popstate') is skipped: both routers already handle it.
function forwardShellNavigation(router: Router, basePath: string, remote: MountedRemote) {
  let trigger: NavigationStart['navigationTrigger'];
  return router.events.subscribe(e => {
    if (e instanceof NavigationStart) trigger = e.navigationTrigger;
    if (e instanceof NavigationEnd && trigger === 'imperative' && isInside(e.urlAfterRedirects, basePath)) {
      remote.navigate?.(e.urlAfterRedirects.slice(basePath.length) || '/');
    }
  });
}

// Plain startsWith(base) would also match '/shopping-list' for '/shopping'.
const isInside = (url: string, base: string) =>
  url === base || ['/', '?', '#'].some(sep => url.startsWith(base + sep));
