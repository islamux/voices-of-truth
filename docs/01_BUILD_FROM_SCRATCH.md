# Tutorial: Rebuilding "Voices of Truth" From Scratch

> STATUS: Implemented (This guide reflects the CURRENT code state)  
> GOAL: Help you (junior dev) rebuild the project step by step while understanding WHY each part exists.

---
## 0. Prerequisites
Install / verify:
- Node.js: 20.x LTS (recommend using nvm)
- pnpm: `npm i -g pnpm`
- Git initialized

Check versions:
```bash
node -v
pnpm -v
```
If you mismatch major versions, fix before continuing to avoid subtle build issues.

---
## 1. Create the Base Next.js App
Use the official starter with TypeScript, Tailwind, ESLint, App Router, and `src/`.
```bash
pnpm create next-app voices-of-truth \
  --typescript --eslint --tailwind --app --src-dir --use-pnpm
cd voices-of-truth
```
This gives you: Next.js 15.x, React 19, Tailwind + PostCSS, ready for extension.

---
## 2. Add Project Dependencies
Install the additional runtime libs actually used in the project.
```bash
pnpm add i18next react-i18next i18next-resources-to-backend framer-motion react-icons
```
(Everything else comes from the scaffold.)

Optional (later): SWR (only if you implement API fetching path).

---
## 3. Establish Directory Structure
Target structure (matches current repo):
```
/
├── public/
│   ├── avatars/          # Scholar images (or placeholders)
│   └── locales/          # i18n JSON files (en/common.json, ar/common.json)
├── src/
│   ├── app/
│   │   ├── [locale]/     # Locale-scoped routing segment
│   │   │   ├── page.tsx  # Server Component (filter + data slice)
│   │   │   └── layout.tsx
│   ├── components/       # UI + client pieces
│   ├── data/             # Static domain data (scholars, countries, specializations)
│   ├── lib/              # i18n init and helpers
│   └── types/            # TypeScript interfaces
├── middleware.ts         # Locale detection
├── tailwind.config.ts
└── postcss.config.mjs
```
Keep files small and singular in responsibility.

---
## 4. Define Domain Types First
Create `src/types/index.ts`:
```ts
export interface Country {
  id: number;
  name: Record<string, string>;
}

export interface Specialization {
  id: number;
  name: Record<string, string>;
}

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
Reasoning:
- `Record<string,string>` keeps multilingual fields simple.
- IDs (number) allow fast lookups and normalization.

---
## 5. Add Static Data
Example `src/data/countries.ts` (simplified):
```ts
import { Country } from '@/types';
export const countries: Country[] = [
  { id: 1, name: { en: 'Egypt', ar: 'مصر' } },
  { id: 2, name: { en: 'Morocco', ar: 'المغرب' } },
];
```
Similarly create `specializations.ts` and category-based scholar files. Then aggregate scholars:
```ts
// src/data/scholars.ts
import { Scholar } from '@/types';
export const scholars: Scholar[] = [ /* ... */ ];
```
Keep data flat; derive UI lists from code (not duplicated arrays).

---
## 6. Internationalization Setup
1. Translation resources go under `public/locales/{lng}/common.json`.
2. Add i18n initializer: `src/lib/i18n.ts` (already in repo). It uses dynamic imports + `fallbackNS`.
3. Add middleware for locale detection (`middleware.ts`) using `Accept-Language` header.
4. In `[locale]/layout.tsx` call `getTranslation(locale)` and wrap children with `I18nProviderClient` + `ThemeProvider`.

Key points:
- Only fetch translations once per request on the server.
- Pass hydrated resources to client to avoid duplicate loading.
- Advanced topics (namespaces, pluralization, performance, additional locales, RTL enhancements) → see `docs/I18N_ADVANCED.md`

---
## 7. Theming (Dark / Light)
Theme is handled by `ThemeProvider` + CSS variables + Tailwind `dark` class. Keep design tokens in one place (CSS variables) to avoid scattering color values. This keeps future re-theming low cost.

---
## 8. Core Page (Server Component)
`src/app/[locale]/page.tsx` responsibilities:
- Read `searchParams` (filters: `query`, `country`, `lang`, `category`).
- Filter the in-memory `scholars` list.
- Derive unique dropdown option arrays.
- Pass minimal filtered slice + option lists to the client component.

Simplified example:
```tsx
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import HomePageClient from './HomePageClient';

export default function HomePage({ searchParams }: { searchParams: any }) {
  const { query = '', country, lang, category } = searchParams; // (sync access is fine here)
  const q = query.toLowerCase();

  const filteredScholars = scholars.filter(s => {
    const matchName = q ? (s.name.en.toLowerCase().includes(q) || s.name.ar.includes(q)) : true;
    const matchCountry = country ? s.countryId === countries.find(c => c.name.en === country)?.id : true;
    const matchLang = lang ? s.language.includes(lang) : true;
    const matchCategory = category ? s.categoryId === specializations.find(sp => sp.name.en === category)?.id : true;
    return matchName && matchCountry && matchLang && matchCategory;
  });

  const uniqueCountries = [...new Set(scholars.map(s => s.countryId))]
    .map(id => countries.find(c => c.id === id))
    .filter(Boolean)
    .map(c => ({ value: c!.name.en, label: c!.name.en }));

  const uniqueCategories = [...new Set(scholars.map(s => s.categoryId))]
    .map(id => specializations.find(sp => sp.id === id))
    .filter(Boolean)
    .map(sp => ({ value: sp!.name.en, label: sp!.name.en }));

  const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];

  return (
    <HomePageClient
      scholars={filteredScholars}
      uniqueCountries={uniqueCountries}
      uniqueCategories={uniqueCategories}
      uniqueLanguages={uniqueLanguages}
      countries={countries}
    />
  );
}
```
Note: Removed `await searchParams` for clarity (not needed here in this repo).

---
## 9. Client Interaction Layer
`HomePageClient.tsx` tasks:
- Read current URL params.
- Push updated query string when filters change.
- Render `FilterBar` + `ScholarList`.

Important detail: language param key is `lang` (NOT `language`). Keep consistent across docs + code.

---
## 10. Filters & Components
Break filters into tiny, focused components (`CountryFilter`, `LanguageFilter`, etc.) feeding a shared pattern: label + select + onChange.
Principles:
- Pass only what is needed (avoid over-propping entire data arrays if not required).
- Create derived arrays once (server) instead of regenerating in each component.

---
## 11. Scholar Presentation
`ScholarCard` composes:
- Avatar
- Info (name, country, languages, bio)
- Social links (loop over `socialMedia`)
Use `framer-motion` for small polish (fade/slide). Keep animations subtle.

---
## 12. Internationalization in Components
Use:
```tsx
const { t, i18n } = useTranslation('common');
```
Pick dynamic values based on `i18n.language` with fallback to `en`.
Avoid duplicating translation keys—group by functional area (e.g. `filters.searchPlaceholder`).

---
## 13. Rebuild Checklist (Follow This Order)
1. Scaffold project (Section 1).  
2. Install dependencies (Section 2).  
3. Create types (Section 4).  
4. Add static data (Section 5).  
5. Add i18n config + middleware (Section 6).  
6. Add ThemeProvider + base layout (Section 7 & layout).  
7. Implement server page filtering (Section 8).  
8. Implement client page + filters + list + card (Sections 9–11).  
9. Add translations & verify bilingual rendering.  
10. Manual test filters (query, country, lang, category).  
11. Refine docs / mark incomplete proposals (favorites, API).  

Stop here before adding new features—stability first.

---
## 14. Common Pitfalls (Watch Out)
| Pitfall | Fix |
|---------|-----|
| Language filter not working | Ensure param key is `lang` in both URL + component. |
| Data duplication | Derive unique lists on server only. |
| Missing fallback text | Always fall back to `en` if locale key missing. |
| Overusing client components | Default to server until you need interactivity. |

---
## 15. Next (Optional) Directions
After stable rebuild:
- Add STATUS tags to feature docs.
- Introduce Data Reference doc.
- Consider API + SWR only if dataset or latency grows.
- Add minimal tests (render page + filter change updates URL).

---
## 16. Your Practice Task
Rebuild without copy/pasting large blocks—type them to internalize patterns. After finishing, explain (verbally or in a note) the data flow from user selecting a filter to updated UI. Teaching it reinforces understanding.

---
## 17. Summary
The app is a clean demonstration of: server-side data slicing + client-driven URL state + simple i18n + modular UI. Keep things lean; only add complexity (API layer, caching, favorites) when you have a concrete need.

You can ask next for: a Data Reference doc template or a Testing Quick Start.
