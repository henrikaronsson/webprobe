import type { CapabilityResult } from '../../shared/types.ts';

export function detectIndexedDb(): CapabilityResult {
  if (!('indexedDB' in window)) {
    return {
      status: 'unsupported',
      confidence: 'detected',
      summary: 'indexedDB is not exposed on window.',
    };
  }
  return {
    status: 'supported',
    confidence: 'detected',
    summary: 'IndexedDB API is available.',
    notes: ['Private browsing modes may restrict or clear storage.'],
  };
}
