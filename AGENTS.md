# AGENTS.md - Voices of Truth Development Guide

## Project

Next.js 16.2.9 web application for browsing a directory of Islamic scholars and preachers worldwide. Supports Arabic/English i18n (react-i18next), dark/light themes (custom hook-based provider), and server-side filtering via URL query params.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server with Turbopack on :3000 |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | ESLint (next/core-web-vitals, next/typescript) |

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

**Styling:** Tailwind CSS with CSS variable theme (shadcn-style palette). `dark:` variants. `twMerge` for class merging. Class order: layout → spacing → typography → colors → effects.

**i18n:** `react-i18next` with `useTranslation('namespace')`. Translation JSON in `public/locales/{locale}/{namespace}.json`. Supported: `en` (default), `ar` (RTL).

**Server/Client split:**
- Server (`page.tsx`): Data fetching, server-side filtering, validation
- Client (`HomePageClient.tsx`): Interactivity, URL state via `useSearchParams`
- `FilterContext` for sharing filter state without prop drilling

**Theme:** Custom `ThemeProvider` in `src/lib/theme.tsx` (not next-themes). `useTheme()` hook. `localStorage` persistence with system preference detection. Inline `<script>` in root layout to prevent FOUC.

**Error handling:** `console.error` with context, return `null` for graceful degradation.

**Animations:** `framer-motion` for card entrance animations.

**Data:** Scholars split by category in `src/data/scholars/*.ts`, combined in `src/data/scholars.ts`. Countries and specializations in separate files.

## Key Files

| Path | Purpose |
|------|---------|
| `src/app/[locale]/page.tsx` | Server component: filtering & data prep |
| `src/app/[locale]/HomePageClient.tsx` | Client: search params, FilterProvider |
| `src/app/[locale]/layout.tsx` | Locale layout: ThemeProvider + I18nProviderClient |
| `src/app/layout.tsx` | Root layout: theme script, html dir/lang |
| `src/components/FilterBar.tsx` | Filter bar composition |
| `src/components/ScholarCard.tsx` | Scholar card with motion |
| `src/components/filters/` | Individual filter components |
| `src/context/FilterContext.tsx` | Filter state context + `useFilters` hook |
| `src/lib/theme.tsx` | Custom theme provider |
| `src/lib/i18n.ts` | i18next server config |
| `src/types/index.ts` | TypeScript types |

## GitHub Flow

| Step | Command(s) |
|------|-----------|
| 1. Add, commit, push | `git add -A && git commit -m "<message>" && git push` |
| 2. Create and merge PR | `gh pr create --fill && gh pr merge --squash --auto && gh pr merge --squash` |
| 3. Update main locally | `git checkout main && git pull` |

## ESLint

Flat config (`eslint.config.mjs`) extending `next/core-web-vitals` and `next/typescript`. Run `pnpm lint` to check.
