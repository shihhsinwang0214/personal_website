import type { CollectionEntry } from 'astro:content';

export type Lang = 'en' | 'zh';
export type HandbookEntry = CollectionEntry<'handbook'>;
export type SectionKey = 'joining' | 'practice' | 'getting-started' | 'craft';

// ── Publish toggle ───────────────────────────────────────────────────────────
// The handbook pages are always built. This only controls whether the
// "Lab Handbook" item shows in the top navigation. Flip to `true` to reveal it.
export const handbookInNav = true;

// Per-article hide: these slugs stay in the repo but are excluded from the
// PRODUCTION site (no page is built, and they never appear in nav, landing, or
// prev/next). Remove a slug from this list to publish that article.
//
// During `npm run dev` these pages ARE built and shown, so drafts can be
// reviewed in the browser before they go live. `npm run build` hides them again,
// so nothing here can reach the deployed site by accident.
export const draftHandbookSlugs = new Set<string>([
  'who-should-apply',
  'what-i-look-for',
  // Practice section — held back for now.
  'ai-usage',
  'research-ethics',
  // Getting Started section — drafted from the onboarding guide, awaiting review.
  'onboarding-overview',
  'onboarding-setup',
  'phase-shared-language',
  'phase-reproduce',
  'phase-first-question',
  'phase-present-revise',
  'getting-help',
  'onboarding-templates',
  // Research Craft section — first draft written, awaiting review.
  'reading-papers',
  'writing-papers',
  'rebuttals',
  'reviewing-papers',
  'giving-presentations',
  'career',
]);

// Preview toggle for drafts.
//   false → drafts are hidden everywhere, including `npm run dev` (default).
//   true  → drafts are built and shown locally, so they can be reviewed in the
//           browser. Only takes effect in `npm run dev`; the production build
//           always hides drafts, so this can never leak to the live site.
const PREVIEW_DRAFTS = false;

const isDev = Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV);
export const hiddenHandbookSlugs: Set<string> =
  isDev && PREVIEW_DRAFTS ? new Set<string>() : draftHandbookSlugs;

export interface SectionDef {
  key: SectionKey;
  icon: string;
  label: Record<Lang, string>;
  /** Mono tag shown beside the section label — the RPG reading of this section.
   *  English on both languages, like the rest of the game vocabulary.
   *  See docs/lab-rpg-rules.md for the mapping. */
  tag: string;
  blurb: Record<Lang, string>;
  start: string; // slug of the first article in this section
}

export const handbookSections: SectionDef[] = [
  {
    key: 'joining',
    icon: '🌱',
    tag: 'RECRUITMENT QUEST',
    label: { en: 'Joining the Lab', zh: '加入研究室' },
    blurb: {
      en: 'Current openings, who might fit, how to apply, and the reflection questionnaire.',
      zh: '目前招募、誰可能適合、如何申請，以及反思問卷。',
    },
    start: 'join',
  },
  {
    key: 'practice',
    icon: '🧭',
    tag: 'HOW WE LEVEL UP',
    label: { en: 'How We Do Research', zh: '我們怎麼做研究' },
    blurb: {
      en: 'What I believe, how we discuss, how the day-to-day works, and what we promise each other.',
      zh: '我相信什麼、我們怎麼討論、日常怎麼運作，以及彼此的承諾與期待。',
    },
    start: 'how-we-do-research',
  },
  {
    key: 'getting-started',
    icon: '🎓',
    tag: 'TUTORIAL',
    label: { en: 'Getting Started', zh: '新人上手' },
    blurb: {
      en: 'Your first month: setup, the four stages, how to ask for help, and the shared templates.',
      zh: '第一個月：環境與支持網、四個階段、卡住時怎麼求助，以及共用模板。',
    },
    start: 'onboarding-overview',
  },
  {
    key: 'craft',
    icon: '🔬',
    tag: 'SKILL MANUAL',
    label: { en: 'Research Craft', zh: '研究技藝' },
    blurb: {
      en: 'Reading, writing, rebuttals, reviewing, talks, and career.',
      zh: '讀論文、寫論文、回覆審稿、審稿、對外報告與職涯。',
    },
    start: 'reading-papers',
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
    icon: '🧭',
    section: 'practice',
    title: { en: 'New Lab Member', zh: '新進成員' },
    desc: {
      en: 'Just joined? Learn how we think, what we expect, and how we work.',
      zh: '剛加入？了解我們如何思考、期待什麼、以及如何工作。',
    },
  },
  {
    icon: '🔬',
    section: 'craft',
    title: { en: 'Current Researcher', zh: '現任研究者' },
    desc: {
      en: 'Doing the work — reading, experiments, writing, talks, and craft.',
      zh: '正在做研究——讀論文、實驗、寫作、報告與工藝。',
    },
  },
];

// Lab identity + philosophy shown on the landing page. The lab content
// (name, description, philosophy, Why/How/What) stays in English on both
// language versions; only framework labels are localized.
// The lab NAME and technical terms stay in English on both languages; the
// prose (description / philosophy / pillar text) is bilingual { en, zh }.
export const labInfo = {
  name: 'Structure-Aware Learning and Modeling Lab',
  subtitle: '結構導向學習與建模研究室（別名：格物致知研究室）',
  nameGloss: {
    en: 'Uncover the structure of things to expand the bounds of insight.',
    zh: '格物以察其構，致知以明其理；窮究事物之結構，拓展無盡之理解。',
  },
  eyebrow: { en: 'Lab', zh: '研究室' },
  description: {
    en: 'Structure-Aware Learning and Modeling Lab leverages the inherent structure of data and problems to build AI methods with rigorous mathematical foundations.  We bridge mathematical theory, computational intuition, and implementable methods to advance research in geometric deep learning, generative modeling, sampling, test-time guidance, and scientific applications. Scientific discovery serves as a central proving ground for our work, without defining its full boundary.',
    zh: '結構導向學習與建模研究室致力於利用數據與問題本身的結構，建立具數學基礎的 AI 方法。我們串接直覺、數學與工程，深入研究 geometric deep learning、generative modeling、sampling、test-time guidance 與 scientific applications。我們將科學上的應用場景視為我們工作的核心試驗場，但不限於此應用。',
  },
  philosophyHeading: { en: 'Philosophy', zh: '理念' },
  philosophy: {
  en: "Our research begins with intuitions and observations, uses mathematics and theory to describe and analyze them, translates the resulting understanding into applicable methods, and uses empirical evidence to refine the intuitions and theories behind those methods.",
  zh: "我們將直覺與觀察轉化為數學理解，將數學理解轉化為可應用的方法，再由實證深化直覺與理解。",
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
        en: 'We develop foundations and algorithms for representing and generating data through Structure-Aware Learning and Modeling. We evaluate our methods through demanding problems in scientific discovery and engineering.',
        zh: '我們致力於建構以結構為核心的資料表徵與生成理論，並開發相應的演算法；並透過探索科學與工程領域中的前沿難題，來驗證我們研發的學習與生成方法',
      },
    },
  ],
};

// ── Lab members ──────────────────────────────────────────────────────────────
// Shown on the lab home page. Add `nameEn` when someone has a preferred
// romanization; the Chinese name is used on its own when they don't.
export interface Person {
  /** Display name. Chinese name for local members, English name otherwise. */
  name: string;
  /** Romanized / English name, shown next to `name` when present. */
  nameEn?: string;
  /** Optional per-person line under the name, e.g. "Summer Intern 2026". */
  role?: string;
  /** Path under public/ — e.g. 'images/people/chen.jpg'. Falls back to a monogram.
   *  Non-ASCII and spaces are fine; the view percent-encodes the URL. */
  photo?: string;
  /** Optional second photo — the less serious one. Clicking the card photo
   *  flips to it. Leave empty and no flip affordance is rendered. */
  photoAlt?: string;
  /** Gilded card frame. Marks the expedition leader, so the card says it by
   *  its treatment instead of repeating what the ROLE line already states. */
  foil?: boolean;
  /** Research area, in a phrase — not a paragraph. English only, by design. */
  focus?: string;
  /** Optional personal interests, one short line. */
  interests?: string;
  /** Year they joined, shown as a stat row. */
  since?: string;
  links?: { email?: string; scholar?: string; github?: string; homepage?: string };
}

export interface MemberGroup {
  label: Record<Lang, string>;
  people: Person[];
}

/** Title of the handbook itself. Two forms on purpose:
 *  - `handbookTitle` is what the sidebar shows — the in-world name.
 *  - `handbookTitleFormal` is what carries wayfinding load: <title>, JSON-LD,
 *    and the small second line under the sidebar head. Someone searching for
 *    「研究室手冊」or "lab handbook" has to be able to find this.
 *  When the two match (English), the second line is not rendered. */
export const handbookTitle: Record<Lang, string> = { en: 'Lab Handbook', zh: '遠征攻略' };
export const handbookTitleFormal: Record<Lang, string> = { en: 'Lab Handbook', zh: '研究室手冊' };

export const peopleHeading: Record<Lang, string> = { en: 'People', zh: '遠征隊成員' };
export const piHeading: Record<Lang, string> = {
  en: 'Principal Investigator',
  zh: '遠征隊隊長',
};
export const focusLabel: Record<Lang, string> = { en: 'Interests', zh: '興趣' };

/** Mono stat-row labels on the member cards. English on both languages, the way
 *  the technical vocabulary is elsewhere on the site.
 *  ROLE rather than CLASS on purpose — "class" reads as social rank in Chinese. */
export const statLabels = { role: 'ROLE', quest: 'QUEST', joined: 'JOINED', hobby: 'HOBBY' };

/** Game-flavoured section labels for the People page.
 *  The lab reads as an expedition: a group that goes out for a long time,
 *  into terrain nobody has mapped, and comes back with something.
 *  CSS class names still say `.party*` — internal only, not user-facing. */
export const expeditionTag = 'EXPEDITION';
/** Heading over the member roster — the people on the expedition, as distinct
 *  from the expedition itself (which is the lab). */
export const partyHeading: Record<Lang, string> = { en: 'The Expedition Party', zh: '遠征隊隊伍' };
export const recruitingTag: Record<Lang, string> = { en: 'OPEN QUEST', zh: '招募中' };
export const allMembersLabel: Record<Lang, string> = { en: 'All members →', zh: '所有成員 →' };

export function peopleRoute(lang: Lang): string {
  return lang === 'zh' ? 'zh/handbook/people' : 'handbook/people';
}

export const labMembers: MemberGroup[] = [
  {
    label: { en: "Master's Students", zh: '碩士生' },
    people: [{ name: '鄭承櫸', since: '2026 Fall' }],
  },
  {
    label: { en: 'Undergraduate & High School Researchers', zh: '專題生' },
    people: [
      // `-card.jpg` files are square crops generated from the originals, which
      // stay in the folder untouched. Re-crop with the script in
      // docs/lab-interaction-plan.md if a source photo is replaced.
      { name: '吳宇傑', since: '2026 Fall' },
      {
        name: '曾家振',
        since: '2026 Fall',
        photo: 'images/people/曾家振-card.jpg',
      },
      { name: '胡允升', since: '2026 Fall' },
      {
        name: '陳澔樂',
        since: '2026 Fall',
        photo: 'images/people/陳澔樂-card.jpg',
        photoAlt: 'images/people/陳澔樂-反-card.jpg',
      },
      { name: '林育正', since: '2026 Fall' },
      {
        name: '范思緯',
        since: '2026 Fall',
        photo: 'images/people/范思緯-card.jpg',
        photoAlt: 'images/people/范思緯-反-card.jpg',
      },
      {
        name: '阮炫嘉',
        since: '2026 Fall',
        photo: 'images/people/阮炫嘉-card.jpg',
        photoAlt: 'images/people/阮炫嘉-反-card.jpg',
      },
      {
        name: 'Richard Mai',
        since: '2026 Fall',
        photo: 'images/people/Richard Mai-card.jpg',
        photoAlt: 'images/people/Richard Mai-反-card.jpg',
      },
    ],
  },
];

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
