export interface PublicIpLookupResult {
  ip: string | null;
  source: string;
  error?: string;
}

const IPIFY_URL = 'https://api.ipify.org?format=json';

export async function fetchPublicIp(signal?: AbortSignal): Promise<PublicIpLookupResult> {
  try {
    const response = await fetch(IPIFY_URL, { signal });
    if (!response.ok) {
      return {
        ip: null,
        source: 'api.ipify.org',
        error: `Lookup failed (HTTP ${response.status})`,
      };
    }

    const data = (await response.json()) as { ip?: string };
    return {
      ip: data.ip ?? null,
      source: 'api.ipify.org',
      error: data.ip ? undefined : 'No IP address in response',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lookup failed';
    return { ip: null, source: 'api.ipify.org', error: message };
  }
}
