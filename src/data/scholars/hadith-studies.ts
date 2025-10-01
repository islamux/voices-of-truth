import { Scholar } from '../../types';

export const hadithStudiesScholars: Scholar[] = [
  {
    id: 3,
    name: { en: 'Imam Zaid Shakir', ar: 'إمام زيد شاكر' },
    socialMedia: [{ platform: 'Facebook', link: 'https://facebook.com/imamzaidshakir', icon: 'FaFacebook' }],
    countryId: 6,
    language: ['English'],
    avatarUrl: '/avatars/zaid_shakir.png',
    bio: {
      en: 'Co-founder of Zaytuna College, a liberal arts college in Berkeley, California.',
      ar: 'أحد مؤسسي كلية الزيتونة ، وهي كلية فنون ليبرالية في بيركلي ، كاليفورنيا.'
    },
    categoryId: 4
  },
  {
    id: 8,
    name: { en: 'Hamza Yusuf', ar: 'حمزة يوسف' },
    socialMedia: [{ platform: 'Facebook', link: 'https://facebook.com/hamzayusuf', icon: 'FaFacebook' }],
    countryId: 6,
    language: ['English', 'Arabic'],
    avatarUrl: '/avatars/hamza_yusuf.png',
    bio: {
      en: 'President of Zaytuna College and a leading proponent of classical Islamic learning.',
      ar: 'رئيس كلية الزيتونة ومن أبرز دعاة التعلم الإسلامي الكلاسيكي.'
    },
    categoryId: 4
  },
  {
    id: 20,
    name: { en: 'Sheikh Abu Ishaq Al-Huwayni', ar: 'الشيخ أبو إسحاق الحويني' },
    socialMedia: [
      { platform: 'Website', link: 'https://alheweny.me', icon: 'FaGlobe' },
      { platform: 'YouTube', link: 'https://youtube.com/AlhewenyTube', icon: 'FaYoutube' },
      { platform: 'Facebook', link: 'https://facebook.com/Alheweny.Official.Page', icon: 'FaFacebook' },
      { platform: 'Twitter', link: 'https://twitter.com/alheweny', icon: 'FaTwitter' },
      { platform: 'Instagram', link: 'https://instagram.com/alheweny', icon: 'FaInstagram' },
      { platform: 'Telegram', link: 'https://t.me/Alheweny', icon: 'FaTelegram' },
      { platform: 'SoundCloud', link: 'https://soundcloud.com/alheweny-official', icon: 'FaSoundcloud' },
      { platform: 'WhatsApp', link: 'https://whatsapp.com/channel/0029Va1AYFbDOQIY2diIxl3y', icon: 'FaWhatsapp' }
    ],
    countryId: 1,
    language: ['Arabic'],
    avatarUrl: '/avatars/hwaini.jpg',
    bio: {
      en: 'Prominent Egyptian scholar specializing in Hadith sciences and Islamic jurisprudence. Known for his deep knowledge of prophetic traditions and authentic narrations.',
      ar: 'عالم مصري بارز متخصص في علوم الحديث والفقه الإسلامي. معروف بعلمه العميق في الأحاديث النبوية والروايات الصحيحة.'
    },
    categoryId: 4
  },
  {
    id: 24,
    name: { en: 'Sheikh Muhammad Nasiruddin al-Albani', ar: 'فضيلة الشيخ محمد ناصر الدين الألباني' },
    socialMedia: [
      { platform: 'Android', link: 'https://play.google.com/store/apps/details?id=com.q8coders.android.sheks', icon: 'FaAndroid' },
      { platform: 'iOS', link: 'https://itunes.apple.com/us/app/kbar-al-lma/id1063032733?mt=8', icon: 'FaApple' },
      { platform: 'Facebook', link: 'https://facebook.com/sheikhalalbany/?ref=your_pages', icon: 'FaFacebook' },
      { platform: 'Instagram', link: 'https://instagram.com/sheikhalalbany', icon: 'FaInstagram' },
      { platform: 'Twitter', link: 'https://twitter.com/sheikhalalbany', icon: 'FaTwitter' },
      { platform: 'Telegram', link: 'https://t.me/sheikhalalbany', icon: 'FaTelegram' },
      { platform: 'SoundCloud', link: 'https://soundcloud.com/sheikhalalbany', icon: 'FaSoundcloud' },
      { platform: 'YouTube', link: 'https://www.youtube.com/@SheikhAlalbany', icon: 'FaYoutube' }
    ],
    countryId: 7,
    language: ['Arabic'],
    avatarUrl: '/avatars/albani.jpg',
    bio: {
      en: 'The channel of Sheikh Al-Albani, affiliated with the Senior Scholars Project. The project started in 2013 and is ongoing. Special thanks to everyone who contributed to the success of this project. Your feedback is welcome.',
      ar: 'قناة الشيخ الالباني التابعة لمشروع كبار العلماء : تم البدء بالمشروع منذ عام 2013 ومستمرون حتى الانتهاء أن شاء الله. شكر خاص لأصحاب الأيادي البيضاء وكل شخص ساهم في إنجاح هذا المشروع . ملاحظتكم تسعدنا وتفرحنا وهي أساس لنجاح المشروع'
    },
    categoryId: 4
  }
];
