import type { Lang } from './handbook';

/**
 * The bestiary — difficulties every researcher meets, written as monsters.
 *
 * Rules for adding an entry (see docs/lab-rpg-rules.md):
 *   1. It must be a real, recurring difficulty — not a joke.
 *   2. `symptom` must be recognisable: how you notice it has shown up.
 *   3. `why` must remove self-blame: why it appears for everyone.
 *   4. `counter` must point at a real handbook page. No link, no entry.
 */
export type MonsterTier = 'common' | 'elite' | 'boss';

export interface Monster {
  id: string;
  tier: MonsterTier;
  name: Record<Lang, string>;
  symptom: Record<Lang, string>;
  why: Record<Lang, string>;
  counter: Record<Lang, string>;
  /** Handbook slug holding the actual counter-play. */
  link: string;
  /** Triage tags — which "what's wrong right now" buttons surface this entry. */
  tags: SymptomKey[];
}

/** Triage filters. The person opening this page is usually frustrated and has
 *  no patience for thirteen cards, so the first thing they see is a row of
 *  "what is wrong right now" buttons. Order roughly matches when in a project
 *  each one tends to bite. */
export type SymptomKey =
  | 'env'
  | 'repro'
  | 'reading'
  | 'writing'
  | 'stuck'
  | 'noprogress'
  | 'time'
  | 'reviewers';

export const symptomFilters: { id: SymptomKey; label: Record<Lang, string> }[] = [
  { id: 'env', label: { en: 'Environment is broken', zh: '環境壞了' } },
  { id: 'repro', label: { en: "Can't reproduce a result", zh: '重現不出來' } },
  { id: 'reading', label: { en: 'Drowning in papers', zh: '論文讀不完' } },
  { id: 'writing', label: { en: "Can't start writing", zh: '寫不出來' } },
  { id: 'stuck', label: { en: 'Stuck, and not saying so', zh: '卡住又不敢說' } },
  { id: 'noprogress', label: { en: 'No visible progress', zh: '看不到進展' } },
  { id: 'time', label: { en: 'Not enough time', zh: '時間不夠' } },
  { id: 'reviewers', label: { en: 'Hit by reviews', zh: '被審稿意見打' } },
];

export const triageHeading: Record<Lang, string> = {
  en: "What's wrong right now?",
  zh: '你現在卡在哪？',
};
export const triageHint: Record<Lang, string> = {
  en: 'Pick anything that fits, or search. Nothing is saved.',
  zh: '點任何符合的，或直接搜尋。不會儲存任何東西。',
};
export const searchPlaceholder: Record<Lang, string> = {
  en: 'Search the bestiary…',
  zh: '搜尋圖鑑…',
};
export const clearFiltersLabel: Record<Lang, string> = { en: 'Show all', zh: '顯示全部' };
export const noMatchLabel: Record<Lang, string> = {
  en: 'Nothing matches. Bring it to the group meeting — if it is a real one, it belongs in here.',
  zh: '沒有符合的條目。拿到週會提出來——如果牠是真的，就該被寫進圖鑑。',
};

export const tierLabels: Record<MonsterTier, Record<Lang, string>> = {
  common: { en: 'Common', zh: '小怪' },
  elite: { en: 'Elite', zh: '精英' },
  boss: { en: 'Boss', zh: '王' },
};

export const bestiaryHeading: Record<Lang, string> = { en: 'Bestiary', zh: '怪物圖鑑' };
export const bestiaryIntro: Record<Lang, string> = {
  en: 'Every one of these will show up. None of them means you are not cut out for research — they are the normal texture of the work. Each entry links to how we actually deal with it.',
  zh: '這些你都會遇到。牠們沒有一隻代表你不適合做研究——牠們就是這份工作正常的紋理。每一條都連到我們實際的應對方式。',
};
export const monsterFieldLabels = {
  symptom: { en: 'SYMPTOM', zh: 'SYMPTOM' },
  why: { en: 'WHY', zh: 'WHY' },
  counter: { en: 'COUNTER', zh: 'COUNTER' },
};
/** Shown instead of a link when the counter-play page is still a draft. */
export const lockedLabel: Record<Lang, string> = { en: 'not yet unlocked', zh: '尚未開放' };

export function bestiaryRoute(lang: Lang): string {
  return lang === 'zh' ? 'zh/handbook/bestiary' : 'handbook/bestiary';
}

/**
 * Unreviewed entries. Same idea as `draftHandbookSlugs` in lib/handbook.ts:
 * the text stays in the repo but nothing about it reaches the site — not the
 * codex page, not the ENCOUNTER strips on handbook pages, not the card on the
 * lab home. Publish one by one by deleting its id from this set.
 *
 * While every monster is drafted, the bestiary link disappears from the nav and
 * the page itself says it is not open yet.
 */
export const draftMonsterIds = new Set<string>([
  'env-hell',
  'unreproducible',
  'hyperparameter-swamp',
  'paper-maze',
  'blank-page',
  'the-silence',
  'impostor',
  'perfectionist',
  'scope-creep',
  'reviewer-2',
  'deadline',
  'null-result',
  'long-plateau',
]);

/** The entries that are actually published. Use this everywhere, never `monsters`. */
export function visibleMonsters(): Monster[] {
  return monsters.filter((m) => !draftMonsterIds.has(m.id));
}

export const bestiaryClosed: Record<Lang, string> = {
  en: 'The codex is being checked over and is not open yet. It will fill up entry by entry.',
  zh: '圖鑑正在校對，還沒開放。之後會一條一條補上來。',
};

export const monsters: Monster[] = [
  {
    id: 'env-hell',
    tier: 'common',
    name: { en: 'Env Hell', zh: '環境地獄' },
    symptom: {
      en: 'CUDA versions, package conflicts, permissions — a whole day gone without a single line of research code.',
      zh: 'CUDA 版本、套件相依、權限，一整天過去，一行研究程式都沒寫到。',
    },
    why: {
      en: 'This has nothing to do with your research ability. It is infrastructure, and it happens to everyone.',
      zh: '這跟你的研究能力無關，純粹是基礎設施的問題，而且每個人都會遇到。',
    },
    counter: {
      en: 'Keep a cheap smoke test so you can tell whether the environment or your code broke. Stuck for more than half a day: ask technical support instead of grinding.',
      zh: '留一個成本很低的 smoke test，用來判斷是環境壞了還是程式壞了。卡超過半天就找技術支援，不要自己耗。',
    },
    link: 'onboarding-setup',
    tags: ['env'],
  },
  {
    id: 'unreproducible',
    tier: 'common',
    name: { en: 'The Unreproducible', zh: '重現不能' },
    symptom: {
      en: 'You follow the README exactly and the numbers still do not match. The authors have not replied.',
      zh: '照著 README 一步一步跑，數字就是對不上，寫信給作者也沒有回音。',
    },
    why: {
      en: 'Papers rarely report every setting. Seeds, versions and preprocessing are all plausible sources of the gap.',
      zh: '論文很少寫全所有設定。隨機種子、套件版本、資料前處理，都可能是差異的來源。',
    },
    counter: {
      en: 'Build a difference table and diagnose environment, theory and evaluation separately. Locating the cause counts as progress even when the numbers never match.',
      zh: '列一張差異表，把環境、理論、評估三類分開診斷。就算數字最後沒對上，能定位原因一樣是進展。',
    },
    link: 'phase-reproduce',
    tags: ['repro', 'env'],
  },
  {
    id: 'hyperparameter-swamp',
    tier: 'common',
    name: { en: 'Hyperparameter Swamp', zh: '調參泥沼' },
    symptom: {
      en: 'Two days of tuning later you have a setting that works and no idea why.',
      zh: '調了兩天，得到一個會動、但你也不知道為什麼會動的設定。',
    },
    why: {
      en: 'Tuning gives fast feedback and looks like work, so it is unusually easy to keep doing.',
      zh: '調參的回饋很即時，而且看起來很像在工作，所以特別容易一直做下去。',
    },
    counter: {
      en: 'Stop and list the possible causes first, then design the cheapest experiment that tells them apart.',
      zh: '先停下來列出幾個可能的原因，再設計成本最低的實驗去區分它們。',
    },
    link: 'daily-practice',
    tags: ['noprogress', 'time'],
  },
  {
    id: 'paper-maze',
    tier: 'common',
    name: { en: 'The Paper Maze', zh: '論文迷宮' },
    symptom: {
      en: 'Thirty papers read, and you cannot say what any single one of them actually does.',
      zh: '讀了三十篇，卻講不出任何一篇到底在做什麼。',
    },
    why: {
      en: 'Every paper got the same amount of effort, so the time was spread evenly and thinly.',
      zh: '每一篇都用同樣的力氣讀，時間就被平均分光了。',
    },
    counter: {
      en: 'Read in layers. Most papers can stop at layer one; only the ones you will build on deserve line-by-line reading.',
      zh: '分層讀。多數論文停在第一層就夠了，只有你要在上面繼續蓋東西的才值得逐式細讀。',
    },
    link: 'reading-papers',
    tags: ['reading'],
  },
  {
    id: 'blank-page',
    tier: 'common',
    name: { en: 'The Blank Page', zh: '空白頁' },
    symptom: {
      en: 'The editor has been open for two hours and nothing is on it.',
      zh: '編輯器開了兩小時，一個字都沒有。',
    },
    why: {
      en: 'It is usually not a writing problem. Where you get stuck writing is where the idea is not clear yet.',
      zh: '通常不是文筆問題。寫不出來的地方，往往就是想法還沒清楚的地方。',
    },
    counter: {
      en: 'Lay out the figures before the prose, and use the four-part skeleton. Treat the stuck paragraph as a finding about the research.',
      zh: '先把圖表排出來，再用四段骨架去寫。卡住的那一段，把它當成關於研究本身的發現。',
    },
    link: 'writing-papers',
    tags: ['writing'],
  },
  {
    id: 'the-silence',
    tier: 'elite',
    name: { en: 'The Silence', zh: '沉默' },
    symptom: {
      en: 'Stuck for two days without telling anyone; two weeks later it is a hole nobody can pull you out of.',
      zh: '卡住兩天沒有講，兩週後變成一個沒有人救得了的洞。',
    },
    why: {
      en: '"One more try and it will work" is convincing every single time — and admitting you are stuck feels like admitting failure.',
      zh: '「再試一下就通了」每一次聽起來都很有說服力，而且承認卡住讓人覺得像承認失敗。',
    },
    counter: {
      en: 'Two days stuck is the threshold: say it. The group meeting exists for exactly this.',
      zh: '卡兩天就是門檻，講出來。週會就是為了牠而存在的。',
    },
    link: 'getting-help',
    tags: ['stuck'],
  },
  {
    id: 'impostor',
    tier: 'elite',
    name: { en: 'The Impostor', zh: '冒牌者' },
    symptom: {
      en: 'You feel like the only one who does not understand, so you stop asking anything that looks basic.',
      zh: '覺得只有自己不懂，於是不敢問任何看起來基本的問題。',
    },
    why: {
      en: 'Almost everyone doing research has met it, including me. It is not a reliable signal about whether you belong.',
      zh: '幾乎每個做研究的人都遇過牠，包括我。牠不是判斷你適不適合的可靠訊號。',
    },
    counter: {
      en: 'Turn "I am not good enough" into one concrete question and ask it. Silence is the only thing that is hard to accept here.',
      zh: '把「我不夠格」換成一個具體的問題，然後問出來。在這裡只有沉默不語是比較不能接受的。',
    },
    link: 'how-we-discuss',
    tags: ['stuck'],
  },
  {
    id: 'perfectionist',
    tier: 'elite',
    name: { en: 'The Perfectionist', zh: '完美主義' },
    symptom: {
      en: 'Nothing is ever "ready to show" yet.',
      zh: '東西永遠都「還沒準備好給別人看」。',
    },
    why: {
      en: 'Waiting to hand over a perfect version means nobody can help you correct the direction while correcting is still cheap.',
      zh: '想一次交出完美的版本，結果是沒有人能在還來得及的時候幫你修正方向。',
    },
    counter: {
      en: 'Red-team it once yourself, then send it. An early rough version gets better feedback than a late polished one.',
      zh: '先自己當一次 reviewer 挑毛病，然後就送出去。早一點的粗版本，得到的回饋比晚一點的精緻版本有用。',
    },
    link: 'promises-and-expectations',
    tags: ['stuck', 'writing'],
  },
  {
    id: 'scope-creep',
    tier: 'elite',
    name: { en: 'Scope Creep', zh: '範圍蔓延' },
    symptom: {
      en: 'The topic keeps growing and there is always one more experiment before you can wrap up.',
      zh: '題目越滾越大，永遠還差一個實驗才能收。',
    },
    why: {
      en: 'Each extension looks reasonable on its own. Added together they are undoable.',
      zh: '每一個延伸單獨看都很合理，加起來就做不完了。',
    },
    counter: {
      en: 'Set the stop-loss point before you start, and shrink back to a toy example that answers one question.',
      zh: '開始之前就設好止損點，並縮回一個能回答單一問題的 toy example。',
    },
    link: 'research-principles',
    tags: ['noprogress', 'time'],
  },
  {
    id: 'reviewer-2',
    tier: 'boss',
    name: { en: 'Reviewer 2', zh: 'Reviewer 2' },
    symptom: {
      en: 'Clearly did not read it properly — and their opinion still decides the outcome.',
      zh: '明顯沒有讀懂，但他的意見仍然會決定結果。',
    },
    why: {
      en: 'More often than not it means the paper was not clear enough, rather than that they were hostile.',
      zh: '多數時候這代表論文沒寫清楚，而不是對方有惡意。',
    },
    counter: {
      en: 'Triage first: impact against what you can finish in the window. Concede what is right, answer what is wrong with evidence rather than tone.',
      zh: '先排序：影響力對上你在期限內做得完的規模。對的直接承認，錯的給證據、不要給語氣。',
    },
    link: 'rebuttals',
    tags: ['reviewers'],
  },
  {
    id: 'deadline',
    tier: 'boss',
    name: { en: 'The Deadline', zh: '死線' },
    symptom: {
      en: 'Not enough time, and everything feels like it has to be done.',
      zh: '時間不夠，而每件事看起來都非做不可。',
    },
    why: {
      en: 'The instinct is to start running experiments immediately, which pushes writing to the last day.',
      zh: '直覺反應是立刻開始跑實驗，於是寫作被擠到最後一天。',
    },
    counter: {
      en: 'One third triage and design, one third running, one third writing. Experiments that are not clearly written up may as well not exist.',
      zh: '三分之一排序與設計、三分之一跑實驗、三分之一寫。沒有被清楚寫出來的實驗，等於沒做。',
    },
    link: 'rebuttals',
    tags: ['time', 'reviewers'],
  },
  {
    id: 'null-result',
    tier: 'boss',
    name: { en: 'The Null Result', zh: '空結果' },
    symptom: {
      en: 'Three months of work, and your own experiment shows the direction was wrong.',
      zh: '三個月的方向，被自己的實驗證明是錯的。',
    },
    why: {
      en: 'We work on things nobody has done. Most ideas not working is the design, not the accident.',
      zh: '我們做的是還沒有人做過的事。大部分想法不會成功，這是設計，不是意外。',
    },
    counter: {
      en: 'Write it into the failure log so the next person skips the dead end. Shutting a direction down returns time to better work.',
      zh: '寫進 failure log，讓下一個人不用再走一次死胡同。收掉一個方向，是把時間還給更值得的工作。',
    },
    link: 'research-principles',
    tags: ['noprogress'],
  },
  {
    id: 'long-plateau',
    tier: 'boss',
    name: { en: 'The Long Plateau', zh: '漫長平原' },
    symptom: {
      en: 'Months without visible progress, and you start wondering whether you are suited to this at all.',
      zh: '好幾個月看不到進展，開始懷疑自己到底適不適合做研究。',
    },
    why: {
      en: 'Progress is real but uneven — long plains, occasionally interrupted by sudden clarity.',
      zh: '進展是真實的，但很不均勻——漫長的平原，偶爾被突如其來的清晰打斷。',
    },
    counter: {
      en: 'This is the texture of the work, not a verdict on you. Make the difficulty concrete, say it out loud, and keep walking.',
      zh: '這是這份工作的紋理，不是對你的判決。把困難具體化、講出來，然後繼續走。',
    },
    link: 'how-we-do-research',
    tags: ['noprogress', 'stuck'],
  },
];
