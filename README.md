# 📚 Voices of Truth - دليل العلماء والدعاة

![Next.js](https://img.shields.io/badge/Next.js-15.x-blue?logo=next.js&style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Web-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/License-GNU%20GPL-red?logo=gnu&style=flat-square)

> **Voices of Truth** is a web app for browsing a directory of renowned scholars and preachers worldwide, supporting Arabic and English, built using Next.js, React, and Tailwind CSS.  
> Built with ❤️ by [@islamux](https://github.com/islamux)

---

## 🚀 Features

- 🎨 Beautiful, user-friendly interface
- 🌙 Dark & Light mode support
- 🌍 Internationalization with instant language switching (Arabic RTL & English LTR)
- 📱 Fully responsive for all devices
- 🔍 Filter scholars by country and language
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
- npm or yarn

Install dependencies:

```bash
npm install
```

---

## 🧪 How to Use

```bash
git clone https://github.com/islamux/voices-of-truth.git
cd voices-of-truth

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) or [http://localhost:3000/ar](http://localhost:3000/ar) in your browser.

---

## 📂 File Structure

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
│   └── ... (SVG icons)
├── src/
│   ├── app/
│   │   └── [lang]/
│   │       ├── favicon.ico
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── components/
│   │   ├── FilterBar.tsx
│   │   ├── I18nProviderClient.tsx
│   │   ├── Layout.tsx
│   │   └── ScholarCard.tsx
│   ├── data/
│   │   └── scholars.ts
│   ├── lib/
│   │   └── i18n.ts
│   └── types/
│       └── index.ts
├── package.json
├── next.config.ts
├── README.md
└── ...
```

---

## 🧠 How It Works

- Uses local TypeScript data module (`src/data/scholars.ts`) to provide scholar info.
- Internationalization is powered by `react-i18next` with language detection and local translation files.
- Scholars are listed and filtered client-side, with dynamic language and theme switching.
- Fully responsive and visually enhanced with Tailwind CSS and Framer Motion.

---

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to use and modify.  
Read more: [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

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
