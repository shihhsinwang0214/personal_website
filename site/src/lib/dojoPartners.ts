/** Names are shared across lessons; an approach belongs to a scene, not a mascot. */
export const dojoPartners = {
  nori: { name: 'Nori', description: '戴 orca 帽的北極熊', initial: 'N', avatar: undefined as string | undefined },
  lumi: { name: 'Lumi', description: '有翅膀的鹿', initial: 'L', avatar: undefined as string | undefined },
  mugi: { name: 'Mugi', description: '有柴犬臉的柯基', initial: 'M', avatar: undefined as string | undefined },
} as const;

export type DojoPartnerId = keyof typeof dojoPartners;
