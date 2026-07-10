import type { BrowserInfoReport } from './types.ts';
import type { PublicIpLookupResult } from './ip-lookup.ts';

export function formatBrowserReportText(
  report: BrowserInfoReport,
  publicIp?: PublicIpLookupResult,
): string {
  const lines: string[] = [
    'WebProbe — My Browser report',
    `Generated: ${report.generatedAt}`,
    '',
    'Runtime information',
  ];

  for (const field of report.fields) {
    const value = field.value ?? 'Unavailable';
    lines.push(`${field.label}: ${value} (${field.confidence} · ${field.source})`);
    if (field.notes) lines.push(`  Note: ${field.notes}`);
  }

  lines.push('', 'Network information (external)');
  if (publicIp?.ip) {
    lines.push(`Public IP: ${publicIp.ip} (detected · ${publicIp.source})`);
  } else if (publicIp?.error) {
    lines.push(`Public IP: Unavailable (${publicIp.error})`);
  } else {
    lines.push('Public IP: Unavailable');
  }

  return lines.join('\n');
}
