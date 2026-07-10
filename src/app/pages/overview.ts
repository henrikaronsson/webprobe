import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';

export function render(container: HTMLElement): () => void {
  container.append(
    renderPageHeader(
      'WebProbe',
      'A dependency-light laboratory for exploring browser APIs, detecting capabilities, running local benchmarks, and browsing curated developer resources.',
    ),
    el(
      'section',
      { className: 'card-grid' },
      ...[
        [
          'Capabilities',
          'Detect support for modern browser APIs with honest uncertainty labels.',
          '/capabilities',
        ],
        ['Labs', 'Interactive experiments you can run locally in your browser.', '/labs'],
        ['Benchmarks', 'Small, transparent benchmarks with clear limitations.', '/benchmarks'],
        ['Links', 'A curated, opinionated catalog of useful web development resources.', '/links'],
        [
          'My Browser',
          'A privacy-aware runtime overview of what your browser exposes.',
          '/my-browser',
        ],
      ].map(([title, desc, path]) =>
        el(
          'article',
          { className: 'card' },
          el('h2', {}, title),
          el('p', {}, desc),
          el(
            'div',
            { className: 'card-footer' },
            el('a', { href: `#${path}`, className: 'btn btn-primary' }, 'Explore'),
          ),
        ),
      ),
    ),
  );

  return () => container.replaceChildren();
}
