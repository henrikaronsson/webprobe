import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';
import { renderStatusBadge } from '../../components/status-badge.ts';
import { capabilities } from '../registry.ts';

export function render(container: HTMLElement): () => void {
  container.append(
    renderPageHeader(
      'Capabilities',
      'Browser API support detection with explicit uncertainty. Detection indicates exposure, not full feature guarantees.',
    ),
  );

  const grid = el('section', { className: 'card-grid' });
  const loading = el('p', { className: 'loading-state' }, 'Loading capabilities…');
  container.append(loading, grid);

  void (async () => {
    for (const cap of capabilities) {
      const result = await cap.detect();
      const card = el(
        'article',
        { className: 'card' },
        el(
          'div',
          { className: 'card-footer', style: 'margin-bottom:0.75rem' },
          renderStatusBadge(result.status),
        ),
        el('h2', {}, cap.title),
        el('p', {}, cap.description),
        el(
          'div',
          { className: 'card-footer' },
          el('a', { href: `#/capabilities/${cap.id}` }, 'Details'),
          cap.labId ? el('a', { href: `#/labs/${cap.labId}` }, 'Open lab') : null,
        ),
      );
      grid.append(card);
    }
    loading.remove();
  })();

  return () => container.replaceChildren();
}
