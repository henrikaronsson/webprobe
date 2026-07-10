import { el, on } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';
import { collectBrowserInfo } from '../probes.ts';
import { fetchPublicIp } from '../ip-lookup.ts';
import { formatBrowserReportText } from '../report.ts';
import { detectAllCapabilities } from '../../capabilities/registry.ts';
import { renderStatusBadge } from '../../components/status-badge.ts';
import type { BrowserInfoReport } from '../types.ts';
import type { PublicIpLookupResult } from '../ip-lookup.ts';

export function render(container: HTMLElement): () => void {
  const header = renderPageHeader(
    'My Browser',
    'A runtime overview of local browser signals. Most data stays on your device; public IP is fetched from an external service when this page opens.',
  );

  const copyBtn = el(
    'button',
    {
      type: 'button',
      className: 'btn',
      disabled: true,
      'aria-label': 'Copy browser report to clipboard',
    },
    'Copy report',
  );
  header.append(el('div', { className: 'page-header-actions' }, copyBtn));

  container.append(
    header,
    el(
      'div',
      { className: 'privacy-banner' },
      'Most WebProbe data is collected locally. Opening this page also requests your public IP from api.ipify.org — the only third-party network call in WebProbe. Avoid sharing this report publicly; it may aid fingerprinting.',
    ),
  );

  const fieldsList = el('dl', { className: 'meta-list' });
  const runtimeLoading = el('p', { className: 'loading-state' }, 'Loading runtime information…');
  const runtimeError = el('p', { className: 'error-state', hidden: true }, '');

  const externalList = el('dl', { className: 'meta-list' });
  const externalLoading = el('p', { className: 'loading-state' }, 'Looking up public IP…');
  const externalError = el('p', { className: 'error-state', hidden: true }, '');

  const capSummary = el('div', { id: 'cap-summary' });
  const capLoading = el('p', { className: 'loading-state' }, 'Loading capability summary…');

  const capSection = el(
    'section',
    { className: 'card', style: 'margin-top:1.5rem' },
    el('h2', {}, 'Capability summary'),
    capLoading,
    capSummary,
  );

  const runtimeSection = el(
    'section',
    { className: 'card' },
    el('h2', {}, 'Runtime information'),
    runtimeLoading,
    runtimeError,
    fieldsList,
  );

  const externalSection = el(
    'section',
    { className: 'card', style: 'margin-top:1.5rem' },
    el('h2', {}, 'Network information (external)'),
    el(
      'p',
      { style: 'font-size:var(--text-sm);color:var(--text-muted);margin-top:0' },
      'Fetched automatically from api.ipify.org when you open this page.',
    ),
    externalLoading,
    externalError,
    externalList,
  );

  container.append(runtimeSection, externalSection, capSection);

  let report: BrowserInfoReport | null = null;
  let publicIp: PublicIpLookupResult | null = null;
  const abort = new AbortController();

  const updateCopyButton = () => {
    copyBtn.disabled = !report;
  };

  const cleanups = [
    on(copyBtn, 'click', async () => {
      if (!report) return;
      const text = formatBrowserReportText(report, publicIp ?? undefined);
      try {
        await navigator.clipboard.writeText(text);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        window.setTimeout(() => {
          copyBtn.textContent = original;
        }, 2000);
      } catch {
        copyBtn.textContent = 'Copy failed';
        window.setTimeout(() => {
          copyBtn.textContent = 'Copy report';
        }, 2000);
      }
    }),
  ];

  void (async () => {
    const [reportResult, ipResult] = await Promise.all([
      collectBrowserInfo().catch(() => null),
      fetchPublicIp(abort.signal),
    ]);

    publicIp = ipResult;
    externalLoading.remove();

    if (ipResult.ip) {
      externalList.append(
        el('dt', {}, 'Public IP'),
        el(
          'dd',
          {},
          ipResult.ip,
          ' ',
          el('span', { className: 'confidence-tag' }, `(detected · ${ipResult.source})`),
        ),
      );
    } else {
      externalError.hidden = false;
      externalError.textContent =
        ipResult.error ?? 'Public IP lookup failed. Check your network or try again later.';
    }

    if (!reportResult) {
      runtimeLoading.remove();
      runtimeError.hidden = false;
      runtimeError.textContent = 'Could not collect runtime information.';
      updateCopyButton();
      return;
    }

    report = reportResult;
    runtimeLoading.remove();

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

    updateCopyButton();

    try {
      const caps = await detectAllCapabilities();
      capLoading.remove();
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
      capSummary.append(summary);
    } catch {
      capLoading.remove();
      capSummary.append(
        el('p', { className: 'error-state' }, 'Could not load capability summary.'),
      );
    }
  })();

  return () => {
    abort.abort();
    cleanups.forEach((c) => c());
    container.replaceChildren();
  };
}
