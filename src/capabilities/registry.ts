import type { CapabilityDefinition } from './types.ts';
import { detectWebGpu } from './detectors/webgpu.ts';
import { detectWebWorkers } from './detectors/web-workers.ts';
import { detectIndexedDb } from './detectors/indexeddb.ts';
import { detectOpfs } from './detectors/opfs.ts';
import { detectCompressionStreams } from './detectors/compression-streams.ts';

export const capabilities: CapabilityDefinition[] = [
  {
    id: 'webgpu',
    title: 'WebGPU',
    description: 'Low-level GPU access for graphics and compute workloads in the browser.',
    category: 'graphics',
    docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API',
    notes: ['Requires secure context in most browsers.'],
    detect: detectWebGpu,
  },
  {
    id: 'web-workers',
    title: 'Web Workers',
    description: 'Run JavaScript in background threads to avoid blocking the main thread.',
    category: 'compute',
    docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API',
    notes: ['No direct DOM access from workers.'],
    labId: 'worker-vs-main',
    detect: detectWebWorkers,
  },
  {
    id: 'indexeddb',
    title: 'IndexedDB',
    description: 'Client-side structured database for storing significant amounts of data.',
    category: 'storage',
    docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API',
    notes: ['Asynchronous API; transactions have specific lifetime rules.'],
    labId: 'indexeddb-rw',
    detect: detectIndexedDb,
  },
  {
    id: 'opfs',
    title: 'Origin Private File System',
    description: 'High-performance file storage scoped to the origin, not visible to users.',
    category: 'storage',
    docsUrl:
      'https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system',
    notes: ['Part of the broader File System API.'],
    detect: detectOpfs,
  },
  {
    id: 'compression-streams',
    title: 'Compression Streams',
    description: 'Stream-based compression and decompression using native codecs.',
    category: 'media',
    docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API',
    notes: ['Useful for reducing transfer size of text and binary streams.'],
    labId: 'compression-streams',
    detect: detectCompressionStreams,
  },
];

export function getCapability(id: string): CapabilityDefinition | undefined {
  return capabilities.find((c) => c.id === id);
}

export async function detectAllCapabilities() {
  const results = await Promise.all(
    capabilities.map(async (cap) => ({
      id: cap.id,
      result: await cap.detect(),
    })),
  );
  return Object.fromEntries(results.map((r) => [r.id, r.result]));
}
