import { Scholar } from '../../types';

export const quranInterpretationScholars: Scholar[] = [
  {
    id: 'scholar-10',
    name: { en: 'Dr. Amina Wadud', ar: 'د. أمينة ودود' },
    socialMedia: [{ platform: 'Twitter', link: 'https://twitter.com/amina_wadud', icon: 'FaTwitter' }],
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English'],
    avatarUrl: '/avatars/amina_wadud.png',
    bio: {
      en: 'Scholar of Islam with a focus on Quranic interpretation and gender justice.',
      ar: 'باحثة في الإسلام مع التركيز على تفسير القرآن والعدالة بين الجنسين.'
    },
    category: { en: 'Quran Interpretation', ar: 'تفسير القرآن' }
  }
];
