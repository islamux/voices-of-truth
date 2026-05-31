# Voices of Truth - دليل العلماء والدعاة

> A directory of renowned Islamic scholars and preachers worldwide, with bilingual Arabic/English support.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-GNU%20GPL-red)](LICENSE)

## Features

- Server-side filtering by country, specialization, language, and name search
- Arabic (RTL) and English (LTR) internationalization via react-i18next
- Dark/light theme with custom `ThemeProvider` (no flicker, localStorage persistence)
- Responsive grid layout with Framer Motion card animations
- URL query params as the single source of truth for filter state
- FilterContext for clean state management without prop drilling

## Prerequisites

- Node.js 18+
- pnpm

```bash
node --version  # Should be 18+
pnpm --version  # Should be 8+
```

## Quick Start

```bash
pnpm install
pnpm dev
# Open http://localhost:3000/en or http://localhost:3000/ar
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | Run ESLint |
| `pnpm cc:status` | Command center status |
| `pnpm cc:start <id>` | Start tracked task |
| `pnpm cc:complete <id>` | Complete tracked task |

## Project Structure

```
voices-of-truth/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Dynamic locale routes
│   │   │   ├── layout.tsx      # Locale layout (ThemeProvider + i18n)
│   │   │   ├── page.tsx        # Server: data fetching & filtering
│   │   │   └── HomePageClient.tsx  # Client: search params, filters
│   │   ├── layout.tsx          # Root layout (theme script, lang/dir)
│   │   └── globals.css         # Tailwind + shadcn-style CSS vars
│   ├── components/
│   │   ├── filters/            # Individual filter components
│   │   ├── FilterBar.tsx       # Filter composition
│   │   ├── ScholarCard.tsx     # Scholar display card
│   │   ├── ScholarList.tsx     # Scholar grid
│   │   ├── Header.tsx          # App header
│   │   ├── Footer.tsx          # App footer
│   │   ├── PageLayout.tsx      # Layout wrapper
│   │   ├── ThemeToggle.tsx     # Dark/light toggle
│   │   ├── LanguageSwitcher.tsx # EN/AR switcher
│   │   ├── Button.tsx          # Reusable button (twMerge)
│   │   └── I18nProviderClient.tsx # Client i18n instance
│   ├── context/FilterContext.tsx   # Filter state context
│   ├── data/
│   │   ├── scholars.ts         # Combined scholar list
│   │   ├── scholars/           # 11 categories, each in own file
│   │   ├── countries.ts        # Country data (10 countries)
│   │   └── specializations.ts  # 11 specialization categories
│   ├── hooks/
│   │   ├── useHasMounted.ts    # Hydration mismatch guard
│   │   └── useLocalizedScholar.ts # Localized name/bio resolver
│   ├── lib/
│   │   ├── i18n.ts             # i18next server config
│   │   └── theme.tsx           # Custom ThemeProvider + useTheme
│   └── types/index.ts          # Scholar, Country, Specialization
├── public/
│   ├── avatars/                # Scholar avatar images
│   └── locales/{en,ar}/       # Translation JSON files
├── command-center/             # Task tracking, MCP, TUI
└── docs/                       # Documentation
```

## Architecture

- **Server-Centric Filtering**: `page.tsx` receives `searchParams`, validates against known data, filters scholars server-side, passes results to client.
- **URL as State**: Filter values (query, country, lang, category) live in URL search params. `HomePageClient` reads/writes via `useSearchParams` + `router.replace`.
- **FilterContext**: Provides `currentFilters`, `onCountryChange`, etc. to all filter components without prop drilling.
- **Custom Theme**: `ThemeProvider` with `useTheme()` hook, localStorage persistence, system preference detection, and inline script in root layout for flash-free theme application.
- **i18n**: Server-side `getTranslation()` creates i18next instances per request. Client-side `I18nProviderClient` hydrates with preloaded resources.

## License

GNU GPL. See [LICENSE](LICENSE).

## Author

**Fathi Al-Qadasi (islamux)** - [GitHub](https://github.com/islamux)
