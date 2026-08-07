# AGENTS.md - Voices of Truth Development Guide

## Project

Next.js 16.2.9 web application for browsing a directory of Islamic scholars and preachers worldwide. Supports Arabic/English i18n (react-i18next), dark/light themes (custom hook-based provider), and server-side filtering via URL query params.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server with Turbopack on :3000 |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | ESLint (next/core-web-vitals) |

## Code Rules

**Package Manager:** `pnpm` only. Never `npm` or `yarn`.

**Types:** All shared types in `src/types/index.ts`. Interfaces over type aliases.

```typescript
export interface Scholar {
  id: number;
  name: Record<string, string>;
  socialMedia: { platform: string; link: string; icon?: string }[];
  countryId: number;
  categoryId: number;
  language: string[];
  avatarUrl: string;
  bio?: Record<string, string>;
}
```

**Components:** PascalCase files/exports. Default export for pages and UI. Client components start with `"use client"`. Props interface = `ComponentNameProps`.

**Imports:** external libs → `@/` → relative.

```typescript
import { motion } from 'framer-motion';
import { Scholar } from '@/types';
import ScholarCard from './ScholarCard';
```

**Styling:** Tailwind v4 via the `@theme` directive in `src/app/globals.css` (CSS-based config; no `tailwind.config.ts`). OKLCH token palette — tinted ink neutrals plus a single amber accent — with un-collapsed dark-mode tokens. `dark:` variants. `twMerge` for class merging. Class order: layout → spacing → typography → colors → effects.

**i18n:** `react-i18next` with `useTranslation('namespace')`. Translation JSON in `public/locales/{locale}/{namespace}.json`. Supported: `en` (default), `ar` (RTL).

**Server/Client split:**
- Server (`page.tsx`): Data fetching, server-side filtering, validation
- Client (`HomePageClient.tsx`): Interactivity, URL state via `useSearchParams`
- `FilterContext` for sharing filter state without prop drilling

**Theme:** Custom `ThemeProvider` in `src/lib/theme.tsx` (not next-themes). `useTheme()` hook. `localStorage` persistence with system preference detection. Inline `<script>` in root layout to prevent FOUC.

**Error handling:** `console.error` with context, return `null` for graceful degradation.

**Animations:** `framer-motion` for card entrance animations (staggered), with `useReducedMotion` guards.

**Typography:** `next/font/google` in `src/app/layout.tsx` — Space Grotesk + IBM Plex Sans (Latin), Amiri + Markazi Text (Arabic). The `:lang(ar)` rule in `globals.css` swaps the Arabic families and resets negative tracking for naskh correctness.

**Data:** Scholars split by category in `src/data/scholars/*.ts`, combined in `src/data/scholars.ts`. Countries and specializations in separate files.

## Key Files

| Path | Purpose |
|------|---------|
| `src/app/[locale]/page.tsx` | Server: filtering, Arabic search, pagination |
| `src/app/[locale]/HomePageClient.tsx` | Client: search params, FilterProvider, hero |
| `src/app/[locale]/layout.tsx` | Locale layout: ThemeProvider + I18nProviderClient + ErrorBoundary |
| `src/app/[locale]/not-found.tsx` | Custom 404 page (i18n) |
| `src/app/[locale]/loading.tsx` | Route loading skeleton |
| `src/app/[locale]/error.tsx` | Route error UI (i18n) |
| `src/app/layout.tsx` | Root layout: theme script, `html lang/dir` (from `x-locale` header), `next/font` |
| `src/app/globals.css` | Tailwind v4 `@theme`, OKLCH tokens, dark mode, type scale |
| `src/app/sitemap.ts` | Dynamic sitemap (env-aware base) |
| `src/app/robots.ts` | Robots rules + sitemap reference |
| `src/app/icon.svg` / `manifest.ts` | Favicon + web manifest |
| `src/proxy.ts` | Middleware: locale redirect + `x-locale` header |
| `src/components/FilterBar.tsx` | Filter bar composition (search + selects + reset) |
| `src/components/ScholarCard.tsx` | Scholar card |
| `src/components/ScholarList.tsx` | Grid with staggered motion + reduced-motion guard |
| `src/components/Pagination.tsx` | Page navigation (12 per page, windowed) |
| `src/components/ErrorBoundary.tsx` | Class-based error boundary |
| `src/components/Header.tsx` / `Footer.tsx` / `PageLayout.tsx` | App shell (skip-link, sticky header) |
| `src/components/Logo.tsx` / `WaveformMark.tsx` | Brand mark + wordmark |
| `src/components/Button.tsx` | Reusable button (variants/sizes) |
| `src/components/filters/` | Search input + filter dropdowns |
| `src/context/FilterContext.tsx` | Filter state context + `useFilters` hook |
| `src/lib/theme.tsx` | Custom theme provider |
| `src/lib/i18n.ts` | i18next server config |
| `src/lib/search.ts` | Arabic normalization (diacritics, alef/yaa/ta-marbuta) |
| `src/types/index.ts` | TypeScript types |

## GitHub Flow

| Step | Command(s) |
|------|-----------|
| 1. Add, commit, push | `git add -A && git commit -m "<message>" && git push` |
| 2. Create and merge PR | `gh pr create --fill && gh pr merge --squash --auto && gh pr merge --squash` |
| 3. Update main locally | `git checkout main && git pull` |

## ESLint

Flat config (`eslint.config.mjs`) extending `next/core-web-vitals`. Run `pnpm lint` to check; TypeScript is checked by `pnpm build`.
