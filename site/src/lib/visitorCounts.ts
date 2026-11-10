/** Public GoatCounter counters never need an API key in the browser. */
export function visitorCounterUrl(code: string, path: string): string {
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(code)) throw new Error('Invalid GoatCounter site code');
  return `https://${code}.goatcounter.com/counter/${encodeURIComponent(path)}.json`;
}

export function counterPagePath(currentUrl: string, canonicalUrl?: string): string {
  const current = new URL(currentUrl);
  const canonical = canonicalUrl ? new URL(canonicalUrl, current) : current;
  const sameSite = canonical.hostname.replace(/^www\./, '') === current.hostname.replace(/^www\./, '');
  return (sameSite ? canonical.pathname : current.pathname).replace(/\/+$/, '') || '/';
}

export function formatVisitorCount(value: unknown, locale = 'en'): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const text = String(value);
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(text)) return null;
  return BigInt(text.replaceAll(',', '')).toLocaleString(locale);
}

export async function loadVisitorCounts(code: string, path: string, locale = 'en', request: typeof fetch = fetch) {
  const read = async (key: string) => {
    const response = await request(visitorCounterUrl(code, key), {
      credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Counter unavailable: ${response.status}`);
    const data = await response.json();
    return formatVisitorCount(data.count, locale);
  };
  const [page, total] = await Promise.allSettled([read(path), read('TOTAL')]);
  return {
    page: page.status === 'fulfilled' ? page.value : null,
    total: total.status === 'fulfilled' ? total.value : null,
  };
}
