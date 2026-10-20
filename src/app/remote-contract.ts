// Contract between the shell and a NON-Angular micro frontend (React, Vue, ...).
// The micro frontend exposes a function (by default './mount', export 'mount')
// that renders itself into the element it is given and returns a handle for cleanup.
// Nothing here depends on a framework, so the same contract works for any stack.

export interface MountContext {
  /** URL prefix owned by the micro frontend, e.g. '/shopping'. Use it as the router basename. */
  basePath: string;
  /** Navigates the shell, for links outside the micro frontend (e.g. '/recipes'). */
  navigate(url: string): void;
}

export interface MountedRemote {
  /** Called when the user leaves the micro frontend's section. */
  unmount(): void;
  /**
   * Called when the shell itself navigates inside this section (e.g. a sidebar link
   * to '/shopping' while '/shopping/42' is open). `path` is relative to basePath.
   * The history entry already exists — the micro frontend should replace, not push.
   */
  navigate?(path: string): void;
}

export type MountFn = (element: HTMLElement, context: MountContext) => MountedRemote;
