# 📚 Voices of Truth - دليل العلماء والدعاة

![Next.js](https://img.shields.io/badge/Next.js-15.x-blue?logo=next.js&style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Web-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/License-GNU%20GPL-red?logo=gnu&style=flat-square)

> **Voices of Truth** is a web app for browsing a directory of renowned scholars and preachers worldwide, supporting Arabic and English, built using Next.js, React, and Tailwind CSS.  
> Built with ❤️ by [fathi733@gmail.com](mailto:fathi733@gmail.com)

---

## 🚀 Features

- 🎨 Beautiful, user-friendly interface
- 🌙 Dark & Light mode support
- 🌍 Internationalization with instant language switching (Arabic RTL & English LTR)
- 📱 Fully responsive for all devices
- 🔍 Filter scholars by country and language
- 🔍 Search scholars by name
- ✨ Smooth animations with Framer Motion
- 🖼️ Iconography with react-icons
- 📝 Local (mock) data source for fast demo/development

---

## 📷 Preview

<!-- You can add a screenshot here if available
![App Preview](public/preview.png)
-->

---

## 📦 Requirements

- Node.js 18+
- pnpm

Install dependencies:

```bash
pnpm install
```

---

## 🧪 How to Use

```bash
git clone https://github.com/islamux/voices-of-truth.git
cd voices-of-truth

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) or [http://localhost:3000/ar](http://localhost:3000/ar) in your browser.

---

## 📂 File Structure

```
voices-of-truth/
├── public/
│   ├── avatars/
│   └── locales/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── HomePageClient.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── hooks/
│   │       └── useScholars.ts
│   ├── components/
│   │   ├── FilterBar.tsx
│   │   ├── Layout.tsx
│   │   ├── ScholarCard.tsx
│   │   └── ... (and other sub-components)
│   ├── data/
│   │   └── scholars.ts
│   ├── lib/
│   │   └── i18n.ts
│   └── types/
│       └── index.ts
├── package.json
├── TUTORIAL.md
└── ...
```

---

## 🧠 How It Works

- Uses a custom React Hook (`useScholars`) to manage all filtering logic and state.
- Separates concerns between logic (hooks) and presentation (components).
- Internationalization is powered by `react-i18next` with language detection and local translation files.
- Scholars are listed and filtered client-side, with dynamic language and theme switching.
- Fully responsive and visually enhanced with Tailwind CSS and Framer Motion.

---

## 📚 Detailed Guides

- [How to Add Translation Feature to a Next.js Project](./TRANSLATION_TUTORIAL.md)
- [How to Integrate Tailwind CSS and PostCSS in a Next.js Project](./TAILWIND_POSTCSS_TUTORIAL.md)
- [How to Implement Light/Dark Theme in Next.js with Tailwind CSS](./LIGHT_DARK_THEME_TUTORIAL.md)

---

## 📜 License

This project is licensed under the **GNU GPL**.  
Feel free to use and modify.  
Read more: [https://www.gnu.org/licenses/gpl-3.0.en.html](https://www.gnu.org/licenses/gpl-3.0.en.html)

---

## ✨ Author

**[@islamux](https://github.com/islamux)**  
💻 Muslim Developer • Linux Terminal Lover • Open Source Enthusiast  
🕊️ "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ" – الأنبياء 107  
*Using technology to spread peace and benefit all of humanity.*

---

## ☁️ Future Ideas

- Add a backend for real data and scholar profiles
- User authentication for contributing new scholars
- Integration with map providers to show scholar locations
- Advanced filters and search
- Add scholar audio/video lectures
