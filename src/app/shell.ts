import { el } from '../shared/dom.ts';
import { createRouter } from './router.ts';
import { routes } from './routes.ts';
import { renderNavigation, renderThemeToggle } from './navigation.ts';
import { getPreferredTheme, applyTheme } from '../shared/storage.ts';

function getCurrentPathFromHash(): string {
  const raw = location.hash.replace(/^#/, '') || '/';
  return raw.split('?')[0]!.startsWith('/') ? raw.split('?')[0]! : `/${raw.split('?')[0]}`;
}

export function boot(): void {
  const root = document.getElementById('app');
  if (!root) throw new Error('#app not found');

  applyTheme(getPreferredTheme());

  const skipLink = el('a', { className: 'skip-link', href: '#main' }, 'Skip to content');

  const header = el('header', { className: 'app-header' });
  const brand = el(
    'div',
    { className: 'app-brand' },
    el('strong', {}, 'WebProbe'),
    el('span', {}, 'Explore what the modern web platform can do.'),
  );
  const headerActions = el('div', { style: 'display:flex;gap:0.5rem;align-items:center' });

  header.append(brand, headerActions);

  const main = el('main', { id: 'main', className: 'app-main', tabindex: '-1' });
  const footer = el(
    'footer',
    { className: 'app-footer' },
    'WebProbe — local browser exploration. Public IP lookup uses api.ipify.org on My Browser only.',
  );

  const shell = el('div', { className: 'app-shell' }, skipLink, header, main, footer);
  root.append(shell);

  let navCleanup: (() => void) | null = null;
  renderThemeToggle(headerActions);

  const router = createRouter(routes, () => {
    navCleanup?.();
    navCleanup = renderNavigation(header, getCurrentPathFromHash(), (p) => router.navigate(p));
  });

  router.start();
}
