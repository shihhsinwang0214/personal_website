import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { clearReading, markRead, readLast, readSlugs, readView, setLast, setView } from '../src/lib/reading.ts';

const values = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => values.set(key, String(value)),
  removeItem: (key: string) => values.delete(key),
} });
beforeEach(() => values.clear());

test('existing reading records without section metadata remain usable', () => {
  values.set('slam:notes-last', JSON.stringify({ slug: 'old-note', lang: 'zh', title: '舊筆記', ts: 1 }));
  assert.equal(readLast()?.slug, 'old-note');
  assert.equal(readLast()?.heading, undefined);
});

test('a section survives saving and reloading in the original reading language', () => {
  setLast({ slug: 'example', lang: 'zh', title: '例子', heading: '從這個問題開始' });
  assert.equal(readLast()?.heading, '從這個問題開始');
  assert.equal(readLast()?.lang, 'zh');
  assert.ok((readLast()?.ts ?? 0) > 0);
});

test('damaged or incomplete records cannot produce a broken resume card', () => {
  for (const value of ['{', 'null', '{}', JSON.stringify({ slug: 'example', lang: 'unknown', title: 'Example' }), JSON.stringify({ slug: 'example', lang: 'en' })]) {
    values.set('slam:notes-last', value);
    assert.equal(readLast(), undefined);
  }
});

test('clearing reading also clears the saved section, while preserving the view and theme', () => {
  markRead('example');
  setLast({ slug: 'example', lang: 'en', title: 'Example', heading: 'section' });
  setView('sky');
  values.set('theme', 'dark');
  clearReading();
  assert.equal(readLast(), undefined);
  assert.equal(readSlugs().size, 0);
  assert.equal(readView(), 'sky');
  assert.equal(values.get('theme'), 'dark');
});
