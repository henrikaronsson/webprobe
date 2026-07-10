import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';
import { collectBrowserInfo } from '../probes.ts';
import { detectAllCapabilities } from '../../capabilities/registry.ts';
import { renderStatusBadge } from '../../components/status-badge.ts';

export function render(container: HTMLElement): () => void {
  container.append(
    renderPageHeader(
      'My Browser',
      'A privacy-aware runtime overview. Information stays on your device unless you copy it elsewhere.',
    ),
    el(
      'div',
      { className: 'privacy-banner' },
      'WebProbe does not send browser information to any server. Some values are approximated or unavailable by design. Avoid sharing this page publicly — it may aid fingerprinting.',
    ),
  );

  const fieldsList = el('dl', { className: 'meta-list' });
  const capSection = el(
    'section',
    { className: 'card', style: 'margin-top:1.5rem' },
    el('h2', {}, 'Capability summary'),
    el('div', { id: 'cap-summary' }),
  );

  container.append(
    el('section', { className: 'card' }, el('h2', {}, 'Runtime information'), fieldsList),
    capSection,
  );

  void (async () => {
    const report = await collectBrowserInfo();
    for (const field of report.fields) {
      fieldsList.append(
        el('dt', {}, field.label),
        el(
          'dd',
          {},
          field.value ?? 'Unavailable',
          ' ',
          el('span', { className: 'confidence-tag' }, `(${field.confidence} · ${field.source})`),
          field.notes ? el('br', {}) : null,
          field.notes ? el('small', { style: 'color:var(--text-muted)' }, field.notes) : null,
        ),
      );
    }

    const caps = await detectAllCapabilities();
    const summary = el('div', { className: 'card-grid' });
    for (const [id, result] of Object.entries(caps)) {
      summary.append(
        el(
          'div',
          { className: 'card' },
          el('strong', {}, id),
          el('div', { style: 'margin-top:0.5rem' }, renderStatusBadge(result.status)),
        ),
      );
    }
    capSection.querySelector('#cap-summary')?.append(summary);
  })();

  return () => container.replaceChildren();
}
