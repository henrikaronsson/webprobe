export interface BenchmarkConfig {
  name: string;
  warmupIterations: number;
  measuredIterations: number;
  signal: AbortSignal;
  runIteration: () => void | Promise<void>;
}

export interface BenchmarkResult {
  name: string;
  unit: string;
  values: number[];
  median: number;
  p95: number;
  iterations: number;
  durationMs: number;
  notes: string[];
  environment: Record<string, string | number | undefined>;
}

export interface BenchmarkDefinition {
  id: string;
  title: string;
  description: string;
  unit: string;
  notes: string[];
  requiredCapabilities: string[];
  run: (signal: AbortSignal) => Promise<BenchmarkResult>;
}
