# 📚 Voices of Truth - دليل العلماء والدعاة

![Next.js](https://img.shields.io/badge/Next.js-14.x-blue?logo=next.js&style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Web-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/License-GNU%20GPL-red?logo=gnu&style=flat-square)

> **Voices of Truth** is a web app for browsing a directory of renowned scholars and preachers worldwide, supporting Arabic and English, built using Next.js, React, and Tailwind CSS.  
> Built with ❤️ by [islamux](mailto:fathi733@gmail.coom)

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
- pnpm (preferred package manager)

If you don't have pnpm installed, you can install it globally:
```bash
npm install -g pnpm
```

---

## 🧪 How to Use

First, clone the repository and navigate into the project directory:

```bash
git clone https://github.com/islamux/voices-of-truth.git
cd voices-of-truth
```

Then, install the dependencies using pnpm:

```bash
pnpm install
```

Finally, you can run the following scripts:

*   **`pnpm dev`**: Runs the development server with Turbopack. Open [http://localhost:3000/en](http://localhost:3000/en) or [http://localhost:3000/ar](http://localhost:3000/ar) in your browser.
*   **`pnpm build`**: Builds the application for production.
*   **`pnpm start`**: Starts the production server.
*   **`pnpm lint`**: Runs ESLint to check for code quality issues.


---

## 📂 File Structure

```
vocies-of-truth/
├── public/
│   ├── avatars/
│   └── locales/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── HomePageClient.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── ...
│   ├── components/
│   │   ├── filters/
│   │   │   └── ...
│   │   ├── FilterBar.tsx
│   │   ├── Layout.tsx
│   │   ├── ScholarCard.tsx
│   │   └── ... (and other sub-components)
│   ├── data/
│   │   └── scholars.ts
│   ├── lib/
│   │   └── i18n.ts
│   ├── middleware.ts
│   └── types/
│       └── index.ts
├── docs/
│   └── ...
├── package.json
└── ...
```

---

## 🧠 How It Works

- Separates concerns between logic (server-side filtering) and presentation (components).
- Internationalization is powered by `react-i18next` with language detection and local translation files.
- Scholars are listed and filtered server-side, with dynamic language and theme switching.
- Fully responsive and visually enhanced with Tailwind CSS and Framer Motion.

---

## 📚 Detailed Guides

- [How to Add Translation Feature to a Next.js Project](./docs/04_FEATURE_TRANSLATION.md)
- [How to Integrate Tailwind CSS and PostCSS in a Next.js Project](./docs/03_STYLING_GUIDE.md)
- [How to Implement Light/Dark Theme in Next.js with Tailwind CSS](./docs/03_STYLING_GUIDE.md)

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
