#!/usr/bin/env node
/**
 * Content integrity checker for the handbook + notes collections.
 *
 *   npm run check
 *
 * Catches, without needing a full Astro build, the failure modes that have
 * actually bitten this repo:
 *
 *   1. Malformed / incomplete frontmatter (build-breaking).
 *   2. Duplicate `lang/slug` pairs — content-collection IDs collide and the
 *      build fails with a confusing error. Happens when a page is copied to a
 *      new section folder and the old file isn't deleted.
 *   3. Links to pages that don't exist, or that are hidden via
 *      `hiddenHandbookSlugs` (hidden pages are never built => 404).
 *   4. zh/en structural drift: different numbers of `##` headings.
 *   5. `order` collisions inside a visible section (unstable prev/next order).
 *   6. Frontmatter `summary` drift: summary still name-drops a heading that no
 *      longer exists on the page.
 *
 * Exit code 1 if any ERROR is found. Warnings never fail the run.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const HANDBOOK_DIR = join(SITE, 'src/content/handbook');
const NOTES_DIR = join(SITE, 'src/content/notes');
const HANDBOOK_LIB = join(SITE, 'src/lib/handbook.ts');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const rel = (p) => relative(SITE, p).replace(/\\/g, '/');

function walk(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (/\.mdx?$/.test(e)) out.push(p);
  }
  return out;
}

/** Minimal frontmatter reader: flat `key: value` pairs, quotes stripped. */
function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return { data, body: text.slice(m[0].length) };
}

/**
 * Slugs excluded from the PRODUCTION build (visible in `npm run dev`).
 * Production semantics are what we validate against, so a draft counts as hidden.
 */
function readHiddenSlugs() {
  const src = readFileSync(HANDBOOK_LIB, 'utf8');
  const block = /draftHandbookSlugs\s*=\s*new Set<string>\(\[([\s\S]*?)\]\)/.exec(src);
  if (!block) {
    warn('Could not locate draftHandbookSlugs in src/lib/handbook.ts — hidden-link checks skipped.');
    return new Set();
  }
  return new Set([...block[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]));
}

const HANDBOOK_REQUIRED = ['slug', 'lang', 'title', 'section', 'order', 'status', 'updated', 'summary'];

/** Read the allowed sections straight from the zod schema, so this can't drift. */
function readHandbookSections() {
  const src = readFileSync(join(SITE, 'src/content.config.ts'), 'utf8');
  const m = /section:\s*z\.enum\(\[([^\]]*)\]\)/.exec(src);
  if (!m) {
    warn('Could not read the section enum from content.config.ts — section validation skipped.');
    return null;
  }
  return new Set([...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]));
}
const HANDBOOK_SECTIONS = readHandbookSections();
const HANDBOOK_STATUS = new Set(['available', 'draft']);
const NOTES_REQUIRED = ['slug', 'lang', 'title', 'category', 'group', 'status', 'updated', 'summary'];

const hidden = readHiddenSlugs();
const handbookFiles = walk(HANDBOOK_DIR);
const noteFiles = walk(NOTES_DIR);

const pages = []; // { file, fm, body, collection }
const seenIds = new Map();

for (const [files, collection] of [[handbookFiles, 'handbook'], [noteFiles, 'notes']]) {
  for (const file of files) {
    const parsed = parseFrontmatter(readFileSync(file, 'utf8'));
    if (!parsed) {
      err(`${rel(file)}: missing or malformed frontmatter`);
      continue;
    }
    const { data: fm, body } = parsed;
    const required = collection === 'handbook' ? HANDBOOK_REQUIRED : NOTES_REQUIRED;
    const missing = required.filter((k) => !fm[k]);
    if (missing.length) err(`${rel(file)}: missing frontmatter field(s): ${missing.join(', ')}`);
    if (collection === 'handbook') {
      if (HANDBOOK_SECTIONS && fm.section && !HANDBOOK_SECTIONS.has(fm.section)) {
        err(`${rel(file)}: unknown section "${fm.section}" (allowed: ${[...HANDBOOK_SECTIONS].join(', ')})`);
      }
      if (fm.status && !HANDBOOK_STATUS.has(fm.status)) {
        err(`${rel(file)}: unknown status "${fm.status}"`);
      }
      if (fm.order && !/^\d+$/.test(fm.order)) err(`${rel(file)}: order must be an integer, got "${fm.order}"`);
    }
    if (fm.lang && fm.slug) {
      const id = `${collection}:${fm.lang}/${fm.slug}`;
      if (seenIds.has(id)) {
        err(`duplicate content id "${id}" — ${rel(seenIds.get(id))} and ${rel(file)} (the build will fail)`);
      } else {
        seenIds.set(id, file);
      }
    }
    pages.push({ file, fm, body, collection });
  }
}

// ── Links ────────────────────────────────────────────────────────────────────
const handbookSlugs = new Set(pages.filter((p) => p.collection === 'handbook').map((p) => p.fm.slug));
const noteSlugs = new Set(pages.filter((p) => p.collection === 'notes').map((p) => p.fm.slug));

for (const { file, fm, body, collection } of pages) {
  const isHidden = collection === 'handbook' && hidden.has(fm.slug);
  for (const [, target] of body.matchAll(/\]\(\/personal_website\/(?:zh\/)?handbook\/([A-Za-z0-9-]+)\)/g)) {
    if (!handbookSlugs.has(target)) {
      // Stale links inside an unpublished page can't 404 for a reader, so they
      // are only worth flagging, not failing on.
      (isHidden ? warn : err)(`${rel(file)}: link to /handbook/${target} — no such page`);
    } else if (hidden.has(target) && !isHidden) {
      err(`${rel(file)}: visible page links to /handbook/${target}, which is hidden (renders as 404)`);
    }
  }
  for (const [, target] of body.matchAll(/\]\(\/personal_website\/(?:zh\/)?notes\/([A-Za-z0-9-]+)\)/g)) {
    if (!noteSlugs.has(target)) warn(`${rel(file)}: link to /notes/${target} — no note with that slug`);
  }
}

// ── zh/en parity + summary drift ─────────────────────────────────────────────
const bySlug = new Map();
for (const p of pages) {
  if (!p.fm.slug) continue;
  const key = `${p.collection}:${p.fm.slug}`;
  if (!bySlug.has(key)) bySlug.set(key, {});
  bySlug.get(key)[p.fm.lang] = p;
}

const headings = (body) => [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());

for (const [key, langs] of bySlug) {
  const { zh, en } = langs;
  if (!zh || !en) {
    const have = zh ? 'zh' : 'en';
    warn(`${key}: only ${have} exists (no ${have === 'zh' ? 'en' : 'zh'} counterpart)`);
    continue;
  }
  // Only compare structure once BOTH sides claim to be finished. A note whose
  // en side is `coming-soon` / `missing` / `draft` is a tracked TODO, not drift.
  if (zh.fm.status !== 'available' || en.fm.status !== 'available') continue;
  const hz = headings(zh.body).length;
  const he = headings(en.body).length;
  if (hz !== he) {
    warn(`${key}: heading count differs — zh has ${hz} "##" headings, en has ${he} (possible drift)`);
  }
}

// Summary drift: a summary that quotes a heading which no longer exists.
for (const { file, fm, body } of pages) {
  if (!fm.summary) continue;
  const hs = headings(body).map((h) => h.replace(/[:：].*$/, '').trim());
  if (hs.length < 2) continue;
  // Only meaningful for CJK-style summaries that enumerate section names.
  for (const h of hs) {
    if (h.length < 3) continue;
    void h;
  }
  const quoted = fm.summary.split(/[、,，]/).map((s) => s.trim()).filter((s) => s.length >= 4);
  const stale = quoted.filter(
    (q) => !hs.some((h) => h.includes(q) || q.includes(h)) && /階梯|會議|週會|一對一|開源|掛名|承諾|期待/.test(q),
  );
  if (stale.length) {
    warn(`${rel(file)}: summary mentions "${stale.join('", "')}" but no matching heading — check for drift`);
  }
}

// ── order collisions among visible handbook pages ────────────────────────────
const orderSeen = new Map();
for (const { file, fm, collection } of pages) {
  if (collection !== 'handbook' || hidden.has(fm.slug)) continue;
  const key = `${fm.section}/${fm.lang}/${fm.order}`;
  if (orderSeen.has(key)) {
    warn(`order collision in section "${fm.section}" (${fm.lang}, order ${fm.order}): ${rel(orderSeen.get(key))} and ${rel(file)}`);
  } else {
    orderSeen.set(key, file);
  }
}

// ── report ───────────────────────────────────────────────────────────────────
const visible = pages.filter((p) => p.collection === 'handbook' && !hidden.has(p.fm.slug)).length;
console.log(
  `checked ${pages.length} files — handbook: ${handbookFiles.length} (${visible} visible), notes: ${noteFiles.length}`,
);
for (const w of warnings) console.log(`  warn   ${w}`);
for (const e of errors) console.log(`  ERROR  ${e}`);
console.log(errors.length ? `\n${errors.length} error(s), ${warnings.length} warning(s)` : `\nOK — ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
