import { Scholar } from '../../types';

export const dawahScholars: Scholar[] = [
  {
    id: 6,
    name: { en: 'Mufti Menk', ar: 'مفتي منك' },
    socialMedia: [{ platform: 'YouTube', link: 'https://youtube.com/muftimenk', icon: 'FaYoutube' }],
    countryId: 5,
    language: ['English'],
    avatarUrl: '/avatars/mufti_menk.png',
    bio: {
      en: 'Global Islamic scholar, preacher, and motivational speaker.',
      ar: 'عالم إسلامي عالمي وداعية ومتحدث تحفيزي.'
    },
    categoryId: 3
  },
  {
    id: 19,
    name: { en: 'Dr. Mahmoud Elmasry', ar: 'د. محمود المصري' },
    socialMedia: [
      { platform: 'YouTube', link: 'https://youtube.com/channel/UCoxabeyx-KBuLth-cFgvwNw', icon: 'FaYoutube' },
      { platform: 'Facebook', link: 'https://facebook.com/100024876780762', icon: 'FaFacebook' },
      { platform: 'Twitter', link: 'https://twitter.com/Drmahmoudelmas3', icon: 'FaTwitter' }
    ],
    countryId: 1,
    language: ['Arabic'],
    avatarUrl: '/avatars/mahmoud-masri.jpg',
    bio: {
      en: 'A moderate educational channel for all people in this universe. A dawah channel far from extremism, aiming to spread pure creed and authentic knowledge from the Quran and Sunnah, with gentle preaching adorned with smiles and mercy. Focuses on building the Muslim person educationally, morally and behaviorally to be a blessing for the entire universe.',
      ar: 'قناة لكل الناس في هذا الكون، قناة دعوية وسطية تربوية بعيدة عن الغلو والتطرف. هدفنا نشر العقيدة الصافية والعلم الصحيح النابع من الكتاب والسُنة، ونشر الموعظة الرقيقة المُزينة بالبسمة والرحمة، والاعتناء ببناء الإنسان المسلم بناءً تربوياً وأخلاقياً وسلوكياً ليكون بركة على الكون كله.'
    },
    categoryId: 3
  },
  {
    id: 21,
    name: { en: 'Sheikh Muhammad Hussein Yacoub', ar: 'الشيخ محمد حسين يعقوب' },
    socialMedia: [
      { platform: 'Website', link: 'https://yaqob.com', icon: 'FaGlobe' },
      { platform: 'Facebook', link: 'https://facebook.com/YaqobPage', icon: 'FaFacebook' },
      { platform: 'Twitter', link: 'https://twitter.com/MohamedYaqob', icon: 'FaTwitter' },
      { platform: 'SoundCloud', link: 'https://soundcloud.com/yaqob-audio', icon: 'FaSoundcloud' },
      { platform: 'Telegram', link: 'https://telegram.me/alrabania', icon: 'FaTelegram' }
    ],
    countryId: 1,
    language: ['Arabic'],
    avatarUrl: '/avatars/yaqoub.jpg',
    bio: {
      en: 'Prominent Egyptian Islamic preacher and educator known for his spiritual guidance and educational programs. Focuses on purification of the soul, Islamic ethics, and building strong Muslim character.',
      ar: 'داعية إسلامي ومربي مصري بارز معروف بتوجيهاته الروحية وبرامجه التربوية. يركز على تزكية النفس والأخلاق الإسلامية وبناء الشخصية المسلمة القوية.'
    },
    categoryId: 3
  }
  ,
  {
    id: 99,
    name: { en: 'Abdullah Rushdy', ar: 'عبد الله رشدي' },
    socialMedia: [
      { platform: 'YouTube', link: 'https://www.youtube.com/@abdullahrushdyarabic', icon: 'FaYoutube' }
    ],
    countryId: 1,
    language: ['Arabic'],
    avatarUrl: '/avatars/rushdy.jpg',
    bio: {
      en: "Alternate channel of Sheikh Abdullah Rushdy.",
      ar: 'القناة البديلة للشيخ عبدالله رشدي'
    },
    categoryId: 3
  }
];
