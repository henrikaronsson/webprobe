import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';
import { renderStatusBadge } from '../../components/status-badge.ts';
import { getCapability } from '../registry.ts';
import { getRouteParams } from '../../app/route-utils.ts';
import { routes } from '../../app/routes.ts';

export function render(container: HTMLElement): () => void {
  const { id } = getRouteParams(routes);
  const cap = id ? getCapability(id) : undefined;

  if (!cap) {
    container.append(
      renderPageHeader('Capability not found', 'No capability matches this identifier.'),
      el('p', {}, el('a', { href: '#/capabilities' }, 'Back to capabilities')),
    );
    return () => container.replaceChildren();
  }

  const statusSlot = el('div', { className: 'card-footer', style: 'margin-bottom:1rem' });
  const notesList = el('ul', {});
  cap.notes.forEach((note) => notesList.append(el('li', {}, note)));

  container.append(
    renderPageHeader(cap.title, cap.description),
    el(
      'article',
      { className: 'card' },
      statusSlot,
      el(
        'dl',
        { className: 'meta-list' },
        el('dt', {}, 'Category'),
        el('dd', {}, cap.category),
        el('dt', {}, 'Documentation'),
        el(
          'dd',
          {},
          el(
            'a',
            {
              href: cap.docsUrl,
              className: 'external-link',
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            cap.docsUrl,
          ),
        ),
      ),
      el('h3', {}, 'Notes'),
      notesList,
      cap.labId
        ? el(
            'p',
            { style: 'margin-top:1rem' },
            el(
              'a',
              { href: `#/labs/${cap.labId}`, className: 'btn btn-primary' },
              'Open related lab',
            ),
          )
        : null,
    ),
    el('p', {}, el('a', { href: '#/capabilities' }, '← All capabilities')),
  );

  void Promise.resolve(cap.detect()).then((result) => {
    statusSlot.replaceChildren(renderStatusBadge(result.status));
    const summary = el(
      'p',
      { style: 'margin-top:0.75rem;color:var(--text-muted)' },
      `${result.summary} `,
      el('span', { className: 'confidence-tag' }, `(${result.confidence})`),
    );
    statusSlot.append(summary);
    if (result.notes?.length) {
      const extra = el('ul', {});
      result.notes?.forEach((n: string) => extra.append(el('li', {}, n)));
      statusSlot.append(extra);
    }
  });

  return () => container.replaceChildren();
}
