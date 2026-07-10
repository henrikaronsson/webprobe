import type { BrowserInfoField, BrowserInfoReport } from './types.ts';
import { detectAllCapabilities } from '../capabilities/registry.ts';

export async function collectBrowserInfo(): Promise<BrowserInfoReport> {
  const fields: BrowserInfoField[] = [];

  const uaData = (
    navigator as Navigator & { userAgentData?: { platform: string; brands: { brand: string }[] } }
  ).userAgentData;

  fields.push({
    label: 'Platform',
    value: uaData?.platform ?? navigator.platform ?? null,
    confidence: uaData?.platform ? 'detected' : navigator.platform ? 'inferred' : 'unavailable',
    source: uaData ? 'navigator.userAgentData' : 'navigator.platform',
  });

  fields.push({
    label: 'Logical CPU cores',
    value: navigator.hardwareConcurrency?.toString() ?? null,
    confidence: navigator.hardwareConcurrency ? 'detected' : 'unavailable',
    source: 'navigator.hardwareConcurrency',
  });

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  fields.push({
    label: 'Approximate device memory (GB)',
    value: deviceMemory?.toString() ?? null,
    confidence: deviceMemory ? 'approximated' : 'unavailable',
    source: 'navigator.deviceMemory',
    notes: deviceMemory
      ? 'Rounded value exposed by Chromium-based browsers.'
      : 'Not exposed in this browser.',
  });

  fields.push({
    label: 'Viewport',
    value: `${window.innerWidth} × ${window.innerHeight}`,
    confidence: 'detected',
    source: 'window.innerWidth / innerHeight',
  });

  fields.push({
    label: 'Screen',
    value: `${screen.width} × ${screen.height}`,
    confidence: 'detected',
    source: 'screen.width / height',
  });

  fields.push({
    label: 'Device pixel ratio',
    value: window.devicePixelRatio.toString(),
    confidence: 'detected',
    source: 'window.devicePixelRatio',
  });

  const connection = (
    navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } }
  ).connection;
  fields.push({
    label: 'Network effective type',
    value: connection?.effectiveType ?? null,
    confidence: connection?.effectiveType ? 'detected' : 'unavailable',
    source: 'navigator.connection',
    notes: connection ? undefined : 'Network Information API not exposed.',
  });

  let storageEstimate: string | null = null;
  if (navigator.storage?.estimate) {
    try {
      const est = await navigator.storage.estimate();
      storageEstimate = est.quota
        ? `~${Math.round(est.quota / (1024 * 1024))} MB quota, ~${Math.round((est.usage ?? 0) / (1024 * 1024))} MB used`
        : null;
    } catch {
      storageEstimate = null;
    }
  }

  fields.push({
    label: 'Storage estimate',
    value: storageEstimate,
    confidence: storageEstimate ? 'approximated' : 'unavailable',
    source: 'navigator.storage.estimate()',
  });

  fields.push({
    label: 'User agent',
    value: navigator.userAgent,
    confidence: 'detected',
    source: 'navigator.userAgent',
    notes: 'May be reduced by User-Agent Client Hints policies.',
  });

  const capabilities = await detectAllCapabilities();
  const supported = Object.entries(capabilities).filter(([, r]) => r.status === 'supported').length;

  fields.push({
    label: 'WebProbe capabilities supported',
    value: `${supported} of ${Object.keys(capabilities).length}`,
    confidence: 'detected',
    source: 'WebProbe capability registry',
  });

  return {
    generatedAt: new Date().toISOString(),
    fields,
  };
}
