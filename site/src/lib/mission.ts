import type { Lang } from './handbook';
import { research } from '../data/content';

/**
 * Main quests — the lab's research directions.
 *
 * Deliberately **parallel, not sequential**: no roadmap, no progression tree,
 * no milestones. `MAIN QUEST 01/02/03` is an identifier, not a rank or an
 * order of work.
 *
 * Name and description come from `research` in data/content.ts so there is one
 * source for the prose. The fields below it are additive and **currently
 * empty on purpose** — a scientific question, a status line, and who is on a
 * direction are things only Shih-Hsin can write. Cards render only the fields
 * that have a value, so an unfilled quest looks unfinished rather than fake.
 */
export interface MainQuest {
  id: string;
  /** Identifier shown as a mono label. Not a ranking. */
  code: string;
  title: string;
  desc: Record<Lang, string>;
  /** The one question this direction is trying to answer. TO FILL IN. */
  question?: Record<Lang, string>;
  /** Where this direction currently stands, in a phrase. TO FILL IN. */
  status?: Record<Lang, string>;
  /** `group` values in the notes collection — resolved to real notes at build. */
  noteGroups: string[];
  /** Names matching `labMembers`. TO FILL IN. */
  crew?: string[];
}

const questMeta: { id: string; noteGroups: string[] }[] = [
  { id: 'geometric', noteGroups: ['Invariance and Equivariance'] },
  { id: 'generative', noteGroups: ['From Noise to Data', 'Diffusion & Flow Models', 'Flow Matching'] },
  { id: 'ai-for-science', noteGroups: [] },
];

export const mainQuests: MainQuest[] = research.map((r, i) => ({
  id: questMeta[i]?.id ?? `quest-${i + 1}`,
  code: `MAIN QUEST ${String(i + 1).padStart(2, '0')}`,
  title: r.name,
  desc: { en: r.desc, zh: r.descZh },
  noteGroups: questMeta[i]?.noteGroups ?? [],
}));

/**
 * Unreviewed quests. Same mechanism as `draftMonsterIds` in lib/bestiary.ts:
 * a quest in this set appears nowhere — not on the board, not on the console,
 * not in the sidebar. Delete an id to publish that quest.
 *
 * While every quest is drafted, the Main Mission panel still shows on the lab
 * home (it is the lab's identity, not a quest), but nothing links to the board.
 */
export const draftQuestIds = new Set<string>([
  'geometric',
  'generative',
  'ai-for-science',
]);

/** The quests that are actually published. Use this, never `mainQuests`. */
export function visibleQuests(): MainQuest[] {
  return mainQuests.filter((q) => !draftQuestIds.has(q.id));
}

export function missionsRoute(lang: Lang): string {
  return lang === 'zh' ? 'zh/handbook/missions' : 'handbook/missions';
}

export const missionText = {
  boardHeading: { en: 'Mission Board', zh: '任務看板' },
  boardIntro: {
    en: 'The directions this lab works on. They run in parallel — the numbers are identifiers, not an order.',
    zh: '這個研究室在做的方向。它們是並行的——編號只是識別碼，不是先後順序。',
  },
  mainMission: { en: 'Main Mission', zh: '主線任務' },
  activeQuests: { en: 'Active Main Quests', zh: '進行中的主線' },
  question: { en: 'QUESTION', zh: 'QUESTION' },
  status: { en: 'STATUS', zh: 'STATUS' },
  fieldNotes: { en: 'FIELD NOTES', zh: 'FIELD NOTES' },
  crew: { en: 'CREW', zh: 'CREW' },
  noNotesYet: { en: 'No field notes on this direction yet.', zh: '這個方向還沒有相關筆記。' },
  allNotes: { en: 'All notes →', zh: '所有筆記 →' },
  viewBoard: { en: 'Mission board →', zh: '任務看板 →' },
  boardClosed: {
    en: 'The mission board is being written up and is not open yet.',
    zh: '任務看板還在整理，尚未開放。',
  },
} satisfies Record<string, Record<Lang, string>>;
