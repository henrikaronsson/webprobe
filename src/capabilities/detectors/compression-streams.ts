import type { CapabilityResult } from '../../shared/types.ts';

export function detectCompressionStreams(): CapabilityResult {
  if (typeof CompressionStream === 'undefined' || typeof DecompressionStream === 'undefined') {
    return {
      status: 'unsupported',
      confidence: 'detected',
      summary: 'Compression Streams API is not exposed.',
    };
  }
  return {
    status: 'supported',
    confidence: 'detected',
    summary: 'Compression Streams API is available.',
    notes: ['Supported compression formats vary by browser implementation.'],
  };
}
