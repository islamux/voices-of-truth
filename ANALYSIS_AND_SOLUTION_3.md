# Analysis and Solution for Scholar Data Inconsistency

## 1. Problem Analysis

A TypeScript error `Object literal may only specify known properties, but 'country' does not exist in type 'Scholar'` has been reported. This error originates from the data files located in `src/data/scholars/`.

The root cause of this issue is a data inconsistency between the scholar data and the `Scholar` type definition in `src/types/index.ts`.

- The `Scholar` type expects `countryId: number` and `categoryId: number`.
- The data files are incorrectly using `country: { en: '...', ar: '...' }` and `category: { en: '...', ar: '...' }`.

This is a systematic issue affecting all scholar data files.

## 2. Proposed Solution

The solution is to update all scholar data files to use the correct `countryId` and `categoryId` properties with their corresponding numeric IDs.

Below are the corrected code snippets for each affected file.

### 2.1. `src/data/scholars/comparative-religion.ts`

```typescript
import { Scholar } from '../../types';

export const comparativeReligionScholars: Scholar[] = [
  {
    id: 11,
    name: { en: 'Moaz Alian', ar: 'معاذ عليان' },
    socialMedia: [
        { platform: 'Facebook', link: 'https://facebook.com/MoazElian2', icon: 'FaFacebook' },
        { platform: 'Twitter', link: 'https://twitter.com/moazelian', icon: 'FaTwitter' },
        { platform: 'Instagram', link: 'https://instagram.com/moaz_alian2018', icon: 'FaInstagram' },
        { platform: 'Telegram', link: 'https://t.me/moazalian', icon: 'FaTelegram' }
    ],
    countryId: 1, // Egypt
    categoryId: 1, // Comparative Religion
    language: ['Arabic'],
    avatarUrl: '/avatars/moaz_elyan.png',
    bio: {
      en: 'Moaz Alian\'s channel is interested in Islamic-Christian dialogue, comparative religion, biblical criticism, responding to misconceptions about Islam, and addressing contemporary intellectual issues and those who deny the Sunnah. This is what I hope for, and God is the one who helps.',
      ar: 'قناة معاذ عليان مهتمة بالحوار الإسلامي المسيحي ومهتمة أيضًا بمقارنة الأديان والنقد الكتابي والرد على الشبهات عن الإسلام العظيم والرد على القضايا الفكرية المعاصرة ومنكري السنة هذا ما اتمناه والله من وراء القصد وبه نستعين'
    }
  },
  // ... (similarly for other scholars in this file)
];
```

### 2.2. `src/data/scholars/contemporary-islamic-thought.ts`

```typescript
import { Scholar } from '../../types';

export const contemporaryIslamicThoughtScholars: Scholar[] = [
  {
    id: 4,
    name: { en: 'Dr. Tariq Ramadan', ar: 'د. طارق رمضان' },
    socialMedia: [{ platform: 'Twitter', link: 'https://twitter.com/tariqramadan', icon: 'FaTwitter' }],
    countryId: 4, // Switzerland
    categoryId: 2, // Contemporary Islamic Thought
    language: ['French', 'English', 'Arabic'],
    avatarUrl: '/avatars/tariq_ramadan.png',
    bio: {
      en: 'Professor of Contemporary Islamic Studies at the University of Oxford.',
      ar: 'أستاذ الدراسات الإسلامية المعاصرة بجامعة أكسفورد.'
    }
  }
];
```

### 2.3. `src/data/scholars/dawah.ts`

```typescript
import { Scholar } from '../../types';

export const dawahScholars: Scholar[] = [
  {
    id: 6,
    name: { en: 'Mufti Menk', ar: 'مفتي منك' },
    socialMedia: [{ platform: 'YouTube', link: 'https://youtube.com/muftimenk', icon: 'FaYoutube' }],
    countryId: 5, // Zimbabwe
    categoryId: 3, // Da\'wah
    language: ['English'],
    avatarUrl: '/avatars/mufti_menk.png',
    bio: {
      en: 'Global Islamic scholar, preacher, and motivational speaker.',
      ar: 'عالم إسلامي عالمي وداعية ومتحدث تحفيزي.'
    }
  },
  // ... (similarly for other scholars in this file)
];
```

... and so on for all the other files.

**Note:** I have provided a few examples of the corrections. The same change needs to be applied to all scholar objects in all files under `src/data/scholars/`.
