import { Scholar } from '../../types';

export const contemporaryIslamicThoughtScholars: Scholar[] = [
  {
    id: 'scholar-4',
    name: { en: 'Dr. Tariq Ramadan', ar: 'د. طارق رمضان' },
    socialMedia: [{ platform: 'Twitter', link: 'https://twitter.com/tariqramadan', icon: 'FaTwitter' }],
    country: { en: 'Switzerland', ar: 'سويسرا' },
    language: ['French', 'English', 'Arabic'],
    avatarUrl: '/avatars/tariq_ramadan.png',
    bio: {
      en: 'Professor of Contemporary Islamic Studies at the University of Oxford.',
      ar: 'أستاذ الدراسات الإسلامية المعاصرة بجامعة أكسفورد.'
    },
    category: { en: 'Contemporary Islamic Thought', ar: 'الفكر الإسلامي المعاصر' }
  }
];
