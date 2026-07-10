import type { Route } from './router.ts';

export function parseHash(): { pathname: string; query: URLSearchParams } {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart] = raw.split('?');
  const pathname = pathPart!.startsWith('/') ? pathPart! : `/${pathPart}`;
  return { pathname, query: new URLSearchParams(queryPart ?? '') };
}

export function matchRoute(
  routes: Route[],
  pathname: string,
): { route: Route; params: Record<string, string> } | null {
  for (const route of routes) {
    const patternParts = route.path.split('/').filter(Boolean);
    const pathParts = pathname.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) continue;

    const params: Record<string, string> = {};
    let matched = true;

    for (let i = 0; i < patternParts.length; i++) {
      const pattern = patternParts[i]!;
      const segment = pathParts[i]!;
      if (pattern.startsWith(':')) {
        params[pattern.slice(1)] = decodeURIComponent(segment);
      } else if (pattern !== segment) {
        matched = false;
        break;
      }
    }

    if (matched) return { route, params };
  }

  return null;
}

export function getRouteParams(routes: Route[]): Record<string, string> {
  const { pathname } = parseHash();
  return matchRoute(routes, pathname)?.params ?? {};
}

export function getRouteQuery(): URLSearchParams {
  return parseHash().query;
}
