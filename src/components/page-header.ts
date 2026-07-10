import { el } from '../shared/dom.ts';

export function renderPageHeader(title: string, description: string): HTMLElement {
  return el('header', { className: 'page-header' }, el('h1', {}, title), el('p', {}, description));
}
