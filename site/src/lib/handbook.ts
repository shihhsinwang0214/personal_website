import type { CollectionEntry } from 'astro:content';

export type Lang = 'en' | 'zh';
export type HandbookEntry = CollectionEntry<'handbook'>;
export type SectionKey = 'joining' | 'getting-started' | 'research' | 'policies';

// ── Publish toggle ───────────────────────────────────────────────────────────
// The handbook pages are always built. This only controls whether the
// "Lab Handbook" item shows in the top navigation. Flip to `true` to reveal it.
export const handbookInNav = true;

// Per-article hide: these slugs stay in the repo but are excluded from the site
// (no page is built, and they never appear in nav, landing, or prev/next).
// Delete a slug from this set to publish that article.
// Currently the handbook is simplified to a single recruiting page ("join")
// plus the reflection questionnaire; everything else is kept but hidden.
export const hiddenHandbookSlugs = new Set<string>([
  'who-should-apply',
  'what-i-look-for',
  'application-process',
  'is-this-lab-right-for-you',
  'lab-philosophy',
  'mentoring-philosophy',
  'expectations',
  'research-workflow',
  'meeting-guide',
  'ai-usage',
  'research-ethics',
  'reading-papers',
  'finding-research-problems',
  'running-experiments',
  'writing-papers',
  'giving-presentations',
  'reviewing-papers',
  'reproducibility',
  'open-source-and-code-quality',
  'authorship-policy',
  'collaboration-guidelines',
  'communication',
  'data-management',
  'feedback-culture',
]);

export interface SectionDef {
  key: SectionKey;
  icon: string;
  label: Record<Lang, string>;
  blurb: Record<Lang, string>;
  start: string; // slug of the first article in this section
}

export const handbookSections: SectionDef[] = [
  {
    key: 'joining',
    icon: '🌱',
    label: { en: 'Joining the Lab', zh: '加入實驗室' },
    blurb: {
      en: 'Current openings, who might fit, how to apply, and the reflection questionnaire.',
      zh: '目前招募、誰可能適合、如何申請，以及反思問卷。',
    },
    start: 'join',
  },
  {
    key: 'getting-started',
    icon: '🎓',
    label: { en: 'Getting Started', zh: '新人上手' },
    blurb: {
      en: 'Philosophy, expectations, workflow, and how we work day to day.',
      zh: '理念、期待、工作流程，以及我們日常如何工作。',
    },
    start: 'lab-philosophy',
  },
  {
    key: 'research',
    icon: '🔬',
    label: { en: 'Research', zh: '研究' },
    blurb: {
      en: 'Reading, finding problems, experiments, writing, and talks.',
      zh: '讀論文、找問題、跑實驗、寫作與報告。',
    },
    start: 'reading-papers',
  },
  {
    key: 'policies',
    icon: '🤝',
    label: { en: 'Policies & Collaboration', zh: '制度與協作' },
    blurb: {
      en: 'Authorship, communication, feedback, and data.',
      zh: '署名、溝通、回饋與資料。',
    },
    start: 'authorship-policy',
  },
];

// Role-based entry points on the landing page (map to sections).
export interface RoleCard {
  icon: string;
  section: SectionKey;
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
}
export const roleCards: RoleCard[] = [
  {
    icon: '🌱',
    section: 'joining',
    title: { en: 'Prospective Student', zh: '準學生' },
    desc: {
      en: 'Thinking about applying? Start with who thrives here and what I look for.',
      zh: '在考慮申請嗎？從「誰適合這裡」與「我看重什麼」開始。',
    },
  },
  {
    icon: '🎓',
    section: 'getting-started',
    title: { en: 'New Lab Member', zh: '新進成員' },
    desc: {
      en: 'Just joined? Learn how we think, what we expect, and how we work.',
      zh: '剛加入？了解我們如何思考、期待什麼、以及如何工作。',
    },
  },
  {
    icon: '🔬',
    section: 'research',
    title: { en: 'Current Researcher', zh: '現任研究者' },
    desc: {
      en: 'Doing the work — reading, experiments, writing, talks, and craft.',
      zh: '正在做研究——讀論文、實驗、寫作、報告與工藝。',
    },
  },
  {
    icon: '🤝',
    section: 'policies',
    title: { en: 'Collaboration & Policies', zh: '協作與制度' },
    desc: {
      en: 'Authorship, communication, feedback, and data — how we work together.',
      zh: '署名、溝通、回饋與資料——我們如何一起工作。',
    },
  },
];

// Lab identity + philosophy shown on the landing page. The lab content
// (name, description, philosophy, Why/How/What) stays in English on both
// language versions; only framework labels are localized.
// The lab NAME and technical terms stay in English on both languages; the
// prose (description / philosophy / pillar text) is bilingual { en, zh }.
export const labInfo = {
  name: 'Structure-Aware Modeling Lab',
  subtitle: 'SAM Lab · 格物致知實驗室',
  nameGloss: {
    en: 'Uncover the structure of things to expand the bounds of insight.',
    zh: '窮究事物之結構，拓展無盡之理解。',
  },
  eyebrow: { en: 'Lab', zh: '研究實驗室' },
  description: {
    en: 'Structure-Aware Modeling Lab (SAM Lab) leverages the inherent structure of data and problems to build AI methods with rigorous mathematical foundations.  We bridge mathematical theory, computational intuition, and implementable methods to study geometric deep learning, generative modeling, sampling, test-time guidance, and scientific applications. Scientific discovery serves as a central proving ground for our work, without defining its full boundary.',
    zh: '格物致知實驗室（SAM Lab）致力於利用數據與問題本身的結構，建立具數學基礎的 AI 方法。我們串接直覺、數學與工程，研究 geometric deep learning、generative modeling、sampling、test-time guidance 與 scientific applications。我們將科學上的應用場景視為我們工作的核心試驗場，但不限於此應用。',
  },
  philosophyHeading: { en: 'Philosophy', zh: '理念' },
  philosophy: {
  en: "Our research begins with intuitions and observations, uses mathematics and theory to describe and analyze them, translates the resulting understanding into applicable methods, and uses empirical evidence to refine the intuitions and theories behind those methods.",
  zh: "我們將直覺與觀察轉化為數學理解，將數學理解轉化為可應用的方法，再由實證深化原有的直覺與理解。",
  },
  pillars: [
    {
      key: 'why',
      label: { en: 'Why', zh: '為什麼' },
      text: {
        en: 'Important scientific and engineering problems live in structured spaces shaped by geometry, symmetry, hierarchy, constraints, and measurable observables. We seek to build AI methods that can use these structures to move beyond data-driven methods toward meaningful generation, exploration, and discovery.',
        zh: '重要的科學與工程問題，存在於由 geometry、symmetry、hierarchy、constraints 與可觀測之 observables 所構築的結構化空間裡。我們旨在打造能善用這些內在結構的 AI 方法，跨越單純的 data-driven methods，邁向具結構意義的生成、探索與發掘。',
      },
    },
    {
      key: 'how',
      label: { en: 'How', zh: '怎麼做' },
      text: {
        en: 'We work in a loop connecting intuition, mathematics, computation, and evidence. Starting from structural intuitions and scientific observations, we use mathematics and theory to describe and analyze the underlying structures. We translate this understanding into implementable methods, and use empirical results to refine both the methods and the understanding behind them.',
        zh: '我們透過一個貫通「直覺、數學、計算與實證」的循環來做研究。從對問題結構的直覺與科學觀察出發，我們運用數學與理論描述並分析其底層結構；再將這些理解轉化為可實作的方法，並以實證結果反過來修正方法及其背後的理解。',
      },
    },
    {
      key: 'what',
      label: { en: 'What', zh: '做什麼' },
      text: {
        en: 'We develop foundations and algorithms for representing and generating data through structure-aware modeling. We evaluate our methods through demanding problems in scientific discovery and engineering.',
        zh: '我們致力於建構以結構為核心的資料表徵與生成理論，並開發相應的演算法；並透過探索科學與工程領域中的前沿難題，來驗證我們研發的學習與生成方法',
      },
    },
  ],
};

export const statusLabels: Record<HandbookEntry['data']['status'], Record<Lang, string>> = {
  available: { en: 'Living', zh: '持續維護' },
  draft: { en: 'Draft', zh: '草稿' },
};

const sectionIndex = new Map(handbookSections.map((s, i) => [s.key, i]));

export function handbookRoute(slug: string, lang: Lang): string {
  return lang === 'zh' ? `zh/handbook/${slug}` : `handbook/${slug}`;
}
export function handbookIndexRoute(lang: Lang): string {
  return lang === 'zh' ? 'zh/handbook' : 'handbook';
}
export function sectionByKey(key: SectionKey): SectionDef {
  return handbookSections.find((s) => s.key === key)!;
}

function orderKey(e: HandbookEntry): number {
  return (sectionIndex.get(e.data.section) ?? 99) * 1000 + e.data.order;
}

// Best entry per slug for a language (prefer the requested lang, else the other).
export function handbookForLang(entries: HandbookEntry[], lang: Lang): HandbookEntry[] {
  const visible = entries.filter((e) => !hiddenHandbookSlugs.has(e.data.slug));
  const slugs = [...new Set(visible.map((e) => e.data.slug))];
  return slugs
    .map((slug) => {
      const es = visible.filter((e) => e.data.slug === slug);
      return es.find((e) => e.data.lang === lang) || es.find((e) => e.data.lang !== lang);
    })
    .filter((e): e is HandbookEntry => Boolean(e))
    .sort((a, b) => orderKey(a) - orderKey(b));
}

export interface HandbookNavGroup {
  section: SectionDef;
  items: HandbookEntry[];
}
export function handbookNav(entries: HandbookEntry[], lang: Lang): HandbookNavGroup[] {
  const list = handbookForLang(entries, lang);
  return handbookSections
    .map((section) => ({
      section,
      items: list
        .filter((e) => e.data.section === section.key)
        .sort((a, b) => a.data.order - b.data.order),
    }))
    .filter((g) => g.items.length > 0);
}

export function handbookOrdered(entries: HandbookEntry[], lang: Lang): HandbookEntry[] {
  return handbookNav(entries, lang).flatMap((g) => g.items);
}

export function handbookSiblings(entries: HandbookEntry[], entry: HandbookEntry, lang: Lang) {
  const ordered = handbookOrdered(entries, lang);
  const i = ordered.findIndex((e) => e.data.slug === entry.data.slug);
  return {
    previous: i > 0 ? ordered[i - 1] : undefined,
    next: i >= 0 && i < ordered.length - 1 ? ordered[i + 1] : undefined,
  };
}

export function findHandbook(entries: HandbookEntry[], slug: string, lang: Lang) {
  return entries.find((e) => e.data.slug === slug && e.data.lang === lang);
}

export function formatHandbookDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}
