import type { BenchmarkDefinition } from './types.ts';
import { runBenchmark } from './runner.ts';

const WORKER_CODE = `
let count = 0;
self.onmessage = (e) => {
  if (e.data.type === 'ping') {
    self.postMessage({ type: 'pong', id: e.data.id });
  }
};
`;

function createWorker(): Worker {
  const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

async function workerRoundTrip(signal: AbortSignal) {
  const worker = createWorker();

  try {
    return await runBenchmark({
      name: 'Worker round-trip',
      warmupIterations: 5,
      measuredIterations: 50,
      signal,
      async runIteration() {
        await new Promise<void>((resolve, reject) => {
          const id = Math.random();
          const onMessage = (e: MessageEvent) => {
            if (e.data?.type === 'pong' && e.data?.id === id) {
              worker.removeEventListener('message', onMessage);
              resolve();
            }
          };
          worker.addEventListener('message', onMessage);
          worker.postMessage({ type: 'ping', id });
          signal.addEventListener(
            'abort',
            () => reject(new DOMException('Aborted', 'AbortError')),
            { once: true },
          );
        });
      },
    });
  } finally {
    worker.terminate();
  }
}

export const workerRoundtripBenchmark: BenchmarkDefinition = {
  id: 'worker-roundtrip',
  title: 'Worker Round-Trip Latency',
  description:
    'Measures postMessage round-trip latency between the main thread and a dedicated worker. This reflects messaging overhead, not general CPU performance.',
  unit: 'ms',
  notes: [
    'Results depend on message serialization (structured clone).',
    'Timer resolution and main-thread scheduling affect measurements.',
    'Not comparable across different payload sizes or worker types.',
  ],
  requiredCapabilities: ['web-workers'],
  async run(signal) {
    const result = await workerRoundTrip(signal);
    return { ...result, notes: workerRoundtripBenchmark.notes };
  },
};

export const benchmarks: BenchmarkDefinition[] = [workerRoundtripBenchmark];

export function getBenchmark(id: string): BenchmarkDefinition | undefined {
  return benchmarks.find((b) => b.id === id);
}
