import { median, percentile } from '../shared/format.ts';
import type { BenchmarkConfig, BenchmarkResult } from './types.ts';

function getEnvironment(): Record<string, string | number | undefined> {
  return {
    userAgent: navigator.userAgent,
    cores: navigator.hardwareConcurrency,
    timestamp: new Date().toISOString(),
  };
}

export async function runBenchmark(config: BenchmarkConfig): Promise<BenchmarkResult> {
  const { name, warmupIterations, measuredIterations, signal, runIteration } = config;

  for (let i = 0; i < warmupIterations; i++) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    await runIteration();
  }

  const values: number[] = [];
  const start = performance.now();

  for (let i = 0; i < measuredIterations; i++) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    const iterStart = performance.now();
    await runIteration();
    values.push(performance.now() - iterStart);
  }

  const durationMs = performance.now() - start;

  return {
    name,
    unit: 'ms',
    values,
    median: median(values),
    p95: percentile(values, 95),
    iterations: measuredIterations,
    durationMs,
    notes: [],
    environment: getEnvironment(),
  };
}
