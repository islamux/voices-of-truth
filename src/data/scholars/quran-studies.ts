import { Scholar } from '../../types';

export const quranStudiesScholars: Scholar[] = [
  {
    id: 9,
    name: { en: 'Nouman Ali Khan', ar: 'نعمان علي خان' },
    socialMedia: [{ platform: 'YouTube', link: 'https://youtube.com/bayyinah', icon: 'FaYoutube' }],
    countryId: 6,
    language: ['English', 'Urdu', 'Arabic'],
    avatarUrl: '/avatars/nouman_ali_khan.png',
    bio: {
      en: 'Founder and CEO of Bayyinah Institute, focusing on Arabic and Quranic studies.',
      ar: 'مؤسس ومدير معهد بينة ، مع التركيز على دراسسات اللغة العربية والقرآن الكريم.'
    },
    categoryId: 10
  },
  {
    id: 27,
    name: { en: 'Dr. Ayman Swaid', ar: 'الدكتور أيمن سويد' },
    socialMedia: [
      { platform: 'Facebook', link: 'https://facebook.com/Dr.AymanSwaid', icon: 'FaFacebook' },
      { platform: 'Instagram', link: 'https://instagram.com/dr.ayman_swaid', icon: 'FaInstagram' },
      { platform: 'Twitter', link: 'https://twitter.com/swaid_dr', icon: 'FaTwitter' },
      { platform: 'Telegram', link: 'https://t.me/Ayman_Swaid', icon: 'FaTelegram' },
      { platform: 'TikTok', link: 'https://tiktok.com/@dr.ayman_swaid', icon: 'FaTiktok' },
      { platform: 'WhatsApp', link: 'https://whatsapp.com/channel/0029Vax5CpwGk1Fy0otHtx2G', icon: 'FaWhatsapp' },
      { platform: 'YouTube', link: 'https://www.youtube.com/@Dr.AymanSwaid', icon: 'FaYoutube' }
    ],
    countryId: 7,
    language: ['Arabic'],
    avatarUrl: '/avatars/swid.jpg',
    bio: {
      en: 'Official channel : Dr. Ayman Sweid. A member of the global council of Quranic reciters affiliated with the Muslim World League.',
      ar: 'القناة الرسمية : الدكتور أيمن سويد. عضو المجلس العالمي لشيوخ الإقراء التابع لرابطة العالم الإسلامي.'
    },
    categoryId: 10
  }
];
