import type { LabModule } from '../types.ts';

const DB_NAME = 'webprobe-lab-idb';
const STORE = 'records';

async function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const indexedDbRwLab: LabModule = {
  mount(container, { signal, report }) {
    const output = document.createElement('div');
    output.className = 'lab-output';
    output.setAttribute('aria-live', 'polite');
    output.textContent = 'Write and read small records to measure IndexedDB throughput.';

    const countInput = document.createElement('input');
    countInput.type = 'number';
    countInput.value = '200';
    countInput.min = '10';
    countInput.max = '2000';
    countInput.setAttribute('aria-label', 'Record count');

    const runBtn = document.createElement('button');
    runBtn.className = 'btn btn-primary';
    runBtn.type = 'button';
    runBtn.textContent = 'Run benchmark';

    const controls = document.createElement('div');
    controls.className = 'lab-controls';
    controls.append(countInput, runBtn);
    container.append(controls, output);

    const run = async () => {
      if (!('indexedDB' in window)) {
        output.textContent = 'IndexedDB is not available.';
        return;
      }

      const count = Number(countInput.value) || 200;
      report(`Writing ${count} records…`);

      try {
        const db = await openDb();
        const writeStart = performance.now();

        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE, 'readwrite');
          const store = tx.objectStore(STORE);
          for (let i = 0; i < count; i++) {
            store.put({ value: `record-${i}`, ts: Date.now() });
          }
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });

        const writeMs = performance.now() - writeStart;
        const readStart = performance.now();
        let readCount = 0;

        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE, 'readonly');
          const store = tx.objectStore(STORE);
          const req = store.openCursor();
          req.onsuccess = () => {
            if (req.result) {
              readCount++;
              req.result.continue();
            } else {
              resolve();
            }
          };
          req.onerror = () => reject(req.error);
        });

        const readMs = performance.now() - readStart;
        db.close();

        output.textContent = [
          `Wrote ${count} records in ${writeMs.toFixed(2)} ms (${(count / (writeMs / 1000)).toFixed(0)} ops/s).`,
          `Read ${readCount} records in ${readMs.toFixed(2)} ms.`,
          'Results vary with storage backend, disk, and browser implementation.',
        ].join('\n');
      } catch (err) {
        output.textContent = `Error: ${err instanceof Error ? err.message : String(err)}`;
      }
    };

    runBtn.addEventListener('click', () => void run());
    signal.addEventListener('abort', () => runBtn.removeEventListener('click', () => void run()));

    return () => container.replaceChildren();
  },
};

export default indexedDbRwLab;
