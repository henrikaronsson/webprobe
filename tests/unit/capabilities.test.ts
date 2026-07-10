import { describe, it, expect } from 'vitest';
import { detectWebGpu } from '../../src/capabilities/detectors/webgpu.ts';
import { detectWebWorkers } from '../../src/capabilities/detectors/web-workers.ts';
import { detectCompressionStreams } from '../../src/capabilities/detectors/compression-streams.ts';

describe('capability detectors', () => {
  it('detectWebGpu returns a valid result shape', () => {
    const result = detectWebGpu();
    expect(['supported', 'unsupported', 'unknown']).toContain(result.status);
    expect(result.summary).toBeTruthy();
  });

  it('detectWebWorkers when Worker exists', () => {
    const original = globalThis.Worker;
    globalThis.Worker = function () {} as unknown as typeof Worker;
    expect(detectWebWorkers().status).toBe('supported');
    globalThis.Worker = original;
  });

  it('detectCompressionStreams when API missing', () => {
    const original = globalThis.CompressionStream;
    // @ts-expect-error test override
    delete globalThis.CompressionStream;
    expect(detectCompressionStreams().status).toBe('unsupported');
    globalThis.CompressionStream = original;
  });
});
