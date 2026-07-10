import { el, on } from '../shared/dom.ts';
import { toggleTheme } from '../shared/storage.ts';

const NAV_ITEMS = [
  { label: 'Overview', path: '/' },
  { label: 'Capabilities', path: '/capabilities' },
  { label: 'Labs', path: '/labs' },
  { label: 'Benchmarks', path: '/benchmarks' },
  { label: 'Links', path: '/links' },
  { label: 'My Browser', path: '/my-browser' },
];

export function renderNavigation(
  container: HTMLElement,
  currentPath: string,
  onNavigate: (path: string) => void,
): () => void {
  clearNavigation(container);

  const nav = el('nav', { className: 'app-nav', 'aria-label': 'Main' });

  for (const item of NAV_ITEMS) {
    const isActive =
      item.path === '/'
        ? currentPath === '/'
        : currentPath === item.path || currentPath.startsWith(`${item.path}/`);

    const link = el(
      'a',
      {
        href: `#${item.path}`,
        'aria-current': isActive ? 'page' : undefined,
      },
      item.label,
    );

    nav.append(link);
  }

  container.append(nav);

  const cleanups = [
    on(nav, 'click', (event) => {
      const target = (event.target as HTMLElement).closest('a');
      if (!target) return;
      event.preventDefault();
      const href = target.getAttribute('href')?.replace(/^#/, '') ?? '/';
      onNavigate(href);
    }),
  ];

  return () => {
    cleanups.forEach((c) => c());
    clearNavigation(container);
  };
}

function clearNavigation(container: HTMLElement): void {
  container.querySelector('.app-nav')?.remove();
}

export function renderThemeToggle(container: HTMLElement): () => void {
  const label = () => (document.documentElement.dataset.theme === 'dark' ? 'Dark' : 'Light');

  const btn = el(
    'button',
    {
      type: 'button',
      className: 'btn',
      'aria-label': `Current theme: ${label()}. Click to switch.`,
    },
    label(),
  );

  container.append(btn);

  return on(btn, 'click', () => {
    toggleTheme();
    btn.textContent = label();
    btn.setAttribute('aria-label', `Current theme: ${label()}. Click to switch.`);
  });
}
