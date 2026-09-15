/**
 * noteRefs.ts — resolve stable cross-reference labels to the *current* slug, title and
 * position code ("U1.3", "M1.4") of a note.
 *
 * HARD RULE for course notes: never hard-code "W3.3" / a slug in prose, and never type a
 * position code into a note's frontmatter `title` or its body `#` heading. Give every note a
 * frontmatter `label` and reference it with <Ref to="label"/>, <Bridge to="label">,
 * `prereqs: [label, …]`. Week / part numbers are derived here at build time from the note's
 * `group` ("Unit 1 · …" → U1, "M1 · …" → M1) and its position in `noteSlugList`, and the
 * layouts prefix them onto the title as they render (see `noteTitles`), so renumbering a
 * week or reordering notes never breaks a link, a code, or a title.
 */
import { getCollection } from 'astro:content';
import type { Lang, NoteEntry } from './notes';
import {
  courseKeyForGroup,
  courseByKey,
  lectureByLabel,
  noteOrderIndex,
  noteRoute,
  plannedNotes,
} from './notes';
import { withBase } from './url';

export interface ResolvedNoteRef {
  slug: string;
  label: string;
  lang: Lang;
  /** Title as it is displayed, position code included ("W3.3 Tweedie …"). */
  title: string;
  /** Title without the position code. */
  shortTitle: string;
  /** Position code, e.g. "W3.3", "M1.4"; empty for notes outside a numbered group. */
  code: string;
  group: string;
  courseKey?: string;
  /** Empty for a planned note — there is no page to link to yet. */
  href: string;
  summary: string;
  /** True when this resolved from `plannedNotes`: referenced, not written yet. */
  planned?: boolean;
}

let indexPromise: Promise<Map<string, NoteEntry[]>> | null = null;

/** label|slug → entries (both languages). Built once per build. */
async function noteIndex(): Promise<Map<string, NoteEntry[]>> {
  if (!indexPromise) {
    indexPromise = getCollection('notes').then((notes) => {
      const map = new Map<string, NoteEntry[]>();
      const push = (key: string, note: NoteEntry) => {
        const list = map.get(key);
        if (list) list.push(note);
        else map.set(key, [note]);
      };
      for (const note of notes) {
        push(note.data.slug, note);
        if (note.data.label && note.data.label !== note.data.slug) push(note.data.label, note);
      }
      return map;
    });
  }
  return indexPromise;
}

const GROUP_CODE = /^(Unit|Week|Lecture|U|W|L|M)\s*(\d+)/i;

/** "Unit 1 · Diffusion Models" → "U1"; "M1 · …" → "M1"; otherwise "". */
export function groupCode(group: string): string {
  const m = GROUP_CODE.exec(group);
  if (!m) return '';
  return `${m[1][0].toUpperCase()}${m[2]}`;
}

/**
 * A leading position code a title may still carry by hand ("W3.3 ", "M1.4："). Titles are
 * not supposed to have one any more; this only keeps an old hand-typed prefix from being
 * doubled up with the derived code.
 */
const TITLE_CODE = /^[UWLM]\d+(?:\.\d+)?\s*[·:：]?\s*/;

export function stripNoteCode(title: string): string {
  return title.replace(TITLE_CODE, '');
}

export interface NoteCodeInfo {
  /** Derived position code, e.g. "W3.3"; "" for notes outside a numbered group. */
  code: string;
  /** The author's title, with any hand-typed code dropped. */
  shortTitle: string;
  /** What layouts render: `${code} ${shortTitle}` (or just the title when there is no code). */
  displayTitle: string;
}

const codeKey = (lang: string, slug: string) => `${lang}/${slug}`;

interface CodeTables {
  /** slug → derived position code. Language-independent: `group` is the same on both sides. */
  bySlug: Map<string, string>;
  /** `${lang}/${slug}` → code + titles, for notes that actually exist. */
  byNote: Map<string, NoteCodeInfo>;
}

let codeIndexPromise: Promise<CodeTables> | null = null;

/**
 * Derive every note's position code, once per build. A group's running order is its
 * members' order in `noteSlugList` — real notes and `plannedNotes` alike, so a note that
 * is written later keeps the code its neighbours already point at.
 */
async function codeIndex(): Promise<CodeTables> {
  if (!codeIndexPromise) {
    codeIndexPromise = getCollection('notes').then((notes) => {
      const slugsByGroup = new Map<string, Set<string>>();
      const addToGroup = (group: string, slug: string) => {
        const set = slugsByGroup.get(group);
        if (set) set.add(slug);
        else slugsByGroup.set(group, new Set([slug]));
      };
      for (const note of notes) addToGroup(note.data.group, note.data.slug);
      for (const planned of Object.values(plannedNotes)) addToGroup(planned.group, planned.slug);

      const bySlug = new Map<string, string>();
      for (const [group, slugs] of slugsByGroup) {
        const g = groupCode(group);
        if (!g) continue;
        [...slugs]
          .sort((a, b) => noteOrderIndex(a) - noteOrderIndex(b))
          .forEach((slug, i) => bySlug.set(slug, `${g}.${i}`));
      }

      const byNote = new Map<string, NoteCodeInfo>();
      for (const note of notes) {
        const code = bySlug.get(note.data.slug) ?? '';
        const shortTitle = code ? stripNoteCode(note.data.title) : note.data.title;
        byNote.set(codeKey(note.data.lang, note.data.slug), {
          code,
          shortTitle,
          displayTitle: code ? `${code} ${shortTitle}` : shortTitle,
        });
      }
      return { bySlug, byNote };
    });
  }
  return codeIndexPromise;
}

export interface NoteTitles {
  /** Title to render for a note: derived code + title, e.g. "W3.3 Tweedie 公式：…". */
  of(note: NoteEntry): string;
  /** Same, for callers that hold only a lang + slug. */
  for(lang: Lang, slug: string, fallback?: string): string;
  /** Just the derived code ("W3.3"); "" outside a numbered group. */
  codeOf(note: NoteEntry): string;
}

/**
 * Build-time lookup for every layout that prints a note title. The position code lives
 * here and nowhere else, so a week can be renumbered or its notes reordered (in
 * `noteSlugList`) without editing a single note's frontmatter.
 */
export async function noteTitles(): Promise<NoteTitles> {
  const { byNote } = await codeIndex();
  return {
    of: (note) => byNote.get(codeKey(note.data.lang, note.data.slug))?.displayTitle ?? note.data.title,
    for: (lang, slug, fallback = '') => byNote.get(codeKey(lang, slug))?.displayTitle ?? fallback,
    codeOf: (note) => byNote.get(codeKey(note.data.lang, note.data.slug))?.code ?? '',
  };
}

export async function noteCode(note: NoteEntry): Promise<string> {
  const { byNote } = await codeIndex();
  return byNote.get(codeKey(note.data.lang, note.data.slug))?.code ?? '';
}

/**
 * Resolve a label or slug. Prefers the requested language; falls back to the other
 * language's entry (the link still goes to the requested language route, where the
 * site renders its "translation missing" page).
 */
export async function resolveNoteRef(key: string, lang: Lang): Promise<ResolvedNoteRef | undefined> {
  const index = await noteIndex();
  const tables = await codeIndex();
  const entries = index.get(key);
  if (!entries || entries.length === 0) {
    // Not written yet, but declared in `plannedNotes` — resolve it so the reference
    // renders as a "planned" chip rather than a broken-label marker.
    const planned = plannedNotes[key];
    if (!planned) return undefined;
    const code = tables.bySlug.get(planned.slug) ?? '';
    const shortTitle = planned.title[lang];
    return {
      slug: planned.slug,
      label: key,
      lang,
      title: code ? `${code} ${shortTitle}` : shortTitle,
      shortTitle,
      code,
      group: planned.group,
      courseKey: courseKeyForGroup(planned.group),
      href: '',
      summary: '',
      planned: true,
    };
  }
  const note = entries.find((n) => n.data.lang === lang) ?? entries[0];
  const info = tables.byNote.get(codeKey(note.data.lang, note.data.slug));
  return {
    slug: note.data.slug,
    label: note.data.label ?? note.data.slug,
    lang,
    title: info?.displayTitle ?? note.data.title,
    shortTitle: info?.shortTitle ?? note.data.title,
    code: info?.code ?? '',
    group: note.data.group,
    courseKey: courseKeyForGroup(note.data.group),
    href: withBase(noteRoute(note.data.slug, lang)),
    summary: note.data.summary,
  };
}

export interface ResolvedWeekRef {
  code: string;
  group: string;
  courseTitle: string;
  href: string;
}

/** Resolve a lecture label ("dma-week-interpolants") to "W5" + a link to its first note. */
export async function resolveWeekRef(label: string, lang: Lang): Promise<ResolvedWeekRef | undefined> {
  const hit = lectureByLabel(label);
  if (!hit) return undefined;
  const all = await getCollection('notes');
  const first = all
    .filter((n) => n.data.group === hit.lecture.group && n.data.lang === lang)
    .sort((a, b) => noteOrderIndex(a.data.slug) - noteOrderIndex(b.data.slug))[0];
  return {
    code: groupCode(hit.lecture.group),
    group: hit.lecture.group,
    courseTitle: hit.course.title[lang],
    href: first ? withBase(noteRoute(first.data.slug, lang)) : withBase(lang === 'zh' ? 'zh/notes' : 'notes'),
  };
}

export interface UsedByGroup {
  courseKey: string;
  courseTitle: string;
  notes: ResolvedNoteRef[];
}

/** Every note whose `prereqs` names this note (by label or slug), grouped by course. */
export async function usedBy(slugOrLabel: string, lang: Lang): Promise<UsedByGroup[]> {
  const index = await noteIndex();
  const targets = new Set((index.get(slugOrLabel) ?? []).flatMap((n) => [n.data.slug, n.data.label ?? n.data.slug]));
  if (targets.size === 0) return [];
  const all = await getCollection('notes');
  const usesTarget = (n: NoteEntry) => n.data.prereqs.some((p) => targets.has(p));
  // Prefer the current language's entries; a note whose zh side declares prereqs but whose
  // en stub does not is still listed (declarations live on whichever side is authored).
  const users = [
    ...all.filter((n) => n.data.lang === lang && usesTarget(n)),
    ...all.filter((n) => n.data.lang !== lang && usesTarget(n)),
  ];
  const seen = new Set<string>();
  const groups = new Map<string, UsedByGroup>();
  for (const n of users) {
    if (seen.has(n.data.slug)) continue;
    seen.add(n.data.slug);
    const ref = await resolveNoteRef(n.data.slug, lang);
    if (!ref) continue;
    const courseKey = ref.courseKey ?? '__other';
    const course = courseKey === '__other' ? undefined : courseByKey(courseKey);
    const g = groups.get(courseKey) ?? {
      courseKey,
      courseTitle: course ? course.title[lang] : ref.group,
      notes: [],
    };
    g.notes.push(ref);
    groups.set(courseKey, g);
  }
  for (const g of groups.values()) {
    g.notes.sort((a, b) => noteOrderIndex(a.slug) - noteOrderIndex(b.slug));
  }
  return [...groups.values()];
}

/** Language of the page being rendered, from its URL. */
export function langFromUrl(url: URL): Lang {
  return /\/zh(\/|$)/.test(url.pathname) ? 'zh' : 'en';
}
