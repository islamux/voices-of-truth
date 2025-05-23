# 📚 Voices of Truth - دليل العلماء والدعاة

**Voices of Truth** هو تطبيق ويب مبني باستخدام Next.js و Tailwind CSS، يهدف إلى عرض دليل منظم للعلماء والدعاة حول العالم، مع معلومات مختصرة عن كل داعية تشمل الاسم، الدولة، اللغة، ومنصة التواصل الاجتماعي الخاصة به.

---

## 🚀 الميزات الرئيسية

- 🎨 واجهة استخدام جذابة وسهلة الاستخدام
- 📍 عرض معلومات مختصرة ومنظمة عن كل داعية
- 📁 استخدام بيانات محلية (JSON أو JavaScript module)
- 🌐 دعم التصفية والبحث حسب اللغة أو الدولة
- 🌙 دعم الوضع الليلي والنهاري
- 📱 تصميم متجاوب بالكامل (Responsive)
- 🔤 دعم RTL للغة العربية واللغة الإنجليزية

---

## 🛠️ التقنيات المستخدمة

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (للمؤثرات البصرية)
- Local JSON/JS data as mock backend

---

## 📂 بنية المشروع

```bash
voices-of-truth/
├── public/
├── components/
│   ├── ScholarCard.tsx
│   ├── FilterBar.tsx
│   └── Layout.tsx
├── pages/
│   ├── index.tsx
├── data/
│   └── scholars.ts
├── styles/
│   └── globals.css
├── tailwind.config.js
└── README.md

