import type { CapabilityResult } from '../../shared/types.ts';

export function detectOpfs(): CapabilityResult {
  const storage = navigator.storage as StorageManager & {
    getDirectory?: () => Promise<FileSystemDirectoryHandle>;
  };

  if (typeof storage?.getDirectory !== 'function') {
    return {
      status: 'unsupported',
      confidence: 'detected',
      summary: 'navigator.storage.getDirectory is not available.',
    };
  }
  return {
    status: 'supported',
    confidence: 'detected',
    summary: 'Origin Private File System API appears available.',
    notes: [
      'Availability may vary in non-secure contexts.',
      'Quota and persistence depend on browser storage policies.',
    ],
  };
}
