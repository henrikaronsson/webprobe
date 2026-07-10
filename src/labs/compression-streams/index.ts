import type { LabModule } from '../types.ts';

const SAMPLE =
  'WebProbe compression demo. '.repeat(50) +
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20);

async function compressText(text: string): Promise<{ compressed: Uint8Array; ratio: number }> {
  const input = new Blob([text]).stream();
  const compressedStream = input.pipeThrough(new CompressionStream('gzip'));
  const reader = compressedStream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.byteLength;
  }

  const compressed = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    compressed.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const originalSize = new Blob([text]).size;
  return { compressed, ratio: originalSize / total };
}

export const compressionStreamsLab: LabModule = {
  mount(container, { report }) {
    const output = document.createElement('div');
    output.className = 'lab-output';
    output.setAttribute('aria-live', 'polite');

    if (typeof CompressionStream === 'undefined') {
      output.textContent = 'Compression Streams API is not available in this browser.';
      container.append(output);
      return () => container.replaceChildren();
    }

    output.textContent = `Sample text: ${SAMPLE.length.toLocaleString()} characters. Click compress to run.`;

    const runBtn = document.createElement('button');
    runBtn.className = 'btn btn-primary';
    runBtn.type = 'button';
    runBtn.textContent = 'Compress sample';

    const decompressBtn = document.createElement('button');
    decompressBtn.className = 'btn';
    decompressBtn.type = 'button';
    decompressBtn.textContent = 'Decompress';

    const controls = document.createElement('div');
    controls.className = 'lab-controls';
    controls.append(runBtn, decompressBtn);
    container.append(controls, output);

    let lastCompressed: Uint8Array | null = null;

    runBtn.addEventListener('click', () => {
      void (async () => {
        report('Compressing…');
        const start = performance.now();
        const { compressed, ratio } = await compressText(SAMPLE);
        const elapsed = performance.now() - start;
        lastCompressed = compressed;
        output.textContent = [
          `Compressed ${SAMPLE.length.toLocaleString()} chars → ${compressed.byteLength.toLocaleString()} bytes.`,
          `Ratio: ${ratio.toFixed(2)}:1`,
          `Time: ${elapsed.toFixed(2)} ms`,
        ].join('\n');
      })();
    });

    decompressBtn.addEventListener('click', () => {
      if (!lastCompressed || typeof DecompressionStream === 'undefined') {
        output.textContent = 'Compress first, or DecompressionStream is unavailable.';
        return;
      }
      void (async () => {
        report('Decompressing…');
        const start = performance.now();
        const stream = new Blob([lastCompressed.slice()])
          .stream()
          .pipeThrough(new DecompressionStream('gzip'));
        const text = await new Response(stream).text();
        const elapsed = performance.now() - start;
        output.textContent = [
          `Decompressed to ${text.length.toLocaleString()} characters in ${elapsed.toFixed(2)} ms.`,
          `Preview: ${text.slice(0, 80)}…`,
        ].join('\n');
      })();
    });

    return () => container.replaceChildren();
  },
};

export default compressionStreamsLab;
