import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';
import { benchmarks } from '../registry.ts';

export function render(container: HTMLElement): () => void {
  container.append(
    renderPageHeader(
      'Benchmarks',
      'Small, transparent, local benchmarks. Raw measurements with explicit limitations — no universal performance scores.',
    ),
    el(
      'section',
      { className: 'card-grid' },
      ...benchmarks.map((bench) =>
        el(
          'article',
          { className: 'card' },
          el('h2', {}, bench.title),
          el('p', {}, bench.description),
          el(
            'ul',
            {},
            ...bench.notes.map((n) =>
              el('li', { style: 'font-size:0.875rem;color:var(--text-muted)' }, n),
            ),
          ),
          el(
            'div',
            { className: 'card-footer' },
            el(
              'a',
              { href: `#/benchmarks/${bench.id}`, className: 'btn btn-primary' },
              'Run benchmark',
            ),
          ),
        ),
      ),
    ),
  );

  return () => container.replaceChildren();
}
