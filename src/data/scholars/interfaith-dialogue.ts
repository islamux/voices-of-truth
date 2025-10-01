import { Scholar } from '../../types';

export const interfaithDialogueScholars: Scholar[] = [
  {
    id: 7,
    name: { en: 'Dr. Ingrid Mattson', ar: 'د. إنغريد ماتسون' },
    socialMedia: [{ platform: 'Twitter', link: 'https://twitter.com/ingridmattson', icon: 'FaTwitter' }],
    countryId: 8,
    language: ['English'],
    avatarUrl: '/avatars/ingrid_mattson.png',
    bio: {
      en: 'Expert in Islamic studies, interfaith relations, and Muslim women in North America.',
      ar: 'خبيرة في الدراسات الإسلامية والعلاقات بين الأديان والمرأة المسلمة في أمريكا الشمالية.'
    },
    categoryId: 5
  },
  {
    id: 26,
    name: { en: 'Waleed Ismail', ar: 'وليد إسماعيل الدافع' },
    socialMedia: [
      { platform: 'TikTok', link: 'https://tiktok.com/@waleedismail1975', icon: 'FaTiktok' },
      { platform: 'TikTok', link: 'https://tiktok.com/@waleedismail755', icon: 'FaTiktok' },
      { platform: 'TikTok', link: 'https://tiktok.com/@w.ismail.1975', icon: 'FaTiktok' },
      { platform: 'Facebook', link: 'https://facebook.com/waleed.ismail11997755', icon: 'FaFacebook' },
      { platform: 'Facebook', link: 'https://facebook.com/WaledIsmail75', icon: 'FaFacebook' },
      { platform: 'Twitter', link: 'https://x.com/waleed_1_975', icon: 'FaTwitter' },
      { platform: 'Twitter', link: 'https://x.com/waledeldafa75', icon: 'FaTwitter' },
      { platform: 'Website', link: 'https://waleed-ismail.com', icon: 'FaGlobe' },
      { platform: 'PayPal', link: 'https://paypal.me/waleedismail1975', icon: 'FaPaypal' },
      { platform: 'Patreon', link: 'https://patreon.com/waleedismail', icon: 'SiPatreon' },
      { platform: 'Instagram', link: 'https://instagram.com/waleed_ismail197555', icon: 'FaInstagram' },
      { platform: 'YouTube', link: 'https://www.youtube.com/@waleedismail1', icon: 'FaYoutube' }
    ],
    countryId: 1,
    language: ['Arabic'],
    avatarUrl: '/avatars/walid.jpg',
    bio: {
      en: 'A dawah channel specializing in the Shia-Sunni dialogue. We ask God Almighty that it be a platform for the truth, a beacon of guidance, and a path to the gardens of Eden that God has promised His righteous servants.',
      ar: 'نرحب بكم في هذه القناة الدعوية المتخصصة بالحوار الشيعي السني والتي نسأل الله تعالى أن تكون منبرا للحق، ومنارة للهدى، وطريقا لجنات عدن التي وعد الله عباده المتقين.. أحتسب وقتي وجهدي وعملي كله لله سائلا الله أن يشملكم جميعا معنا في الأجر.'
    },
    categoryId: 5
  }
];
