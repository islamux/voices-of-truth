# 📚 Voices of Truth - دليل العلماء والدعاة

![Next.js](https://img.shields.io/badge/Next.js-15+-blue?logo=next.js&style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Web-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/License-GNU%20GPL-red?logo=gnu&style=flat-square)

> **Voices of Truth** is a web app for browsing a directory of renowned scholars and preachers worldwide, supporting Arabic and English, built using Next.js, React, and Tailwind CSS.  
> Built with ❤️ by [islamux](mailto:fathi733@gmail.coom)

---

## 🚀 Features

- 🎨 Beautiful, user-friendly interface
- 🌙 Dark & Light mode support via a custom, hook-based theme provider
- 🌍 Internationalization with instant language switching (Arabic RTL & English LTR)
- 📱 Fully responsive for all devices
- 🔍 Server-side filtering by category, country, and language
- 🔍 Search scholars by name
- ✨ Smooth animations with Framer Motion
- 📝 Local (mock) data source for fast demo/development

---

## 📚 Documentation & Learning Hub

All project documentation, tutorials, and guides are located in the `docs` directory. For a structured learning path, from setting up the project to understanding its core architecture, please start here:

**[➡️ Go to the Documentation Hub](./docs/README.md)**

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

*   **`pnpm dev`**: Runs the development server. Open [http://localhost:3000/en](http://localhost:3000/en) or [http://localhost:3000/ar](http://localhost:3000/ar) in your browser.
*   **`pnpm build`**: Builds the application for production.
*   **`pnpm start`**: Starts the production server.
*   **`pnpm lint`**: Runs ESLint to check for code quality issues.


---

## 📂 File Structure

```
vocies-of-truth/
├── docs/                     # All project documentation and guides
│   ├── 01_BUILD_FROM_SCRATCH.md
│   └── ...
├── public/
│   ├── avatars/              # Scholar avatar images
│   └── locales/              # Translation files (i18next)
├── src/
│   ├── app/
│   │   ├── [locale]/           # Dynamic routes for language
│   │   │   ├── HomePageClient.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx      # Server Component for data filtering
│   │   ├── globals.css
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── filters/            # Individual filter components
│   │   ├── FilterBar.tsx
│   │   ├── PageLayout.tsx
│   │   ├── ScholarCard.tsx
│   │   └── ...
│   ├── data/
│   │   └── scholars.ts
│   ├── lib/
│   │   └── i18n.ts
│   ├── middleware.ts
│   └── types/
│       └── index.ts
├── package.json
└── ...
```

---

## 🧠 How It Works

- **Server-Centric Architecture**: Leverages Next.js 15 Server Components for data fetching and filtering (`src/app/[locale]/page.tsx`), ensuring a fast initial load and optimal performance.
- **Client-Side Interactivity**: Uses Client Components (`'use client'`) for interactive UI elements like filters and theme switching.
- **URL as State**: The URL query parameters are the single source of truth for the filter state, enabling shareable and bookmarkable links.
- **Internationalization**: Powered by `react-i18next` with language detection middleware and local JSON translation files.
- **Styling**: Styled with Tailwind CSS, using a custom hook-based provider for light and dark themes.

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