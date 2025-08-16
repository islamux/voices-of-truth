import { Scholar } from '../types';

export const scholars: Scholar[] = [
  {
    id: 'scholar-1',
    name: { en: 'Dr. John Doe', ar: 'د. جون دو' },
    socialMedia: { platform: 'Twitter', link: 'https://twitter.com/johndoe', icon: 'FaTwitter' },
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English', 'Arabic'],
    avatarUrl: '/avatars/john_doe.png',
    bio: { 
      en: 'Expert in Islamic jurisprudence and comparative religion.',
      ar: 'خبير في الفقه الإسلامي ومقارنة الأديان.'
    }
  },
  {
    id: 'scholar-2',
    name: { en: 'Sheikha Fatima Ali', ar: 'الشيخة فاطمة علي' },
    socialMedia: { platform: 'YouTube', link: 'https://youtube.com/fatimaali', icon: 'FaYoutube' },
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/fatima_ali.png',
    bio: {
      en: 'Focuses on Quranic studies and community outreach.',
      ar: 'تركز على الدراسات القرآنية والتواصل المجتمعي.'
    }
  },
  {
    id: 'scholar-3',
    name: { en: 'Imam Zaid Shakir', ar: 'إمام زيد شاكر' },
    socialMedia: { platform: 'Facebook', link: 'https://facebook.com/imamzaidshakir', icon: 'FaFacebook' },
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English'],
    avatarUrl: '/avatars/zaid_shakir.png',
    bio: {
      en: 'Co-founder of Zaytuna College, a liberal arts college in Berkeley, California.',
      ar: 'أحد مؤسسي كلية الزيتونة ، وهي كلية فنون ليبرالية في بيركلي ، كاليفورنيا.'
    }
  },
  {
    id: 'scholar-4',
    name: { en: 'Dr. Tariq Ramadan', ar: 'د. طارق رمضان' },
    socialMedia: { platform: 'Twitter', link: 'https://twitter.com/tariqramadan', icon: 'FaTwitter' },
    country: { en: 'Switzerland', ar: 'سويسرا' },
    language: ['French', 'English', 'Arabic'],
    avatarUrl: '/avatars/tariq_ramadan.png',
    bio: {
      en: 'Professor of Contemporary Islamic Studies at the University of Oxford.',
      ar: 'أستاذ الدراسات الإسلامية المعاصرة بجامعة أكسفورد.'
    }
  },
  {
    id: 'scholar-5',
    name: { en: 'Yasmin Mogahed', ar: 'ياسمين مجاهد' },
    socialMedia: { platform: 'Instagram', link: 'https://instagram.com/yasminmogahed', icon: 'FaInstagram' },
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English'],
    avatarUrl: '/avatars/yasmin_mogahed.png',
    bio: {
      en: 'Specializes in spiritual development, psychology, and personal growth.',
      ar: 'متخصص في التنمية الروحية وعلم النفس والنمو الشخصي.'
    }
  },
  {
    id: 'scholar-6',
    name: { en: 'Mufti Menk', ar: 'مفتي منك' },
    socialMedia: { platform: 'YouTube', link: 'https://youtube.com/muftimenk', icon: 'FaYoutube' },
    country: { en: 'Zimbabwe', ar: 'زيمبابوي' },
    language: ['English'],
    avatarUrl: '/avatars/mufti_menk.png',
    bio: {
      en: 'Global Islamic scholar, preacher, and motivational speaker.',
      ar: 'عالم إسلامي عالمي وداعية ومتحدث تحفيزي.'
    }
  },
  {
    id: 'scholar-7',
    name: { en: 'Dr. Ingrid Mattson', ar: 'د. إنغريد ماتسون' },
    socialMedia: { platform: 'Twitter', link: 'https://twitter.com/ingridmattson', icon: 'FaTwitter' },
    country: { en: 'Canada', ar: 'كندا' },
    language: ['English'],
    avatarUrl: '/avatars/ingrid_mattson.png',
    bio: {
      en: 'Expert in Islamic studies, interfaith relations, and Muslim women in North America.',
      ar: 'خبيرة في الدراسات الإسلامية والعلاقات بين الأديان والمرأة المسلمة في أمريكا الشمالية.'
    }
  },
  {
    id: 'scholar-8',
    name: { en: 'Hamza Yusuf', ar: 'حمزة يوسف' },
    socialMedia: { platform: 'Facebook', link: 'https://facebook.com/hamzayusuf', icon: 'FaFacebook' },
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English', 'Arabic'],
    avatarUrl: '/avatars/hamza_yusuf.png',
    bio: {
      en: 'President of Zaytuna College and a leading proponent of classical Islamic learning.',
      ar: 'رئيس كلية الزيتونة ومن أبرز دعاة التعلم الإسلامي الكلاسيكي.'
    }
  },
  {
    id: 'scholar-9',
    name: { en: 'Nouman Ali Khan', ar: 'نعمان علي خان' },
    socialMedia: { platform: 'YouTube', link: 'https://youtube.com/bayyinah', icon: 'FaYoutube' },
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English', 'Urdu', 'Arabic'],
    avatarUrl: '/avatars/nouman_ali_khan.png',
    bio: {
      en: 'Founder and CEO of Bayyinah Institute, focusing on Arabic and Quranic studies.',
      ar: 'مؤسس ومدير معهد بينة ، مع التركيز على دراسات اللغة العربية والقرآن الكريم.'
    }
  },
  {
    id: 'scholar-10',
    name: { en: 'Dr. Amina Wadud', ar: 'د. أمينة ودود' },
    socialMedia: { platform: 'Twitter', link: 'https://twitter.com/amina_wadud', icon: 'FaTwitter' },
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English'],
    avatarUrl: '/avatars/amina_wadud.png',
    bio: {
      en: 'Scholar of Islam with a focus on Quranic interpretation and gender justice.',
      ar: 'باحثة في الإسلام مع التركيز على تفسير القرآن والعدالة بين الجنسين.'
    }
  },
  {
    id: 'scholar-11',
    name: { en: 'Moaz Elyan', ar: 'معاذ عليان' },
    socialMedia: { platform: 'YouTube', link: 'https://www.youtube.com/@moazalian', icon: 'FaYoutube' },
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/moaz_elyan.png',
    bio: {
      en: 'Egyptian preacher specialized in comparative religion.',
      ar: 'داعية مصري متخصص في مقارنة الأديان.'
    }
  }
];
