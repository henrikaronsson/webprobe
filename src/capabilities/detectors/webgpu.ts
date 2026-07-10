import type { CapabilityResult } from '../../shared/types.ts';

export function detectWebGpu(): CapabilityResult {
  if (!('gpu' in navigator)) {
    return {
      status: 'unsupported',
      confidence: 'detected',
      summary: 'navigator.gpu is not exposed in this browser.',
    };
  }
  return {
    status: 'supported',
    confidence: 'detected',
    summary: 'WebGPU API is exposed via navigator.gpu.',
    notes: [
      'Exposure does not guarantee a usable adapter or full feature set.',
      'Some features require secure context and user gesture.',
    ],
  };
}
