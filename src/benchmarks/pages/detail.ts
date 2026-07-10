import { el } from '../../shared/dom.ts';
import { renderPageHeader } from '../../components/page-header.ts';
import { formatNumber } from '../../shared/format.ts';
import { getBenchmark } from '../registry.ts';
import { getRouteParams } from '../../app/route-utils.ts';
import { routes } from '../../app/routes.ts';
import { getCapability } from '../../capabilities/registry.ts';

export function render(container: HTMLElement): () => void {
  const { id } = getRouteParams(routes);
  const bench = id ? getBenchmark(id) : undefined;

  if (!bench) {
    container.append(
      renderPageHeader('Benchmark not found', 'No benchmark matches this identifier.'),
      el('p', {}, el('a', { href: '#/benchmarks' }, 'Back to benchmarks')),
    );
    return () => container.replaceChildren();
  }

  const resultsEl = el('output', { className: 'lab-output', 'aria-live': 'polite' });
  resultsEl.textContent = 'Press Run to start the benchmark.';

  const runBtn = el('button', { type: 'button', className: 'btn btn-primary' }, 'Run');
  const stopBtn = el('button', { type: 'button', className: 'btn', disabled: true }, 'Stop');

  const controller = new AbortController();

  runBtn.addEventListener('click', () => {
    void (async () => {
      for (const capId of bench.requiredCapabilities) {
        const cap = getCapability(capId);
        if (cap && (await cap.detect()).status === 'unsupported') {
          resultsEl.textContent = `Requires ${cap.title}, which appears unsupported.`;
          return;
        }
      }

      runBtn.disabled = true;
      stopBtn.disabled = false;
      resultsEl.textContent = 'Running…';

      try {
        const result = await bench.run(controller.signal);
        resultsEl.textContent = [
          `Median: ${formatNumber(result.median, 3)} ${result.unit}`,
          `P95: ${formatNumber(result.p95, 3)} ${result.unit}`,
          `Iterations: ${result.iterations}`,
          `Total duration: ${formatNumber(result.durationMs, 1)} ms`,
          '',
          'Notes:',
          ...result.notes.map((n) => `• ${n}`),
        ].join('\n');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          resultsEl.textContent = 'Benchmark cancelled.';
        } else {
          resultsEl.textContent = `Error: ${err instanceof Error ? err.message : String(err)}`;
        }
      } finally {
        runBtn.disabled = false;
        stopBtn.disabled = true;
      }
    })();
  });

  stopBtn.addEventListener('click', () => {
    controller.abort();
  });

  container.append(
    renderPageHeader(bench.title, bench.description),
    el('div', { className: 'lab-controls' }, runBtn, stopBtn),
    resultsEl,
    el(
      'section',
      { className: 'card', style: 'margin-top:1.5rem' },
      el('h3', {}, 'What is measured'),
      el(
        'p',
        {},
        'Per-iteration round-trip time for postMessage between main thread and a worker.',
      ),
      el('h3', {}, 'Limitations'),
      el('ul', {}, ...bench.notes.map((n) => el('li', {}, n))),
    ),
    el('p', { style: 'margin-top:1rem' }, el('a', { href: '#/benchmarks' }, '← All benchmarks')),
  );

  return () => {
    controller.abort();
    container.replaceChildren();
  };
}
