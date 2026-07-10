import { clearChildren } from '../shared/dom.ts';
import { matchRoute, parseHash } from './route-utils.ts';

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
}

export interface Route {
  path: string;
  load: () => Promise<{ render: (container: HTMLElement) => () => void }>;
}

export type RouteChangeHandler = (match: RouteMatch | null) => void;

export function createRouter(routes: Route[], onChange: RouteChangeHandler) {
  let cleanup: (() => void) | null = null;

  async function resolve(): Promise<void> {
    const { pathname, query } = parseHash();
    const matched = matchRoute(routes, pathname);

    cleanup?.();
    cleanup = null;

    const container = document.getElementById('main');
    if (!container) return;

    clearChildren(container);

    if (!matched) {
      onChange(null);
      const notFound = await import('./pages/not-found.ts');
      const pageCleanup = notFound.render(container);
      cleanup = () => pageCleanup();
      return;
    }

    const module = await matched.route.load();
    onChange({
      path: matched.route.path,
      params: matched.params,
      query,
    });

    const pageCleanup = module.render(container);
    cleanup = () => pageCleanup();
  }

  function navigate(path: string): void {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    location.hash = normalized;
  }

  function start(): void {
    window.addEventListener('hashchange', () => void resolve());
    if (!location.hash) {
      location.hash = '#/';
    }
    void resolve();
  }

  return { start, navigate, getPath: () => parseHash().pathname };
}
