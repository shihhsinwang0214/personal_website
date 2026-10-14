import noriWelcome from '../assets/dojo/partners/nori-welcome.png';
import noriSuggest from '../assets/dojo/partners/nori-suggest.png';
import noriExplain from '../assets/dojo/partners/nori-explain.png';
import noriQuestion from '../assets/dojo/partners/nori-question.png';
import lumiWelcome from '../assets/dojo/partners/lumi-welcome.png';
import lumiSuggest from '../assets/dojo/partners/lumi-suggest.png';
import lumiExplain from '../assets/dojo/partners/lumi-explain.png';
import lumiQuestion from '../assets/dojo/partners/lumi-question.png';
import mugiWelcome from '../assets/dojo/partners/mugi-welcome.png';
import mugiSuggest from '../assets/dojo/partners/mugi-suggest.png';
import mugiExplain from '../assets/dojo/partners/mugi-explain.png';
import mugiQuestion from '../assets/dojo/partners/mugi-question.png';

export const dojoPartnerPoses = ['welcome', 'suggest', 'explain', 'question'] as const;
export type DojoPartnerPose = (typeof dojoPartnerPoses)[number];

/** A role belongs to this part of the conversation, not permanently to a mascot. */
export const dojoPartners = {
  nori: { name: 'Nori', description: '戴 orca 帽的北極熊', poses: { welcome: noriWelcome, suggest: noriSuggest, explain: noriExplain, question: noriQuestion } },
  lumi: { name: 'Lumi', description: '有翅膀的鹿', poses: { welcome: lumiWelcome, suggest: lumiSuggest, explain: lumiExplain, question: lumiQuestion } },
  mugi: { name: 'Mugi', description: '有柴犬臉的柯基', poses: { welcome: mugiWelcome, suggest: mugiSuggest, explain: mugiExplain, question: mugiQuestion } },
} as const;

export type DojoPartnerId = keyof typeof dojoPartners;
