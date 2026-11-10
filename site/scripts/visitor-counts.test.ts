import test from 'node:test';
import assert from 'node:assert/strict';
import { counterPagePath, formatVisitorCount, loadVisitorCounts, visitorCounterUrl } from '../src/lib/visitorCounts.ts';

test('counter paths match canonical analytics paths while retaining the project base', () => {
  assert.equal(counterPagePath('https://example.com/personal_website/zh/notes/x/?resume=1#eq', 'https://example.com/personal_website/zh/notes/x/'), '/personal_website/zh/notes/x');
  assert.equal(counterPagePath('http://localhost:4331/personal_website/zh/', 'https://example.com/zh/'), '/personal_website/zh');
  assert.equal(counterPagePath('https://example.com/'), '/');
});
test('public endpoints encode page paths and preserve the TOTAL special path', () => {
  assert.equal(visitorCounterUrl('example', '/personal_website/zh'), 'https://example.goatcounter.com/counter/%2Fpersonal_website%2Fzh.json');
  assert.equal(visitorCounterUrl('example', 'TOTAL'), 'https://example.goatcounter.com/counter/TOTAL.json');
  assert.throws(() => visitorCounterUrl('https://other.example', '/'));
});
test('zero and large formatted counts are real data; invalid responses never become zero', () => {
  assert.equal(formatVisitorCount(0), '0');
  assert.equal(formatVisitorCount('12,345'), '12,345');
  assert.equal(formatVisitorCount('90071992547409930'), '90,071,992,547,409,930');
  for (const value of [undefined, null, -1, 1.5, '', 'unavailable', '<b>100</b>', '1,2']) assert.equal(formatVisitorCount(value), null);
});
test('a missing page does not hide a valid global total', async () => {
  const request = (async (url: string) => url.includes('/TOTAL.') ? Response.json({ count: '4,321' }) : new Response('', { status: 404 })) as typeof fetch;
  assert.deepEqual(await loadVisitorCounts('example', '/new', 'en', request), { page: null, total: '4,321' });
});
test('network failures and malformed JSON are handled without fabricated counts', async () => {
  const request = (async (url: string) => { if (url.includes('/TOTAL.')) throw new Error('Network failed'); return new Response('not json'); }) as typeof fetch;
  assert.deepEqual(await loadVisitorCounts('example', '/new', 'en', request), { page: null, total: null });
});
