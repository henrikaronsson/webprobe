import type { Route } from './router.ts';

export const routes: Route[] = [
  {
    path: '/',
    load: () => import('./pages/overview.ts'),
  },
  {
    path: '/capabilities',
    load: () => import('../capabilities/pages/index.ts'),
  },
  {
    path: '/capabilities/:id',
    load: () => import('../capabilities/pages/detail.ts'),
  },
  {
    path: '/labs',
    load: () => import('../labs/pages/index.ts'),
  },
  {
    path: '/labs/:id',
    load: () => import('../labs/pages/detail.ts'),
  },
  {
    path: '/benchmarks',
    load: () => import('../benchmarks/pages/index.ts'),
  },
  {
    path: '/benchmarks/:id',
    load: () => import('../benchmarks/pages/detail.ts'),
  },
  {
    path: '/links',
    load: () => import('../links/pages/index.ts'),
  },
  {
    path: '/my-browser',
    load: () => import('../browser/pages/index.ts'),
  },
];
