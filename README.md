# Voices of Truth - دليل العلماء والدعاة

> A directory of renowned Islamic scholars and preachers worldwide, with bilingual Arabic/English support.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-GNU%20GPL-red)](LICENSE)

## Features

- Server-side filtering by country, specialization, language, and name search
- Arabic (RTL) and English (LTR) internationalization via react-i18next
- "Contemporary Voices" design system: OKLCH tokens, custom waveform brand mark, favicon + web manifest
- Bilingual typography via `next/font` — Space Grotesk + IBM Plex (Latin), Amiri + Markazi Text (Arabic)
- Dark/light theme with custom `ThemeProvider` (no flicker, localStorage persistence)
- Responsive grid with staggered Framer Motion animations (`prefers-reduced-motion` aware)
- URL query params as the single source of truth for filter state (filters reset pagination)
- FilterContext for clean state management without prop drilling

## Prerequisites

- Node.js 20.9+
- pnpm

```bash
node --version  # Should be 20.9+
pnpm --version  # Should be 11+
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

## Project Structure

```
voices-of-truth/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Dynamic locale routes
│   │   │   ├── layout.tsx      # Locale layout (ThemeProvider + i18n)
│   │   │   ├── page.tsx        # Server: data fetching, filtering, pagination
│   │   │   ├── HomePageClient.tsx  # Client: search params, filters
│   │   │   ├── loading.tsx     # Route loading skeleton
│   │   │   ├── error.tsx       # Route error UI (i18n)
│   │   │   └── not-found.tsx   # Custom 404 page (i18n)
│   │   ├── layout.tsx          # Root layout: theme script, lang/dir, next/font
│   │   ├── globals.css         # Tailwind v4 @theme + OKLCH tokens
│   │   ├── sitemap.ts          # Dynamic sitemap (env-aware base)
│   │   ├── robots.ts           # Robots rules + sitemap reference
│   │   ├── icon.svg            # Favicon (waveform mark)
│   │   └── manifest.ts         # Web manifest
│   ├── components/
│   │   ├── filters/            # Individual filter components
│   │   ├── FilterBar.tsx       # Filter composition (search + selects + reset)
│   │   ├── ScholarCard.tsx     # Scholar display card
│   │   ├── ScholarList.tsx     # Scholar grid (staggered motion)
│   │   ├── Header.tsx          # App header (sticky, RTL-aware)
│   │   ├── Footer.tsx          # App footer
│   │   ├── PageLayout.tsx      # Layout wrapper (skip-link)
│   │   ├── Pagination.tsx      # Windowed page navigation
│   │   ├── ErrorBoundary.tsx   # Class-based error boundary
│   │   ├── Logo.tsx            # Wordmark + waveform brand mark
│   │   ├── WaveformMark.tsx    # Voice/waveform SVG mark
│   │   ├── ThemeToggle.tsx     # Dark/light toggle (icon)
│   │   ├── LanguageSwitcher.tsx # EN/AR switcher
│   │   ├── Button.tsx          # Reusable button (variants/sizes)
│   │   └── I18nProviderClient.tsx # Client i18n instance
│   ├── context/FilterContext.tsx   # Filter state context
│   ├── proxy.ts                # Middleware: locale redirect + x-locale header
│   ├── data/
│   │   ├── scholars.ts         # Combined scholar list
│   │   ├── scholars/           # 11 categories, each in own file
│   │   ├── countries.ts        # Country data (10 countries)
│   │   └── specializations.ts  # 11 specialization categories
│   ├── hooks/
│   │   ├── useHasMounted.ts    # Hydration mismatch guard (useSyncExternalStore)
│   │   └── useLocalizedScholar.ts # Localized name/bio resolver
│   ├── lib/
│   │   ├── i18n.ts             # i18next server config
│   │   ├── search.ts           # Arabic diacritics normalization
│   │   └── theme.tsx           # Custom ThemeProvider + useTheme
│   └── types/index.ts          # Scholar, Country, Specialization
├── public/
│   ├── avatars/                # Scholar avatar images
│   └── locales/{en,ar}/       # Translation JSON files
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
