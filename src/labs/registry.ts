import type { LabManifest } from './types.ts';

export const labs: LabManifest[] = [
  {
    id: 'worker-vs-main',
    title: 'Main Thread vs Web Worker',
    description:
      'Run the same CPU-bound loop on the main thread and in a worker to see blocking behavior.',
    category: 'compute',
    requiredCapabilities: ['web-workers'],
    route: '/labs/worker-vs-main',
    docs: [
      {
        title: 'Web Workers API',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API',
      },
    ],
    load: () => import('./worker-vs-main/index.ts'),
  },
  {
    id: 'indexeddb-rw',
    title: 'IndexedDB Read/Write',
    description: 'Write and read small records to observe IndexedDB throughput locally.',
    category: 'storage',
    requiredCapabilities: ['indexeddb'],
    route: '/labs/indexeddb-rw',
    docs: [
      {
        title: 'IndexedDB API',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API',
      },
    ],
    load: () => import('./indexeddb-rw/index.ts'),
  },
  {
    id: 'compression-streams',
    title: 'Compression Streams Demo',
    description: 'Compress and decompress a text sample using the Compression Streams API.',
    category: 'media',
    requiredCapabilities: ['compression-streams'],
    route: '/labs/compression-streams',
    docs: [
      {
        title: 'Compression Streams API',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API',
      },
    ],
    load: () => import('./compression-streams/index.ts'),
  },
];

export function getLab(id: string): LabManifest | undefined {
  return labs.find((l) => l.id === id);
}
