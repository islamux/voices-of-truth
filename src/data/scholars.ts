import { Scholar } from '../types';
import { comparativeReligionScholars } from './scholars/comparative-religion';
import { contemporaryIslamicThoughtScholars } from './scholars/contemporary-islamic-thought';
import { dawahScholars } from './scholars/dawah';
import { hadithStudiesScholars } from './scholars/hadith-studies';
import { interfaithDialogueScholars } from './scholars/interfaith-dialogue';
import { islamicHistoryScholars } from './scholars/islamic-history';
import { islamicJurisprudenceScholars } from './scholars/islamic-jurisprudence';
import { islamicThoughtScholars } from './scholars/islamic-thought';
import { quranStudiesScholars } from './scholars/quran-studies';
import { quranInterpretationScholars } from './scholars/quran-interpretation';
import { spiritualityEthicsScholars } from './scholars/spirituality-ethics';

export const scholars: Scholar[] = [
  ...comparativeReligionScholars,
  ...contemporaryIslamicThoughtScholars,
  ...dawahScholars,
  ...hadithStudiesScholars,
  ...interfaithDialogueScholars,
  ...islamicHistoryScholars,
  ...islamicJurisprudenceScholars,
  ...islamicThoughtScholars,
  ...quranInterpretationScholars,
  ...quranStudiesScholars,
  ...spiritualityEthicsScholars,
];;



