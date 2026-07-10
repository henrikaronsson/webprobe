import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';

export function render(container: HTMLElement): () => void {
  container.append(
    renderPageHeader('Page not found', 'The route you requested does not exist.'),
    el('p', {}, el('a', { href: '#/' }, 'Return to overview')),
  );
  return () => container.replaceChildren();
}
