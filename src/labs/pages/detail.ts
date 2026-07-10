import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';
import { getLab } from '../registry.ts';
import { getRouteParams } from '../../app/route-utils.ts';
import { routes } from '../../app/routes.ts';
import { getCapability } from '../../capabilities/registry.ts';

export function render(container: HTMLElement): () => void {
  const { id } = getRouteParams(routes);
  const lab = id ? getLab(id) : undefined;

  if (!lab) {
    container.append(
      renderPageHeader('Lab not found', 'No lab matches this identifier.'),
      el('p', {}, el('a', { href: '#/labs' }, 'Back to labs')),
    );
    return () => container.replaceChildren();
  }

  const mountPoint = el('div', { id: 'lab-mount' });
  const statusEl = el('output', {
    className: 'lab-output',
    'aria-live': 'polite',
    style: 'margin-bottom:1rem;font-size:0.875rem',
  });

  container.append(
    renderPageHeader(lab.title, lab.description),
    statusEl,
    mountPoint,
    el(
      'section',
      { className: 'card', style: 'margin-top:1.5rem' },
      el('h3', {}, 'Required capabilities'),
      el(
        'ul',
        {},
        ...lab.requiredCapabilities.map((capId) => {
          const cap = getCapability(capId);
          return el(
            'li',
            {},
            cap ? el('a', { href: `#/capabilities/${capId}` }, cap.title) : capId,
          );
        }),
      ),
      el('h3', {}, 'Documentation'),
      el(
        'ul',
        {},
        ...lab.docs.map((d) =>
          el(
            'li',
            {},
            el(
              'a',
              {
                href: d.url,
                className: 'external-link',
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              d.title,
            ),
          ),
        ),
      ),
    ),
    el('p', { style: 'margin-top:1rem' }, el('a', { href: '#/labs' }, '← All labs')),
  );

  let labCleanup: (() => void) | null = null;
  const controller = new AbortController();

  void (async () => {
    for (const capId of lab.requiredCapabilities) {
      const cap = getCapability(capId);
      if (!cap) continue;
      const result = await cap.detect();
      if (result.status === 'unsupported') {
        mountPoint.replaceChildren(
          el(
            'div',
            { className: 'unsupported-state' },
            el('p', {}, `This lab requires ${cap.title}, which appears unsupported.`),
            el('a', { href: `#/capabilities/${capId}` }, 'View capability details'),
          ),
        );
        return;
      }
    }

    const mod = await lab.load();
    labCleanup = mod.default.mount(mountPoint, {
      signal: controller.signal,
      report: (msg) => {
        statusEl.textContent = msg;
      },
    });
  })();

  return () => {
    controller.abort();
    labCleanup?.();
    container.replaceChildren();
  };
}
