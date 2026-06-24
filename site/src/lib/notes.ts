import type { CollectionEntry } from 'astro:content';

export type Lang = 'en' | 'zh';
export type NoteEntry = CollectionEntry<'notes'>;
export type ResearchAreaKey = 'flow-based-generative-modeling' | 'geometric-deep-learning';

export const noteSlugList = [
  // From Noise to Data — a unified path from simple noise to structured data
  'n2d-what-models-learn',
  'n2d-why-gaussian',
  'n2d-samples-as-particles',
  'n2d-vector-field',
  'n2d-probability-path',
  'n2d-continuity-equation',
  'n2d-denoising',
  'n2d-score-function',
  'n2d-velocity-regression',
  'n2d-conditional-to-marginal',
  'n2d-diffusion-fm-core',
  'n2d-probability-flow-ode',
  'n2d-sampling-as-integration',
  'n2d-path-design',
  'n2d-rectified-flow',
  'n2d-optimal-transport',
  'n2d-three-languages',
  'n2d-review',
  // Invariance and Equivariance — geometric deep learning bridge notes
  'map-view-invariance-equivariance',
  'cnn-translation-equivariance-from-map-views',
  'sets-and-point-clouds-permutation-invariance',
  'gnn-permutation-equivariance-road-networks',
  'rotation-and-group-equivariant-cnns',
  'euclidean-equivariant-gnns-point-clouds',
  'frontiers-of-equivariant-learning',
  'writing-compelling-introduction',
] as const;

const noteOrder = new Map(noteSlugList.map((slug, index) => [slug, index]));
const archivedNoteSlugs = new Set(['flow-matching-flow-ode', 'flow-matching-training']);

export const legacyNoteRedirects: Record<string, string> = {
  'flow-matching-flow-ode': 'n2d-probability-flow-ode',
  'flow-matching-training': 'n2d-velocity-regression',
};

export const categoryOrder = ['research-areas', 'academic-skills'] as const;

export const researchAreaOrder = ['flow-based-generative-modeling', 'geometric-deep-learning'] as const;

export const researchAreaLabels: Record<ResearchAreaKey, Record<Lang, string>> = {
  'flow-based-generative-modeling': {
    en: 'Flow-Based Generative Models',
    zh: 'Flow-Based Generative Models',
  },
  'geometric-deep-learning': {
    en: 'Geometric Deep Learning',
    zh: 'Geometric Deep Learning',
  },
};

const groupResearchAreas: Record<string, ResearchAreaKey | undefined> = {
  'From Noise to Data': 'flow-based-generative-modeling',
  'Invariance and Equivariance': 'geometric-deep-learning',
};

export const categoryLabels: Record<(typeof categoryOrder)[number], Record<Lang, string>> = {
  'research-areas': {
    en: 'Research Areas',
    zh: '研究領域',
  },
  'academic-skills': {
    en: 'Academic Skills',
    zh: '學術技能',
  },
};

export const statusLabels: Record<NoteEntry['data']['status'], Record<Lang, string>> = {
  available: {
    en: 'Available',
    zh: '可閱讀',
  },
  draft: {
    en: 'Draft',
    zh: '草稿',
  },
  missing: {
    en: 'Missing translation',
    zh: '缺少翻譯',
  },
  'coming-soon': {
    en: 'Coming soon',
    zh: '即將推出',
  },
};

export function noteRoute(slug: string, lang: Lang): string {
  return lang === 'zh' ? `zh/notes/${slug}` : `notes/${slug}`;
}

export function notesIndexRoute(lang: Lang): string {
  return lang === 'zh' ? 'zh/notes' : 'notes';
}

export function sortNotes(notes: NoteEntry[]): NoteEntry[] {
  return [...notes].sort((a, b) => {
    const categoryDelta = categoryOrder.indexOf(a.data.category) - categoryOrder.indexOf(b.data.category);
    if (categoryDelta !== 0) return categoryDelta;
    const areaDelta = researchAreaIndex(a) - researchAreaIndex(b);
    if (areaDelta !== 0) return areaDelta;
    const groupDelta = a.data.group.localeCompare(b.data.group);
    if (groupDelta !== 0) return groupDelta;
    return (noteOrder.get(a.data.slug) ?? 999) - (noteOrder.get(b.data.slug) ?? 999);
  });
}

export function notesForLang(notes: NoteEntry[], lang: Lang): NoteEntry[] {
  return sortNotes(notes.filter((note) => note.data.lang === lang && isListedNote(note)));
}

export function notesForListingLang(notes: NoteEntry[], lang: Lang): NoteEntry[] {
  const listedNotes = notes.filter(isListedNote);
  const slugs = [...new Set(listedNotes.map((note) => note.data.slug))];
  const selected = slugs
    .map((slug) => {
      const entries = listedNotes.filter((note) => note.data.slug === slug);
      return entries.find((note) => note.data.lang === lang) || entries.find((note) => note.data.lang !== lang);
    })
    .filter((note): note is NoteEntry => Boolean(note));

  return sortNotes(selected);
}

export function findNote(notes: NoteEntry[], slug: string, lang: Lang): NoteEntry | undefined {
  return notes.find((note) => note.data.slug === slug && note.data.lang === lang);
}

export function groupNotes(notes: NoteEntry[]) {
  return categoryOrder
    .map((category) => {
      const categoryNotes = sortNotes(notes.filter((note) => note.data.category === category && isListedNote(note)));
      const areas =
        category === 'research-areas'
          ? researchAreaOrder
              .map((area) => ({
                area,
                groups: groupsForNotes(categoryNotes.filter((note) => noteResearchArea(note) === area)),
              }))
              .filter((areaGroup) => areaGroup.groups.length > 0)
          : [
              {
                area: undefined,
                groups: groupsForNotes(categoryNotes),
              },
            ].filter((areaGroup) => areaGroup.groups.length > 0);

      return { category, areas };
    })
    .filter((categoryGroup) => categoryGroup.areas.length > 0);
}

export function siblingNotes(notes: NoteEntry[], entry: NoteEntry) {
  const siblings = notesForLang(notes, entry.data.lang).filter(
    (note) => note.data.category === entry.data.category && note.data.group === entry.data.group,
  );
  const index = siblings.findIndex((note) => note.data.slug === entry.data.slug);

  return {
    previous: index > 0 ? siblings[index - 1] : undefined,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined,
  };
}

export function latestNoteDate(notes: NoteEntry[]): Date | undefined {
  return notes.reduce<Date | undefined>((latest, note) => {
    if (!latest || note.data.updated > latest) return note.data.updated;
    return latest;
  }, undefined);
}

export function formatNoteDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

export function isListedNote(note: NoteEntry): boolean {
  return !archivedNoteSlugs.has(note.data.slug);
}

export function noteResearchArea(note: NoteEntry): ResearchAreaKey | undefined {
  return note.data.category === 'research-areas' ? groupResearchAreas[note.data.group] : undefined;
}

export function researchAreaLabelForNote(note: NoteEntry, lang: Lang): string | undefined {
  const area = noteResearchArea(note);
  return area ? researchAreaLabels[area][lang] : undefined;
}

function researchAreaIndex(note: NoteEntry): number {
  const area = noteResearchArea(note);
  return area ? researchAreaOrder.indexOf(area) : researchAreaOrder.length;
}

function groupsForNotes(notes: NoteEntry[]) {
  return [...new Set(notes.map((note) => note.data.group))].map((group) => ({
    group,
    notes: notes.filter((note) => note.data.group === group),
  }));
}
