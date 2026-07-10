import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';
import { catalog } from '../catalog.ts';
import { LINK_CATEGORIES } from '../types.ts';
import { getRouteQuery } from '../../app/route-utils.ts';

export function render(container: HTMLElement): () => void {
  const query = getRouteQuery();
  const initialCategory = query.get('category') ?? '';
  const initialSearch = query.get('q') ?? '';

  container.append(
    renderPageHeader(
      'Useful Links',
      'A small, opinionated catalog of high-quality web development resources. Not a bookmark dump.',
    ),
  );

  const searchInput = el('input', {
    type: 'search',
    placeholder: 'Search links…',
    'aria-label': 'Search links',
    value: initialSearch,
  }) as HTMLInputElement;

  const categorySelect = el('select', { 'aria-label': 'Filter by category' }) as HTMLSelectElement;
  categorySelect.append(el('option', { value: '' }, 'All categories'));
  for (const cat of LINK_CATEGORIES) {
    categorySelect.append(
      el(
        'option',
        { value: cat.id, selected: cat.id === initialCategory ? true : undefined },
        cat.label,
      ),
    );
  }

  const filterBar = el('div', { className: 'filter-bar' }, searchInput, categorySelect);
  const list = el('section', { className: 'card-grid' });

  container.append(filterBar, list);

  const renderList = () => {
    const term = searchInput.value.toLowerCase();
    const category = categorySelect.value;

    const filtered = catalog.filter((link) => {
      const matchesCategory = !category || link.category === category;
      const matchesSearch =
        !term ||
        link.title.toLowerCase().includes(term) ||
        link.description.toLowerCase().includes(term) ||
        link.tags.some((t) => t.includes(term));
      return matchesCategory && matchesSearch;
    });

    list.replaceChildren(
      ...filtered.map((link) =>
        el(
          'article',
          { className: 'card' },
          link.featured
            ? el(
                'span',
                {
                  className: 'status-badge status-badge--supported',
                  style: 'margin-bottom:0.5rem',
                },
                'Featured',
              )
            : null,
          el(
            'h2',
            {},
            el(
              'a',
              {
                href: link.url,
                className: 'external-link',
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              link.title,
            ),
          ),
          el('p', {}, link.description),
          el(
            'p',
            { style: 'font-size:0.75rem;color:var(--text-muted)' },
            `${LINK_CATEGORIES.find((c) => c.id === link.category)?.label ?? link.category}`,
            link.official ? ' · Official' : '',
            ` · ${link.tags.join(', ')}`,
          ),
        ),
      ),
    );

    if (filtered.length === 0) {
      list.replaceChildren(
        el('p', { className: 'unsupported-state' }, 'No links match your filters.'),
      );
    }
  };

  searchInput.addEventListener('input', renderList);
  categorySelect.addEventListener('change', renderList);
  renderList();

  return () => container.replaceChildren();
}
