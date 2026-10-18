import type { CollectionEntry } from 'astro:content';
import type { Lang } from './notes';

/**
 * Knowledge Realms (知識秘境) — question-led first reading of the notes' "skill manual".
 *
 * Rules carried over from docs/lab-rpg-rules.md and lib/visited.ts:
 *   - No score, no verdict, no streaks. A wrong pick opens a detour, it is
 *     never a "fail". The only thing stored is "which step this browser
 *     reached", in localStorage, never sent anywhere.
 *   - With JS off every node is visible as static text, so a script still
 *     reads as a short document.
 */
export type DojoEntry = CollectionEntry<'dojo'>;

/** Visual themes a walk (and the index) can wear. CSS lives in Dialogue.astro / DojoView.astro / DojoIndex.astro under `[data-dojo-theme]`. */
export type DojoTheme = 'board' | 'plates' | 'scroll';
export const dojoThemes: DojoTheme[] = ['board', 'plates', 'scroll'];
export const defaultDojoTheme: DojoTheme = 'board';
export function dojoThemeOf(entry: DojoEntry | undefined): DojoTheme {
  return (entry?.data.theme as DojoTheme | undefined) ?? defaultDojoTheme;
}

/**
 * What one browser remembers about a walk, under localStorage `slam:dojo:<slug>`.
 * `step` is the furthest main-line node reached, `total` the number of main-line
 * nodes when it was written. Never a score; cleared by 「從頭開始」.
 */
export interface DojoProgress {
  version: string;
  step: number;
  total?: number;
  /** Reading positions in complete method paths; no answers or model state. */
  paths?: Record<string, number>;
}
export const dojoStorageKey = (slug: string) => `slam:dojo:${slug}`;

export const dojoTitle: Record<Lang, string> = { en: 'Knowledge Realms (Beta)', zh: '知識秘境（Beta）' };
export const dojoTagline: Record<Lang, string> = {
  en: 'Trace how ideas connect through questions and reasoning.',
  zh: '從問題與思考中，梳理出知識的脈絡。',
};
export const skillManualLabel: Record<Lang, string> = { en: 'Skill manual', zh: '技能書' };

export function dojoRoute(slug: string, lang: Lang): string {
  return lang === 'zh' ? `zh/dojo/${slug}` : `dojo/${slug}`;
}
export function dojoIndexRoute(lang: Lang): string {
  return lang === 'zh' ? 'zh/dojo' : 'dojo';
}

export function isPublishedDojo(entry: DojoEntry): boolean {
  return entry.data.status === 'available';
}

// Drafts remain readable in development and in the separate local build.
// The deployed build (and every CI build) must omit their routes and links.
const environment = (import.meta as { env?: { DEV?: boolean; MODE?: string } }).env;
const onCI = typeof process !== 'undefined' && Boolean(process.env.CI);
export const previewDojoDrafts = !onCI && Boolean(environment?.DEV || environment?.MODE === 'local-preview');
// Exclude these source files before MDX compilation in a public build, so their
// client experiments and workers cannot enter the deployment artifact either.
export const localOnlyDojoSlugs = new Set([
  'what-generation-learns',
  'design-forward-process',
  'learn-reverse-step',
  'denoiser-and-score',
  'choose-reverse-dynamics',
  'diagnose-diffusion',
]);
export function isVisibleDojo(entry: DojoEntry, preview = previewDojoDrafts): boolean {
  return (preview || !localOnlyDojoSlugs.has(entry.data.slug)) &&
    (isPublishedDojo(entry) || (preview && entry.data.status === 'draft'));
}

/** Scripts for a listing: the requested language first, the other language as fallback. */
export function dojoForListingLang(entries: DojoEntry[], lang: Lang, preview = previewDojoDrafts): DojoEntry[] {
  const bySlug = new Map<string, DojoEntry>();
  for (const e of entries.filter((entry) => isVisibleDojo(entry, preview))) {
    const cur = bySlug.get(e.data.slug);
    if (!cur || (cur.data.lang !== lang && e.data.lang === lang)) bySlug.set(e.data.slug, e);
  }
  return [...bySlug.values()].sort((a, b) =>
    (a.data.series ?? '').localeCompare(b.data.series ?? '') ||
    (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER) ||
    b.data.updated.getTime() - a.data.updated.getTime());
}

/** Published neighbours in the same question sequence and language. */
export function dojoSeriesEntries(entries: DojoEntry[], current: DojoEntry, preview = previewDojoDrafts): DojoEntry[] {
  if (!current.data.series) return [];
  return entries.filter((e) => isVisibleDojo(e, preview) && e.data.series === current.data.series && e.data.lang === current.data.lang)
    .sort((a, b) => (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER));
}

/** The dojo script carved from a note, if one exists (any language, preferring `lang`). */
export function dojoForNote(entries: DojoEntry[], noteLabel: string | undefined, noteSlug: string, lang: Lang, preview = previewDojoDrafts): DojoEntry | undefined {
  const hits = entries.filter((e) => isVisibleDojo(e, preview) && (e.data.note === noteLabel || e.data.note === noteSlug));
  return hits.find((e) => e.data.lang === lang) ?? hits[0];
}
