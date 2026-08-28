import type { Lang } from './handbook';

/**
 * Join page self-check.
 *
 * Hard constraints — see docs/lab-interaction-plan.md:
 *   - No score, no verdict, no "you are / are not a fit". Anything that reads
 *     as a test scares off exactly the people who take self-doubt seriously.
 *   - The output is a list of things to ask about, phrased as his offer.
 *   - Nothing is stored, nothing is sent.
 *   - With JS off, every prompt is visible as static text, so the whole thing
 *     still reads as a useful document.
 */
export interface SelfCheckItem {
  id: string;
  /** A statement the reader judges against themselves. */
  statement: Record<Lang, string>;
  /** Shown when it does not fit, or they are unsure. Always in his voice. */
  prompt: Record<Lang, string>;
}

export const selfCheckTitle: Record<Lang, string> = {
  en: 'A checklist for yourself',
  zh: '給自己看的檢查表',
};

export const selfCheckIntro: Record<Lang, string> = {
  en: "This isn't a test and there's no score — it doesn't affect how I read your application, and I never see the answers. It's here because the reflection questionnaire takes a few hours, and it's better for both of us if you find the mismatches before you spend them.",
  zh: '這不是測驗，沒有分數，也不會影響我怎麼看你的申請——我看不到你的答案。放在這裡是因為反思問卷要花上幾個小時，如果有哪裡不合，早一點發現對雙方都好。',
};

export const selfCheckNote: Record<Lang, string> = {
  en: 'Answers stay in this page and are never sent anywhere. Reloading clears them.',
  zh: '答案只留在這個頁面，不會傳出去。重新整理就消失了。',
};

export const selfCheckAnswers = {
  yes: { en: 'Sounds like me', zh: '像我' },
  no: { en: 'Not really', zh: '不太像' },
  unsure: { en: 'Not sure', zh: '不確定' },
};

export const selfCheckResultHeading: Record<Lang, string> = {
  en: "Not a verdict — just things you might want to ask me about, in your first email or at the interview:",
  zh: '這不是評分。以下是你可能會想在第一封信裡，或面試的時候先問我的事：',
};

export const selfCheckAllClear: Record<Lang, string> = {
  en: "Nothing flagged. If you've read the rest of this page, just email me. And even with nothing flagged, you're welcome to ask me anything.",
  zh: '沒有跳出任何提醒。如果你已經讀完這一頁，直接寄信給我就好。就算全部都很符合，也歡迎問我任何問題。',
};

export const selfCheckStaticLead: Record<Lang, string> = {
  en: 'If this one is not you:',
  zh: '如果這一點不太像你：',
};

export const selfCheckReset: Record<Lang, string> = { en: 'Start over', zh: '重來' };

export const selfCheckItems: SelfCheckItem[] = [
  {
    id: 'null-results',
    statement: {
      en: 'I can handle several months without a positive result, because most ideas do not work.',
      zh: '「大部分想法不會成功」這件事，我可以接受連續幾個月沒有正面的結果。',
    },
    prompt: {
      en: "I can walk you through what progress actually looks like here, and how I usually decide whether a direction is still worth continuing when there is nothing to show yet.",
      zh: '我可以先跟你說明「進展」在這裡實際上長什麼樣子，以及我通常怎麼在還沒有結果的時候，判斷一個方向值不值得繼續。',
    },
  },
  {
    id: 'half-formed',
    statement: {
      en: 'I am willing to show a half-formed idea and let people pick holes in it.',
      zh: '我願意在想法還沒完全成形的時候，就拿出來給人挑毛病。',
    },
    prompt: {
      en: "Ask me how the group meeting actually runs. It is more like looking for the problem together than being graded — though I know that is not very convincing until you have sat through one.",
      zh: '可以先問我 group meeting 實際上怎麼進行。它比較像一起把問題找出來，不是評分——不過我知道這件事光用說的不太有說服力。',
    },
  },
  {
    id: 'few-and-deep',
    statement: {
      en: 'I would rather have one paper people still read in five years than three that few people read.',
      zh: '比起一年三篇比較少人讀的論文，我更想要一篇五年後還有人讀的。',
    },
    prompt: {
      en: "We should talk about the timeline pressure you are under — graduation, applications, military service, what your family expects — before we decide how big a problem to take on. That is not a small thing and it is worth saying out loud early.",
      zh: '我們可以先談你現在的時程壓力（畢業、申請學校、兵役、家裡的期待），再一起決定題目要多大。這不是小事，值得在開始前就講清楚。',
    },
  },
  {
    id: 'toy-example',
    statement: {
      en: 'Faced with a new idea, I tend to check it on a very small example before running anything large.',
      zh: '遇到新想法，我習慣先做一個很小的例子確認，而不是直接跑大規模的實驗。',
    },
    prompt: {
      en: "This is something you practise, not a bar you have to clear. Ask me how the first month works — mostly I will do the first one together with you.",
      zh: '這是可以練的，不是門檻。可以先問我第一個月會怎麼帶——我大多會先跟你一起做一次。',
    },
  },
  {
    id: 'ask-early',
    statement: {
      en: 'After two days stuck, I would say so rather than push on alone for another week.',
      zh: '卡住兩天之後我會主動說，而不是自己再撐一週。',
    },
    prompt: {
      en: "Ask me what asking for help actually looks like here, and how I respond to it. I do this too — I used to do it a lot — so I am not going to hold it against you.",
      zh: '可以先問我「求助」在這裡實際上長什麼樣子，還有我會怎麼回應。我自己也會這樣硬撐（而且以前很常），所以我不會覺得這是問題。',
    },
  },
  {
    id: 'explaining',
    statement: {
      en: 'I like explaining complicated things to people from different backgrounds using everyday examples.',
      zh: '我喜歡用生活化的例子，把複雜的東西講給不同背景的人聽。',
    },
    prompt: {
      en: "Ask me how much weight explaining carries here, and what I will ask you to walk me through at the interview. I care about this a lot, so it is worth knowing in advance.",
      zh: '可以先問我表達在這裡佔多少比重，以及面試的時候我會請你講解什麼。我很注重這件事，所以值得你先知道。',
    },
  },
  {
    id: 'outside-field',
    statement: {
      en: 'I am willing to spend time on talks outside my field, or on conversations with people in other areas.',
      zh: '我願意花時間去聽不是自己領域的演講，或跟不同領域的人聊。',
    },
    prompt: {
      en: "Ask me how that apparently inefficient time fits into our rhythm. I am not saying you have to go every week — I just hope it does not get squeezed out entirely.",
      zh: '可以先問我這些「看起來低效的時間」在我們的節奏裡怎麼安排。我不是想說你必須每週都去，而是希望它不會完全被排掉。',
    },
  },
];
