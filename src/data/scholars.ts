import { Scholar } from '../types';

export const scholars: Scholar[] = [
  {
    id: 'scholar-3',
    name: { en: 'Imam Zaid Shakir', ar: 'إمام زيد شاكر' },
    socialMedia: [{ platform: 'Facebook', link: 'https://facebook.com/imamzaidshakir', icon: 'FaFacebook' }],
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English'],
    avatarUrl: '/avatars/zaid_shakir.png',
    bio: {
      en: 'Co-founder of Zaytuna College, a liberal arts college in Berkeley, California.',
      ar: 'أحد مؤسسي كلية الزيتونة ، وهي كلية فنون ليبرالية في بيركلي ، كاليفورنيا.'
    },
    category: { en: 'Hadith Studies', ar: 'الحديث الشريف' }
  },
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
  },
  {
    id: 'scholar-5',
    name: { en: 'Yasmin Mogahed', ar: 'ياسمين مجاهد' },
    socialMedia: [{ platform: 'Instagram', link: 'https://instagram.com/yasminmogahed', icon: 'FaInstagram' }],
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English'],
    avatarUrl: '/avatars/yasmin_mogahed.png',
    bio: {
      en: 'Specializes in spiritual development, psychology, and personal growth.',
      ar: 'متخصص في التنمية الروحية وعلم النفس والنمو الشخصي.'
    },
    category: { en: 'Spirituality & Ethics', ar: 'التزكية والأخلاق' }
  },
  {
    id: 'scholar-6',
    name: { en: 'Mufti Menk', ar: 'مفتي منك' },
    socialMedia: [{ platform: 'YouTube', link: 'https://youtube.com/muftimenk', icon: 'FaYoutube' }],
    country: { en: 'Zimbabwe', ar: 'زيمبابوي' },
    language: ['English'],
    avatarUrl: '/avatars/mufti_menk.png',
    bio: {
      en: 'Global Islamic scholar, preacher, and motivational speaker.',
      ar: 'عالم إسلامي عالمي وداعية ومتحدث تحفيزي.'
    },
    category: { en: 'Da\'wah', ar: 'الدعوة' }
  },
  {
    id: 'scholar-7',
    name: { en: 'Dr. Ingrid Mattson', ar: 'د. إنغريد ماتسون' },
    socialMedia: [{ platform: 'Twitter', link: 'https://twitter.com/ingridmattson', icon: 'FaTwitter' }],
    country: { en: 'Canada', ar: 'كندا' },
    language: ['English'],
    avatarUrl: '/avatars/ingrid_mattson.png',
    bio: {
      en: 'Expert in Islamic studies, interfaith relations, and Muslim women in North America.',
      ar: 'خبيرة في الدراسات الإسلامية والعلاقات بين الأديان والمرأة المسلمة في أمريكا الشمالية.'
    },
    category: { en: 'Interfaith Dialogue', ar: 'الحوار بين الأديان' }
  },
  {
    id: 'scholar-8',
    name: { en: 'Hamza Yusuf', ar: 'حمزة يوسف' },
    socialMedia: [{ platform: 'Facebook', link: 'https://facebook.com/hamzayusuf', icon: 'FaFacebook' }],
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English', 'Arabic'],
    avatarUrl: '/avatars/hamza_yusuf.png',
    bio: {
      en: 'President of Zaytuna College and a leading proponent of classical Islamic learning.',
      ar: 'رئيس كلية الزيتونة ومن أبرز دعاة التعلم الإسلامي الكلاسيكي.'
    },
    category: { en: 'Hadith Studies', ar: 'الحديث الشريف' }
  },
  {
    id: 'scholar-9',
    name: { en: 'Nouman Ali Khan', ar: 'نعمان علي خان' },
    socialMedia: [{ platform: 'YouTube', link: 'https://youtube.com/bayyinah', icon: 'FaYoutube' }],
    country: { en: 'United States', ar: 'الولايات المتحدة' },
    language: ['English', 'Urdu', 'Arabic'],
    avatarUrl: '/avatars/nouman_ali_khan.png',
    bio: {
      en: 'Founder and CEO of Bayyinah Institute, focusing on Arabic and Quranic studies.',
      ar: 'مؤسس ومدير معهد بينة ، مع التركيز على دراسات اللغة العربية والقرآن الكريم.'
    },
    category: { en: 'Quran Studies', ar: 'علوم القرآن' }
  },
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
  },
  {
    id: 'scholar-11',
    name: { en: 'Moaz Elyan', ar: 'معاذ عليان' },
    socialMedia: [{ platform: 'YouTube', link: 'https://www.youtube.com/@moazalian', icon: 'FaYoutube' }],
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/moaz_elyan.png',
    bio: {
      en: 'Egyptian preacher specialized in comparative religion.',
      ar: 'داعية مصري متخصص في مقارنة الأديان.'
    },
    category: { en: 'Comparative Religion', ar: 'مقارنة أديان' }
  },
  {
    id: 'scholar-12',
    name: { en: 'Zain Khairallah', ar: 'زين خير الله' },
    socialMedia: [{ platform: 'YouTube', link: 'https://www.youtube.com/@Zaink-r8q', icon: 'FaYoutube' }],
    country: { en: 'Iraq', ar: 'ليبيا' },
    language: ['Arabic'],
    avatarUrl: '/avatars/zain_khairallah.png',
    bio: {
      en: 'An Islamic preacher specializing in comparative religion and addressing misconceptions about Islam.',
      ar: 'داعية إسلامي ومتخصص في مقارنة الأديان ورد الشبهات.'
    },
    category: { en: 'Comparative Religion', ar: 'مقارنة أديان' }
  },
  {
    id: 'scholar-13',
    name: { en: 'Al-Nour Al-Tariq', ar: 'النور الطارق' },
    socialMedia: [{ platform: 'YouTube', link: 'https://www.youtube.com/channel/UClZCHqcnJW3YAVo63eQOnqw', icon: 'FaYoutube' }],
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/al_nour_al_tariq.jpg',
    bio: {
      en: 'Channel specializing in comparative religion and responding to religious doubts.',
      ar: 'قناة متخصصة في مقارنة الأديان والرد على الشبهات الدينية.'
    },
    category: { en: 'Comparative Religion', ar: 'مقارنة أديان' }
  },
  {
    id: 'scholar-14',
    name: { en: 'Dr. Munqith Al-Saqqar', ar: 'د. منقذ السقار' },
    socialMedia: [
      { platform: 'YouTube', link: 'https://www.youtube.com/@MongizAlsaqqar', icon: 'FaYoutube' },
      { platform: 'Twitter', link: 'https://x.com/MongizAlsaqqar', icon: 'FaTwitter' },
      { platform: 'Facebook', link: 'https://www.facebook.com/MongizAlsaqqar', icon: 'FaFacebook' }
    ],
    country: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    language: ['Arabic'],
    avatarUrl: '/avatars/munqith_al_saqqar.jpg',
    bio: {
      en: 'Specialist in comparative religion, welcomes all serious truth seekers. Personal channel of Dr. Munqith bin Mahmoud Al-Saqqar.',
      ar: 'متخصص في مقارنة الأديان، مرحبا بكل باحث عن الحق بجدية. القناة الشخصية للدكتور منقذ بن محمود السقار.'
    },
    category: { en: 'Comparative Religion', ar: 'مقارنة أديان' }
  },
  {
    id: 'scholar-15',
    name: { en: 'Mahmoud Dawoud', ar: 'محمود داود' },
    socialMedia: [
      { platform: 'YouTube', link: 'https://www.youtube.com/@mdawoud1', icon: 'FaYoutube' },
      { platform: 'Twitter', link: 'https://twitter.com/Mahmoud_Dawoud1', icon: 'FaTwitter' },
      { platform: 'Facebook', link: 'https://facebook.com/Mahmoud1Dawoud', icon: 'FaFacebook' },
      { platform: 'Patreon', link: 'https://www.patreon.com/mdawoud1', icon: 'SiPatreon' }
    ],
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/mahmoud_dawoud.jpg',
    bio: {
      en: 'Educational videos in comparative religion and responding to doubts. Channel manager: Mahmoud Dawoud Mimo, presenter of "Qarar Izala" program on Safa channel.',
      ar: 'فيديوهات تعليمية متنوعة في مجال مقارنة الأديان والرد على الشبهات. مدير القناة: محمود داود ميمو، مقدم برنامج قرار إزالة على قناة صفا.'
    },
    category: { en: 'Comparative Religion', ar: 'مقارنة أديان' }
  },
  {
    id: 'scholar-16',
    name: { en: 'Moawad Alzahabey', ar: 'معوض توفيق الذهبي' },
    socialMedia: [
      { platform: 'Facebook', link: 'https://facebook.com/moawadt', icon: 'FaFacebook' },
      { platform: 'Website', link: 'https://alzahabey.wordpress.com', icon: 'FaGlobe' },
      { platform: 'Website', link: 'https://alzahabey.wordpress.co', icon: 'FaGlobe' },
      { platform: 'YouTube', link: 'https://www.youtube.com/@ALZAHABEY', icon: 'FaYoutube' }
    ],
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/mu3awath.jpg',
    bio: {
      en: 'Islamic advocacy channel to respond to suspicions raised about the great Islam. My mission is to respond to the people of falsehood, demolish their falsehood, and show the truth with evidence and proof.',
      ar: 'قناة إسلامية دعوية للرد على الشبهات المثارة حول الإسلام العظيم. مهمتى هي الرد على أهل البaطل وهدم باطلهم وإظهار الحق بالدليل والبرهان'
    },
    category: { en: 'Comparative Religion', ar: 'مقارنة أديان' }
  },
  {
    id: 'scholar-17',
    name: { en: 'Captain Ahmed – Specialist in Comparative Religion', ar: 'الكابتن أحمد لمقارنة الأديان' },
    socialMedia: [
      { platform: 'TikTok', link: 'https://tiktok.com/@c.ahmed.h', icon: 'FaTiktok' },
      { platform: 'YouTube', link: 'https://www.youtube.com/@C.Ahmed.h', icon: 'FaYoutube' }
    ],
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/kabtain-ahmad.jpg',
    bio: {
      en: 'Say, "O People of the Scripture, come to a word that is equitable between us and you - that we will not worship except Allah and not associate anything with Him and not take one another as lords instead of Allah." But if they turn away, then say, "Bear witness that we are Muslims [submitting to Him]."',
      ar: 'قُلْ يَا أَهْلَ الْكِتَابِ تَعَالَوْا إِلَىٰ كَلِمَةٍ سَوَاءٍ bَيْنَنَا وَبَيْنَكُمْ أَلَّا نَعْبُدَ إِلَّا اللَّهَ وَلَا نُشْرِكَ بِهِ شَيْئًا وَلَا يَتَّخِذَ بَعْضُنَا بَعْضًا أَرْبَابًا مِّن دُونِ اللَّهِ ۚ فَإِن تَوَلَّوْا فَقُولُوا اشْهَدُوا بِأَنَّا مُسْلِمُونَ (64) آل عمران'
    },
    category: { en: 'Comparative Religion', ar: 'مقارنة أديان' }
  },
  {
    id: 'scholar-18',
    name: { en: 'Sharief Almohawir', ar: 'شريف المحاور' },
    socialMedia: [
      { platform: 'Facebook', link: 'https://facebook.com/sherifelmasr', icon: 'FaFacebook' },
      { platform: 'PayPal', link: 'https://paypal.com/paypalme/she642', icon: 'FaPaypal' },
      { platform: 'TikTok', link: 'https://tiktok.com/@sherif_446', icon: 'FaTiktok' },
      { platform: 'Telegram', link: 'https://t.me/SherifAlMo7awir', icon: 'FaTelegram' },
      { platform: 'YouTube', link: 'https://www.youtube.com/@ShariefAlmohawir', icon: 'FaYoutube' }
    ],
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/sharif.jpg',
    bio: {
      en: 'An educational dialogue channel specializing in comparative religion and responding to suspicions raised about the great Islam. It also presents interesting and useful debates and dialogues, including discussions on social issues for Muslims in which its followers contribute with their diverse opinions.',
      ar: 'قناة حوارية تعليمية متخصصة في مقارنة الأديان والرد على الشبهات التي تثار حول إلاسلام العظيم. كما تقدم مناظرات وحوارات شيقة ومفيدة، من ضمنها نقاشات حول الشؤون الإجتماعية الخاصة بالمسلمين والتي يساهم فيها متابعيها الذين يثرونها بآرائهم المتنوعة.'
    },
    category: { en: 'Comparative Religion', ar: 'مقارنة أديان' }
  },
  {
    id: 'scholar-19',
    name: { en: 'Dr. Mahmoud Elmasry', ar: 'د. محمود المصري' },
    socialMedia: [
      { platform: 'YouTube', link: 'https://youtube.com/channel/UCoxabeyx-KBuLth-cFgvwNw', icon: 'FaYoutube' },
      { platform: 'Facebook', link: 'https://facebook.com/100024876780762', icon: 'FaFacebook' },
      { platform: 'Twitter', link: 'https://twitter.com/Drmahmoudelmas3', icon: 'FaTwitter' }
    ],
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/mahmoud-masri.jpg',
    bio: {
      en: 'A moderate educational channel for all people in this universe. A dawah channel far from extremism, aiming to spread pure creed and authentic knowledge from the Quran and Sunnah, with gentle preaching adorned with smiles and mercy. Focuses on building the Muslim person educationally, morally and behaviorally to be a blessing for the entire universe.',
      ar: 'قناة لكل الناس في هذا الكون، قناة دعوية وسطية تربوية بعيدة عن الغلو والتطرف. هدفنا نشر العقيدة الصافية والعلم الصحيح النابع من الكتاب والسُنة، ونشر الموعظة الرقيقة المُزينة بالبسمة والرحمة، والاعتناء ببناء الإنسان المسلم بناءً تربوياً وأخلاقياً وسلوكياً ليكون بركة على الكون كله.'
    },
    category: { en: 'Da\'wah', ar: 'الدعوة' }
  },
  {
    id: 'scholar-20',
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
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/hwaini.jpg',
    bio: {
      en: 'Prominent Egyptian scholar specializing in Hadith sciences and Islamic jurisprudence. Known for his deep knowledge of prophetic traditions and authentic narrations.',
      ar: 'عالم مصري بارز متخصص في علوم الحديث والفقه الإسلامي. معروف بعلمه العميق في الأحاديث النبوية والروايات الصحيحة.'
    },
    category: { en: 'Hadith Studies', ar: 'الحديث الشريف' }
  },
  {
    id: 'scholar-21',
    name: { en: 'Sheikh Muhammad Hussein Yacoub', ar: 'الشيخ محمد حسين يعقوب' },
    socialMedia: [
      { platform: 'Website', link: 'https://yaqob.com', icon: 'FaGlobe' },
      { platform: 'Facebook', link: 'https://facebook.com/YaqobPage', icon: 'FaFacebook' },
      { platform: 'Twitter', link: 'https://twitter.com/MohamedYaqob', icon: 'FaTwitter' },
      { platform: 'SoundCloud', link: 'https://soundcloud.com/yaqob-audio', icon: 'FaSoundcloud' },
      { platform: 'Telegram', link: 'https://telegram.me/alrabania', icon: 'FaTelegram' }
    ],
    country: { en: 'Egypt', ar: 'مصر' },
    language: ['Arabic'],
    avatarUrl: '/avatars/yaqoub.jpg',
    bio: {
      en: 'Prominent Egyptian Islamic preacher and educator known for his spiritual guidance and educational programs. Focuses on purification of the soul, Islamic ethics, and building strong Muslim character.',
      ar: 'داعية إسلامي ومربي مصري بارز معروف بتوجيهاته الروحية وبرامجه التربوية. يركز على تزكية النفس والأخلاق الإسلامية وبناء الشخصية المسلمة القوية.'
    },
    category: { en: 'Da\'wah', ar: 'الدعوة' }
  }
];
