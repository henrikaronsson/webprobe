import type { CapabilityResult } from '../../shared/types.ts';

export function detectWebWorkers(): CapabilityResult {
  if (typeof Worker === 'undefined') {
    return {
      status: 'unsupported',
      confidence: 'detected',
      summary: 'Worker constructor is not available.',
    };
  }
  return {
    status: 'supported',
    confidence: 'detected',
    summary: 'Dedicated Web Workers are available.',
    notes: ['Worker script URLs must obey same-origin policy unless CORS allows.'],
  };
}
