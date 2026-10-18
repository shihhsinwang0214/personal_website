import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublishedDojo, isVisibleDojo, localOnlyDojoSlugs, dojoForListingLang, dojoForNote, dojoSeriesEntries, type DojoEntry } from '../src/lib/dojo.ts';

const entry = (slug: string, status: 'available' | 'draft', lang: 'zh' | 'en' = 'zh', order = 0) => ({
  id: `${lang}/${slug}`,
  data: { slug, lang, status, note: `source-${slug}`, series: 'example-series', order, updated: new Date('2026-01-01') },
}) as DojoEntry;

test('draft pages have no published route but remain available in local preview', () => {
  const draft = entry('draft-example', 'draft'), published = entry('published-example', 'available');
  assert.equal(isPublishedDojo(draft), false);
  assert.equal(isVisibleDojo(draft, false), false);
  assert.equal(isVisibleDojo(draft, true), true);
  assert.equal(isVisibleDojo(published, false), true);
});

test('production listings and note banners never expose a draft, including language fallback', () => {
  const draft = entry('draft-example', 'draft');
  const published = entry('published-example', 'available', 'en', 1);
  const translatedDraft = entry('published-example', 'draft', 'zh', 1);
  const all = [draft, published, translatedDraft];
  assert.deepEqual(dojoForListingLang(all, 'zh', false), [published]);
  assert.deepEqual(dojoForListingLang(all, 'zh', true), [draft, translatedDraft]);
  assert.equal(dojoForNote(all, draft.data.note, 'source-note', 'zh', false), undefined);
  assert.equal(dojoForNote(all, draft.data.note, 'source-note', 'zh', true), draft);
});

test('series navigation excludes draft neighbours in production and restores them locally', () => {
  const first = entry('first-example', 'available'), draft = entry('draft-example', 'draft', 'zh', 1);
  const last = entry('last-example', 'available', 'zh', 2), all = [last, draft, first];
  assert.deepEqual(dojoSeriesEntries(all, first, false), [first, last]);
  assert.deepEqual(dojoSeriesEntries(all, first, true), [first, draft, last]);
});

test('local-only lessons stay out of public navigation even if cached metadata says available', () => {
  const local = entry([...localOnlyDojoSlugs][0], 'available');
  assert.equal(isVisibleDojo(local, false), false);
  assert.equal(isVisibleDojo(local, true), true);
  assert.deepEqual(dojoForListingLang([local], 'zh', false), []);
  assert.equal(dojoForNote([local], local.data.note, 'source-note', 'zh', false), undefined);
});
