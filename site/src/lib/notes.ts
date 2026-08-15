import type { CollectionEntry } from 'astro:content';

export type Lang = 'en' | 'zh';
export type NoteEntry = CollectionEntry<'notes'>;
export type ResearchAreaKey = 'flow-based-generative-modeling' | 'geometric-deep-learning';

export const noteSlugList = [
  // From Noise to Data — a unified path from simple noise to structured data
  'n2d-overview',
  'n2d-what-models-learn',
  'n2d-samples-as-particles',
  'n2d-vector-field',
  'n2d-probability-path',
  'n2d-denoising',
  'n2d-score-function',
  'n2d-velocity-regression',
  'n2d-sampling-as-integration',
  'n2d-three-languages',
  'n2d-review',
  // All the Math You Need for Deep Learning — course notes
  // (category: "courses"; group: "Lecture N · …"; ordered within each lecture by this list)
  'math-randomness-and-distribution',
  'math-density-vs-probability',
  'math-expectation-and-averages',
  'math-points-as-vectors',
  'math-norms-and-distance',
  'math-inner-product-and-similarity',
  'math-matrix-as-data-and-map',
  'math-linear-map-geometry',
  'math-eigenvectors-and-eigenvalues',
  'math-svd',
  'math-pca',
  'math-low-rank-approximation',
  // Diffusion & Flow Models — graduate course notes
  'dfc-principles-transport-map',
  'dfc-principles-corrupt-and-reverse',
  'dfc-principles-course-map',
  'n2d-continuity-equation',
  'n2d-probability-flow-ode',
  'n2d-conditional-to-marginal',
  'n2d-diffusion-fm-core',
  'n2d-path-design',
  'n2d-rectified-flow',
  'n2d-optimal-transport',
  'n2d-why-gaussian',
  // Invariance and Equivariance — geometric deep learning bridge notes
  'map-view-invariance-equivariance',
  'cnn-translation-equivariance-from-map-views',
  'sets-and-point-clouds-permutation-invariance',
  'gnn-permutation-equivariance-road-networks',
  'rotation-and-group-equivariant-cnns',
  'euclidean-equivariant-gnns-point-clouds',
  'frontiers-of-equivariant-learning',
  'writing-compelling-introduction',
  'academic-website-starter-prompt',
] as const;

const noteOrder = new Map(noteSlugList.map((slug, index) => [slug, index]));
const archivedNoteSlugs = new Set(['flow-matching-flow-ode', 'flow-matching-training']);

// Display order for note groups within each category/area. Listed explicitly so
// the order is intentional (e.g. "From Noise to Data" before "Diffusion & Flow
// Models", and "Lecture 10 · …" after "Lecture 2 · …" — a string compare fails both).
const groupOrder = [
  // Research Areas
  'From Noise to Data',
  'Diffusion & Flow Models',
  'Invariance and Equivariance',
  // Courses — All the Math You Need for Deep Learning
  'Lecture 1 · Vectors & Similarity',
  'Lecture 2 · Eigen, SVD & PCA',
  'Lecture 3 · Spectral Methods',
  'Lecture 4 · Regression & Least Squares',
  'Lecture 5 · Gradients & Optimization',
  'Lecture 6 · Probability & Estimation',
  'Lecture 7 · From Probability to Loss',
  'Lecture 8 · Dynamics & Flows',
  'Lecture 9 · Reading the Math in Papers',
  'Lecture 10 · Review & Projects',
  // Academic Skills
  'Paper Writing',
  'Website & Tooling',
];
const groupOrderIndex = (group: string) => {
  const i = groupOrder.indexOf(group);
  return i === -1 ? Number.POSITIVE_INFINITY : i;
};

// Per-group metadata for the notes index (description, reading-order treatment).
// Keys are the frontmatter `group` labels. Set `defaultOpen`/`startHere` to true
// to expand a group on load and flag its first note.
export interface GroupMeta {
  description?: Record<Lang, string>;
  ordered?: boolean;
  defaultOpen?: boolean;
  startHere?: boolean;
}
export const groupMeta: Record<string, GroupMeta> = {
  'From Noise to Data': {
    description: {
      zh: '從一團 noise 到結構化資料的統一直覺路徑。',
      en: 'A unified, intuition-first path from noise to data.',
    },
    ordered: true,
  },
  'Diffusion & Flow Models': {
    description: {
      zh: 'diffusion 與 flow-based 生成模型的研究所課程筆記。',
      en: 'Graduate-course notes on diffusion & flow-based generative models.',
    },
    ordered: true,
  },
  'Invariance and Equivariance': {
    description: {
      zh: 'geometric deep learning：把對稱性（invariance / equivariance）寫進模型。',
      en: 'Geometric deep learning: building symmetry (invariance / equivariance) into models.',
    },
    ordered: true,
  },
  'Paper Writing': {
    description: {
      zh: '學術論文寫作技巧。',
      en: 'Craft for academic paper writing.',
    },
  },
  'Website & Tooling': {
    description: {
      zh: '學術網站與研究工具的搭建方式，可以直接複製去用。',
      en: 'Building academic websites and research tooling — copy and reuse.',
    },
  },
};

export const legacyNoteRedirects: Record<string, string> = {
  'flow-matching-flow-ode': 'n2d-probability-flow-ode',
  'flow-matching-training': 'n2d-velocity-regression',
};

export const categoryOrder = ['research-areas', 'courses', 'academic-skills'] as const;

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
  'Diffusion & Flow Models': 'flow-based-generative-modeling',
  'Invariance and Equivariance': 'geometric-deep-learning',
};

export const categoryLabels: Record<(typeof categoryOrder)[number], Record<Lang, string>> = {
  'research-areas': {
    en: 'Research Areas',
    zh: '研究領域',
  },
  courses: {
    en: 'Courses',
    zh: '課程',
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

// ── Courses ──────────────────────────────────────────────────────────────────
// The "Courses" category renders as: course title → a full lecture roadmap.
// Lectures with no notes yet show as "Coming soon"; the first ready lecture
// opens by default. `group` here must match each note's frontmatter `group`.
export interface CourseLectureDef {
  group: string;
  description: Record<Lang, string>;
}
export interface CourseDef {
  key: string;
  title: Record<Lang, string>;
  category: (typeof categoryOrder)[number];
  lectures: CourseLectureDef[];
}

export const courses: CourseDef[] = [
  {
    key: 'math-for-dl',
    title: {
      en: 'All the Math You Need for Deep Learning',
      zh: 'All the Math You Need for Deep Learning',
    },
    category: 'courses',
    lectures: [
      {
        group: 'Lecture 1 · Vectors & Similarity',
        description: {
          zh: '把資料變成 vector，再用距離與方向量「像不像」。',
          en: 'Turn data into vectors; compare them with distance and direction.',
        },
      },
      {
        group: 'Lecture 2 · Eigen, SVD & PCA',
        description: {
          zh: '用 eigenvector、SVD、PCA 壓縮與看懂高維資料。',
          en: 'Eigenvectors, SVD, and PCA to compress and visualize high-dimensional data.',
        },
      },
      {
        group: 'Lecture 3 · Spectral Methods',
        description: {
          zh: '同一個 spectral 想法：影像壓縮與圖的分群。',
          en: 'One spectral idea behind image compression and graph clustering.',
        },
      },
      {
        group: 'Lecture 4 · Regression & Least Squares',
        description: {
          zh: '用 feature 預測數值：least squares 與最佳預測。',
          en: 'Predict from features with least squares and the optimal predictor.',
        },
      },
      {
        group: 'Lecture 5 · Gradients & Optimization',
        description: {
          zh: 'gradient、Jacobian、chain rule 與 gradient descent。',
          en: 'Gradients, Jacobians, the chain rule, and gradient descent.',
        },
      },
      {
        group: 'Lecture 6 · Probability & Estimation',
        description: {
          zh: '隨機、期望、變異，以及「差距是不是雜訊」。',
          en: 'Randomness, expectation, spread, and telling real gains from noise.',
        },
      },
      {
        group: 'Lecture 7 · From Probability to Loss',
        description: {
          zh: 'MLE、分類、cross-entropy / KL 與 ELBO。',
          en: 'Maximum likelihood, classification, cross-entropy / KL, and the ELBO.',
        },
      },
      {
        group: 'Lecture 8 · Dynamics & Flows',
        description: {
          zh: 'vector field、ODE，把 noise 流成資料。',
          en: 'Vector fields, ODEs, and flowing noise into data.',
        },
      },
      {
        group: 'Lecture 9 · Reading the Math in Papers',
        description: {
          zh: '把論文公式拆解、重推一次、翻成白話與程式。',
          en: 'Decode, re-derive, and translate the math in real papers.',
        },
      },
      {
        group: 'Lecture 10 · Review & Projects',
        description: {
          zh: '總複習、符號自我檢查與專題。',
          en: 'Review, a notation self-test, and projects.',
        },
      },
    ],
  },
];

// ── Visibility control ───────────────────────────────────────────────────────
// Hide a whole section from the site with ONE edit here. A hidden group/course is
// removed from every listing, the home page, search, and RSS, and its pages are not
// built at all (the URLs 404). To HIDE a section, add its label/key to the set;
// to RELEASE it, delete that line. Nothing else needs to change.
//
//   hiddenGroups      — research-area group labels (frontmatter `group`)
//   hiddenCourseKeys  — course keys from the `courses` array above
export const hiddenGroups = new Set<string>([
  'Diffusion & Flow Models',
]);
export const hiddenCourseKeys = new Set<string>([
  'math-for-dl',
]);

const lectureGroupToCourseKey = new Map<string, string>();
for (const course of courses) {
  for (const lecture of course.lectures) lectureGroupToCourseKey.set(lecture.group, course.key);
}

export function isHiddenNote(note: NoteEntry): boolean {
  if (hiddenGroups.has(note.data.group)) return true;
  const courseKey = lectureGroupToCourseKey.get(note.data.group);
  return courseKey ? hiddenCourseKeys.has(courseKey) : false;
}

// The single predicate every listing / page-builder should use: listed (not the
// archived legacy notes) AND not currently hidden.
export function isPublishedNote(note: NoteEntry): boolean {
  return isListedNote(note) && !isHiddenNote(note);
}

export interface CourseLectureView {
  group: string;
  description: string;
  comingSoon: boolean;
  open: boolean;
  notes: NoteEntry[];
}
export interface CourseView {
  key: string;
  title: string;
  lectures: CourseLectureView[];
}

export function courseSections(notes: NoteEntry[], lang: Lang): CourseView[] {
  const listed = notes.filter(isPublishedNote);
  return courses
    .filter((course) => !hiddenCourseKeys.has(course.key))
    .map((course) => {
    const lectures: CourseLectureView[] = course.lectures.map((lecture) => {
      const lectureNotes = sortNotes(
        listed.filter(
          (note) => note.data.category === course.category && note.data.group === lecture.group,
        ),
      );
      return {
        group: lecture.group,
        description: lecture.description[lang],
        comingSoon: lectureNotes.length === 0,
        open: false,
        notes: lectureNotes,
      };
    });
    const firstReady = lectures.find((lecture) => !lecture.comingSoon);
    if (firstReady) firstReady.open = true;
    return { key: course.key, title: course.title[lang], lectures };
  });
}

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
    const aGroupIndex = groupOrderIndex(a.data.group);
    const bGroupIndex = groupOrderIndex(b.data.group);
    const groupDelta =
      aGroupIndex === bGroupIndex
        ? a.data.group.localeCompare(b.data.group)
        : aGroupIndex - bGroupIndex;
    if (groupDelta !== 0) return groupDelta;
    return (noteOrder.get(a.data.slug) ?? 999) - (noteOrder.get(b.data.slug) ?? 999);
  });
}

export function notesForLang(notes: NoteEntry[], lang: Lang): NoteEntry[] {
  return sortNotes(notes.filter((note) => note.data.lang === lang && isPublishedNote(note)));
}

export function notesForListingLang(notes: NoteEntry[], lang: Lang): NoteEntry[] {
  const listedNotes = notes.filter(isPublishedNote);
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
      const categoryNotes = sortNotes(notes.filter((note) => note.data.category === category && isPublishedNote(note)));
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
