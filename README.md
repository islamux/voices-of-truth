# 📚 Voices of Truth - دليل العلماء والدعاة

**Voices of Truth** هو تطبيق ويب مبني باستخدام Next.js و Tailwind CSS، يهدف إلى عرض دليل منظم للعلماء والدعاة حول العالم، مع معلومات مختصرة عن كل داعية تشمل الاسم، الدولة، اللغة، ومنصة التواصل الاجتماعي الخاصة به.

---

## 🚀 الميزات الرئيسية (Key Features)

- 🎨 واجهة استخدام جذابة وسهلة الاستخدام (Attractive and user-friendly UI)
- 🌙 دعم الوضع الليلي والنهاري (Dark/Light mode support)
- 📱 تصميم متجاوب بالكامل (Fully Responsive Design)
- 🔤 دعم RTL للغة العربية واللغة الإنجليزية (RTL support for Arabic, LTR for English)
- 🌍 تدويل باستخدام `react-i18next` مع القدرة على التبديل بين اللغتين (Internationalization with `react-i18next` and language switching)
- 📍 عرض معلومات مختصرة ومنظمة عن كل داعية (Organized and concise scholar information)
- 🔍 تصفية العلماء حسب الدولة واللغة (Filter scholars by country and language)
- ✨ مؤثرات بصرية وحركية باستخدام `Framer Motion` (Animations with `Framer Motion`)
- 🖼️ استخدام أيقونات من `react-icons` (Icons from `react-icons`)
- 📝 استخدام بيانات محلية (JS module) كمصدر للبيانات (Uses local data (JS module) as data source)

---

## 🛠️ التقنيات المستخدمة (Technologies Used)

- [Next.js](https://nextjs.org/) (v15.1.8 or similar)
- [React](https://reactjs.org/) (v19 or similar)
- [Tailwind CSS](https://tailwindcss.com/) (v3.4.17 or similar)
- [Framer Motion](https://www.framer.com/motion/) (v12.12.1 or similar)
- [i18next](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)
- [i18next-http-backend](https://github.com/i18next/i18next-http-backend)
- [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector)
- [React Icons](https://react-icons.github.io/react-icons/) (v5.5.0 or similar)
- TypeScript

---

## 📂 بنية المشروع (Project Structure)

```
voices-of-truth/
├── public/
│   ├── avatars/
│   │   └── default-avatar.png
│   ├── locales/
│   │   ├── ar/
│   │   │   └── common.json
│   │   └── en/
│   │       └── common.json
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   └── [lang]/               # Dynamic routes for language
│   │       ├── favicon.ico
│   │       ├── globals.css
│   │       ├── layout.tsx        # Root layout for each language
│   │       └── page.tsx          # Main page for scholar directory
│   ├── components/
│   │   ├── FilterBar.tsx         # Component for filtering scholars
│   │   ├── I18nProviderClient.tsx # Client-side i18n provider
│   │   ├── Layout.tsx            # Main layout component (header, footer, theme/lang switch)
│   │   └── ScholarCard.tsx       # Component to display individual scholar info
│   ├── data/
│   │   └── scholars.ts           # Sample data for scholars
│   ├── lib/
│   │   └── i18n.ts               # i18next configuration
│   └── types/
│       └── index.ts              # TypeScript type definitions (e.g., Scholar interface)
├── .eslintrc.json
├── next-i18next.config.js        # Configuration for next-i18next (used for i18n routing)
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

## 🚀 تشغيل المشروع (Running the Project)

1.  **تثبيت الاعتماديات (Install Dependencies):**
    ```bash
    npm install
    ```
    *ملاحظة: قد تواجه بعض المشاكل في تثبيت اعتماديات التدويل (`i18next` وملحقاته) بسبب قيود في بيئة التنفيذ. الكود الخاص بالتدويل موجود وجاهز.*
    *(Note: You might encounter issues installing internationalization dependencies (`i18next` and related packages) due to limitations in some execution environments. The internationalization code itself is in place.)*

2.  **تشغيل خادم التطوير (Run Development Server):**
    ```bash
    npm run dev
    ```

3.  افتح [http://localhost:3000/en](http://localhost:3000/en) أو [http://localhost:3000/ar](http://localhost:3000/ar) في متصفحك.
    (Open [http://localhost:3000/en](http://localhost:3000/en) or [http://localhost:3000/ar](http://localhost:3000/ar) in your browser.)

---

## 📝 ملاحظات إضافية (Additional Notes)

-   تم استخدام بيانات وهمية للعلماء (`src/data/scholars.ts`) لأغراض العرض.
    (Mock data for scholars (`src/data/scholars.ts`) is used for demonstration purposes.)
-   تم تضمين صور رمزية افتراضية. يمكنك استبدالها بصور حقيقية في `public/avatars/`.
    (Default avatar images are included. You can replace them with actual images in `public/avatars/`.)

```
