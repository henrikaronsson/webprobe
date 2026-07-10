import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchPublicIp } from '../../src/browser/ip-lookup.ts';
import { formatBrowserReportText } from '../../src/browser/report.ts';

describe('fetchPublicIp', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns IP on success', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ ip: '203.0.113.1' }),
    } as Response);

    const result = await fetchPublicIp();
    expect(result.ip).toBe('203.0.113.1');
    expect(result.source).toBe('api.ipify.org');
    expect(result.error).toBeUndefined();
  });

  it('returns error on HTTP failure', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 503 } as Response);

    const result = await fetchPublicIp();
    expect(result.ip).toBeNull();
    expect(result.error).toContain('503');
  });

  it('returns error on network failure', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const result = await fetchPublicIp();
    expect(result.ip).toBeNull();
    expect(result.error).toBe('Network error');
  });
});

describe('formatBrowserReportText', () => {
  it('includes runtime fields and public IP', () => {
    const text = formatBrowserReportText(
      {
        generatedAt: '2026-01-01T00:00:00.000Z',
        fields: [
          {
            label: 'Platform',
            value: 'Windows',
            confidence: 'detected',
            source: 'navigator.platform',
          },
        ],
      },
      { ip: '203.0.113.1', source: 'api.ipify.org' },
    );

    expect(text).toContain('Platform: Windows');
    expect(text).toContain('Public IP: 203.0.113.1');
  });
});
