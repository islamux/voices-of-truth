import { Scholar } from '../../types';

export const islamicThoughtScholars: Scholar[] = [
  {
    id: 22,
    name: { en: 'Dr. Tareq AlSuwaidan', ar: 'د. طارق السويدان' },
    socialMedia: [
        { platform: 'Website', link: 'https://suwaidan.com', icon: 'FaGlobe' },
        { platform: 'Facebook', link: 'https://facebook.com/profile.php?id=100044026244282', icon: 'FaFacebook' },
        { platform: 'Instagram', link: 'https://instagram.com/dr.tareqalsuwaidan/?hl=en', icon: 'FaInstagram' },
        { platform: 'Twitter', link: 'https://twitter.com/TareqAlSuwaidan', icon: 'FaTwitter' },
        { platform: 'TikTok', link: 'https://tiktok.com/@dr.tareqalsuwaidan', icon: 'FaTiktok' },
        { platform: 'LinkedIn', link: 'https://linkedin.com/in/tareq-alsuwaidan', icon: 'FaLinkedin' },
        { platform: 'Telegram', link: 'https://t.me/AlSuwaidan', icon: 'FaTelegram' },
        { platform: 'YouTube', link: 'https://youtube.com/@Dr.Tareq-Al-Suwaidan-ENG', icon: 'FaYoutube' },
        { platform: 'Android', link: 'https://play.google.com/store/apps/dev?id=4773038490070940699', icon: 'FaAndroid' },
        { platform: 'iOS', link: 'https://apps.apple.com/us/developer/ebdaa-fikry/id523487499', icon: 'FaApple' }
    ],
    countryId: 10,
    language: ['Arabic', 'English'],
    avatarUrl: '/avatars/tariq.jpg',
    bio: {
      en: 'Interested in Islamic thought and leadership and administrative training, aiming for human happiness in this world and the hereafter. The official channel of Dr. Tareq AlSuwaidan.',
      ar: 'مهتم بالفكر الإسلامي والتدريب القيادي والإداري ، يهدف لسعادة الإنسان في الدنيا والآخرة.\n\nالقناة الرسمية للدكتور طارق السويدان'
    },
    categoryId: 8
  }
];
