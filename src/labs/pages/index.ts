import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';
import { labs } from '../registry.ts';

export function render(container: HTMLElement): () => void {
  container.append(
    renderPageHeader(
      'Labs',
      'Interactive browser experiments. Each lab is isolated, lazy-loaded, and runs entirely in your browser.',
    ),
    el(
      'section',
      { className: 'card-grid' },
      ...labs.map((lab) =>
        el(
          'article',
          { className: 'card' },
          el('h2', {}, lab.title),
          el('p', {}, lab.description),
          el(
            'p',
            { style: 'font-size:0.875rem;color:var(--text-muted)' },
            `Category: ${lab.category}`,
          ),
          el(
            'div',
            { className: 'card-footer' },
            el('a', { href: `#/labs/${lab.id}`, className: 'btn btn-primary' }, 'Open lab'),
          ),
        ),
      ),
    ),
  );

  return () => container.replaceChildren();
}
