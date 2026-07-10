import type { LabModule } from '../types.ts';

function cpuWork(iterations: number): number {
  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += Math.sqrt(i) * Math.sin(i);
  }
  return sum;
}

const WORKER_CODE = `
self.onmessage = (e) => {
  const iterations = e.data.iterations;
  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += Math.sqrt(i) * Math.sin(i);
  }
  self.postMessage({ sum, done: true });
};
`;

export const workerVsMainLab: LabModule = {
  mount(container, { signal, report }) {
    const output = document.createElement('div');
    output.className = 'lab-output';
    output.setAttribute('aria-live', 'polite');
    output.textContent = 'Adjust iterations and run on main thread or in a worker.';

    const iterationsInput = document.createElement('input');
    iterationsInput.type = 'number';
    iterationsInput.value = '500000';
    iterationsInput.min = '10000';
    iterationsInput.max = '5000000';
    iterationsInput.setAttribute('aria-label', 'Iterations');

    const runMain = document.createElement('button');
    runMain.className = 'btn btn-primary';
    runMain.type = 'button';
    runMain.textContent = 'Run on main thread';

    const runWorker = document.createElement('button');
    runWorker.className = 'btn';
    runWorker.type = 'button';
    runWorker.textContent = 'Run in worker';

    const controls = document.createElement('div');
    controls.className = 'lab-controls';
    controls.append(iterationsInput, runMain, runWorker);

    container.append(controls, output);

    const onMain = () => {
      const n = Number(iterationsInput.value) || 500000;
      report('Running on main thread…');
      const start = performance.now();
      const result = cpuWork(n);
      const elapsed = performance.now() - start;
      output.textContent = `Main thread: ${elapsed.toFixed(2)} ms (result: ${result.toFixed(4)}). UI was blocked during run.`;
    };

    const onWorker = () => {
      if (typeof Worker === 'undefined') {
        output.textContent = 'Web Workers are not available.';
        return;
      }
      const n = Number(iterationsInput.value) || 500000;
      report('Running in worker…');
      const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      const start = performance.now();

      worker.onmessage = (e: MessageEvent<{ sum: number }>) => {
        const elapsed = performance.now() - start;
        output.textContent = `Worker: ${elapsed.toFixed(2)} ms (result: ${e.data.sum.toFixed(4)}). Main thread stayed responsive.`;
        worker.terminate();
        URL.revokeObjectURL(url);
      };

      worker.onerror = () => {
        output.textContent = 'Worker error.';
        URL.revokeObjectURL(url);
      };

      worker.postMessage({ iterations: n });
    };

    runMain.addEventListener('click', onMain);
    runWorker.addEventListener('click', onWorker);
    signal.addEventListener('abort', () => {
      runMain.removeEventListener('click', onMain);
      runWorker.removeEventListener('click', onWorker);
    });

    return () => container.replaceChildren();
  },
};

export default workerVsMainLab;
