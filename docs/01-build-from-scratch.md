# Tutorial: Building "Voices of Truth" From Scratch (Updated)

> **Status:** ✅ Updated — Sections updated for Next.js 16.2.9, Tailwind v4, custom `ThemeProvider`, and `useSyncExternalStore`-based `useHasMounted`.

Welcome, junior developer! This document is your up-to-date guide to rebuilding the "Voices of Truth" project. The goal is for you to understand the architecture, data flow, and component-based structure of a modern Next.js application.


Let's start by setting up our Next.js project.

### 1. Create a New Next.js Project

We'll use `pnpm` to create a new Next.js project with TypeScript, ESLint, and Tailwind CSS configured.

```bash
pnpm create next-app voices-of-truth --typescript --eslint --tailwind --app --src-dir --use-pnpm
```

Navigate into your new project:
```bash
cd voices-of-truth
```

### 2. Install Additional Dependencies

Our project uses a few extra libraries for features like internationalization and icons.

```bash
pnpm add i18next react-i18next i18next-resources-to-backend framer-motion react-icons tailwind-merge
```

---

## Step 1: Project Structure & Configuration

A clean structure is key to a maintainable application.

```
/
├── public/
│   ├── avatars/        # Scholar avatars
│   └── locales/        # Translation files (ar/common.json, en/common.json)
├── src/
│   ├── app/
│   │   ├── globals.css # Global styles and theme variables
│   │   └── [locale]/   # Dynamic pages for each language
│   ├── components/     # Reusable React components
│   ├── context/        # React Context providers for global state
│   ├── data/           # Static data for our scholars
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Helper functions (like i18n setup)
│   └── types/          # TypeScript type definitions
├── ... (config files)
```

---

## Step 2: Defining Our Data & Naming Conventions

> **Senior Dev Tip: Our TypeScript Naming Convention**
>
> Before we write any types, let's establish a clear, professional naming convention. This will make our code easy to read and maintain. We'll name our interfaces based on their **role**:
>
> 1.  **For Component Props**: Use a `...Props` suffix. This clearly identifies the properties for a React component.
>     *   `interface ScholarCardProps { ... }`
>
> 2.  **For Context Values**: Use a `...Type` suffix. This shows it's the shape of the value provided by a React Context.
>     *   `interface ThemeContextType { ... }`
>
> 3.  **For Data Models**: Use a clean, simple **Noun**. This is for our core data structures.
>     *   `interface Scholar { ... }`
>     *   `interface Country { ... }`
>
> This role-based system is a modern best practice that provides maximum clarity. Now, let's define our data models.

### Defining the Models

We define the shape of our data in `src/types/index.ts`.

```typescript
// src/types/index.ts
export interface Scholar {
  id: number;
  name: Record<string, string>; // e.g., { en: "Name", ar: "الاسم" }
  socialMedia: {
    platform: string;
    link: string;
    icon?: string;
  }[];
  countryId: number;
  categoryId: number;
  language: string[];
  avatarUrl: string;
  bio?: Record<string, string>;
}

export interface Country {
  id: number;
  en: string;
  ar: string;
}

export interface Specialization {
  id: number;
  en: string;
  ar: string;
}
```

---

## Step 3: The Layout System

Our app uses a nested component structure to create a consistent layout and provide global context (like themes and translations) to the entire application.

### A. The Root Layout: `src/app/layout.tsx`

This is the main HTML shell.

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { dir } from "i18next";

export const metadata: Metadata = {
  title: "Voices of Truth",
  description: "A directory of scholars and preachers.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{locale?: string}>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const {locale = 'en'} = await params;
  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
    <body className="bg-background dark:bg-gradient-to-br dark:from-gray-900 dark:to-black bg-[url('/assets/khwater.png')] bg-cover bg-center bg-fixed bg-no-repeat w-full min-h-screen">{children}</body>
    </html>
  );
}
```

### B. The Locale Layout: `src/app/[locale]/layout.tsx`

This layout wraps all pages and provides the Theme and Translation contexts.

```tsx
// src/app/[locale]/layout.tsx
import I18nProviderClient from "@/components/I18nProviderClient";
import PageLayout from "@/components/PageLayout";
import { ThemeProvider } from '@/lib/theme';
import { getTranslation, supportedLngs } from "@/lib/i18n";
import type { Metadata } from "next";

interface LocaleLayoutProps{
  children : React.ReactNode;
  params: Promise<{locale: string}>;
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');
  return {
    title: t('appTitle'),
    description: t('appTitle'),
  };
}

export default async function LocaleLayout({children, params}:LocaleLayoutProps){
  const {locale} = await params;
  const {resources} = await getTranslation(locale, ['common', 'header']);

  return (
    <ThemeProvider>
      <I18nProviderClient locale={locale} resources={resources}>
        <PageLayout> {children} </PageLayout>
      </I18nProviderClient>
    </ThemeProvider>
  );
}

export async function generateStaticParams() {
  return supportedLngs.map(function(locale) {
    return { locale :locale};
  });
}
```

### C. The Theme System: Custom `ThemeProvider`

The project uses a **custom** `ThemeProvider` defined in `src/lib/theme.tsx` instead of the `next-themes` library. This was done for Next.js 16 / React 19 compatibility — `next-themes` injects `<script>` tags during rendering, which React 19 rejects. The custom provider is ~70 lines and handles:

- **Theme state**: `'light' | 'dark' | 'system'` via React Context.
- **localStorage persistence**: Reads saved preference on init via lazy `useState` initializer, writes on change via `localStorage.setItem`.
- **System preference detection**: Defaults to `system` and listens for OS-level changes via `window.matchMedia`.
- **Flash prevention**: An inline `<script>` in `src/app/layout.tsx` applies the theme before React hydrates (see below).

**The Provider (`src/lib/theme.tsx`):**

```tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' { /* ... */ }
function applyTheme(theme: Theme) { /* ... */ }

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch {}
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme('system'); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

> **Senior Dev Tip: Avoiding Hydration Errors with `useSyncExternalStore`**
>
> The theme (`light` or `dark`) is only known on the client-side after the component has "mounted" in the browser. The server doesn't know the theme, so it renders a default state. This can cause a "hydration mismatch" error if the client renders something different from the server's initial HTML.
>
> To fix this, we use a `useHasMounted` hook that leverages React's `useSyncExternalStore` API (available since React 18). This avoids calling `setState` inside a `useEffect` (which new ESLint rules flag as problematic) and provides a clean server/client split:
>
> **`src/hooks/useHasMounted.ts`**
> ```typescript
> import { useSyncExternalStore } from 'react';
>
> export function useHasMounted() {
>   return useSyncExternalStore(() => () => {}, () => true, () => false);
> }
> ```
>
> - **Server**: Returns `false` (third argument `getServerSnapshot`).
> - **Client**: Returns `true` (second argument `getSnapshot`).
> - No `useEffect`, no cascading renders, no ESLint warnings.

**The `ThemeToggle` Component: `src/components/ThemeToggle.tsx`**
The toggle component uses the `useTheme` hook from `@/lib/theme` and the `useHasMounted` hook to safely switch between light and dark modes.

```tsx
// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/lib/theme';
import { useTranslation } from "react-i18next";
import Button from './Button';
import { useHasMounted } from '@/hooks/useHasMounted';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('common');
  const mounted = useHasMounted();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // The useHasMounted hook ensures we don't render the theme-specific
  // button text on the server, preventing a hydration mismatch.
  if (!mounted) {
    return (
      <Button
        disabled
        className="hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {t('theme')}
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      className="hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === 'light' ? t('dark') : t('light')} {t('theme')}
    </Button>
  );
}
```

### D. Flash Prevention

To prevent a flash of the wrong theme on page load, an inline script in `src/app/layout.tsx` runs before React hydration:

```tsx
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'system';
      var resolved = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      document.documentElement.classList.add(resolved);
      document.documentElement.style.colorScheme = resolved;
    } catch(e) {}
  })();
`;

return (
  <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </head>
    ...
  </html>
);
```

This script runs synchronously before any React code, ensuring the correct theme class is present on the very first paint.

---

## Step 4: Server-Side Data Filtering & Preparation

The core logic of our app lives in the main page, which is a **Server Component**. It fetches data, filters it based on URL parameters, prepares it for the UI, and then passes the result to a Client Component for display.

```tsx
// src/app/[locale]/page.tsx
import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Country, Specialization } from '@/types';
import { Suspense } from 'react';

// Precompute valid filter values for guardrails
const validCountryIds = new Set(countries.map(c => c.id));
const validCategoryIds = new Set(specializations.map(s => s.id));

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const {locale} = await params;
  const { query, country, lang, category } = await searchParams;

  const searchQuery = (query || '').toString().toLowerCase();
  const countryId = country ? parseInt(country as string, 10) : NaN;
  const categoryId = category ? parseInt(category as string, 10) : NaN;
  const langValue = (lang || '').toString();

  // Validate filter values against known data
  const isValidCountry = !isNaN(countryId) && validCountryIds.has(countryId);
  const isValidCategory = !isNaN(categoryId) && validCategoryIds.has(categoryId);
  const isValidLang = langValue && scholars.some(s => s.language.includes(langValue));

  // Filter the scholars on the server
  const filteredScholars = scholars.filter(scholar => {
    const matchSearch = searchQuery
      ? scholar.name.en.toLowerCase().includes(searchQuery) ||
        scholar.name.ar.toLowerCase().includes(searchQuery) ||
        (scholar.bio?.en || '').toLowerCase().includes(searchQuery) ||
        (scholar.bio?.ar || '').toLowerCase().includes(searchQuery)
      : true;

    const matchCountry = isValidCountry ? scholar.countryId === countryId : true;

    const matchesLang = isValidLang ? scholar.language.includes(langValue) : true;

    const matchesCategory = isValidCategory ? scholar.categoryId === categoryId : true;

    return matchSearch && matchCountry && matchesLang && matchesCategory;
  });

  // Prepare data for the client — labels are locale-aware
  const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];
  const uniqueCountries = countries.map((c: Country) => ({
    value: c.id.toString(),
    label: locale === 'ar' ? c.ar : c.en,
  }));
  const uniqueCategories = specializations.map((s: Specialization) => ({
    value: s.id.toString(),
    label: locale === 'ar' ? s.ar : s.en,
  }));

  return (
    <Suspense fallback={<div className="text-center py-12"><p className="text-muted-foreground">Loading...</p></div>}>
      <HomePageClient
        scholars={filteredScholars}
        countries={countries}
        uniqueLanguages={uniqueLanguages}
        uniqueCountries={uniqueCountries}
        uniqueCategories={uniqueCategories}
      />
    </Suspense>
  );
}
```

> **Note for Real-World Applications:**
> In this tutorial, we are importing `scholars`, `countries`, and `specializations` directly from local files for simplicity. In a production application, this data would typically be fetched from an external API.

---

## Step 5: State Management with Context

Now for the most important architectural decision. Instead of passing all the filter data and functions down through props (prop drilling), we will use a **React Context** to make them available to any component that needs them.

### A. Create the `FilterContext`

This file defines the shape of our context and provides the `FilterProvider` component and `useFilters` hook.

```tsx
// src/context/FilterContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

// Define the shape of the data using our '...Type' convention
export interface FilterContextType {
  uniqueCountries: Array<{ value: string; label: string }>;
  uniqueLanguages: string[];
  uniqueCategories: Array<{ value: string; label: string }>;
  onCountryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export const useFilters = () => {
  const context = useContext(FilterContext);
  // Ensure the hook is used within a provider, Prevents runtime errors, Make developer sure to wrap components properly.
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode; // ReactNode is coming from React and represents any valid React child (elements, strings, fragments, etc.)
  value: FilterContextType;
}

export const FilterProvider = ({ children, value }: FilterProviderProps) => {
  return (
  // ".Provider" is coming from createContext. {chi}ldren} is the nested components inside the Provider.
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
```

### B. Create the Interactive Client Component

`HomePageClient` is responsible for user interaction. It receives the pre-processed props from the server and uses our `FilterProvider` to pass down the filter data and handlers.

```tsx
// src/app/[locale]/HomePageClient.tsx
'use client';

import { Scholar, Country, Specialization } from "@/types";
import ScholarList from "@/components/ScholarList";
import FilterBar from "@/components/FilterBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterProvider } from "@/context/FilterContext";

interface HomePageClientProps {
  scholars: Scholar[];
  countries: Country[];
  specializations: Specialization[];
  uniqueCountries: { value: string; label: string }[];
  uniqueCategories: { value: string; label: string }[];
  uniqueLanguages: string[];
}

export default function HomePageClient({
  scholars,
  countries,
  specializations,
  uniqueCountries,
  uniqueCategories,
  uniqueLanguages
}: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

// Function to handle filter changes and update the URL accordingly (key = filter type, value = selected value)
  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    // Update or remove the filter in the URL ( value is empty => remove the filter)
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.replace(`${pathname}${query}`); // Use replace to avoid history bloat on every filter change
  };

  // Read current filter values from URL params
  const currentQuery = searchParams.get('query') || '';
  const currentCountry = searchParams.get('country') || '';
  const currentLang = searchParams.get('lang') || '';
  const currentCategory = searchParams.get('category') || '';

  const filterContextValue = {
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    currentFilters: {                   // Provide current URL state to filter controls
      query: currentQuery,
      country: currentCountry,
      lang: currentLang,
      category: currentCategory,
    },
    onCountryChange: (value: string) => handleFilterChange('country', value),
    onLanguageChange: (value: string) => handleFilterChange('lang', value),
    onCategoryChange: (value: string) => handleFilterChange('category', value),
    onSearchChange: (value: string) => handleFilterChange('query', value),
  };

  return (
    <FilterProvider value={filterContextValue}>
      <FilterBar />
      <ScholarList scholars={scholars} countries={countries} />
    </FilterProvider>
  );
}
```

### C. Create the Simplified `FilterBar` and Children

Thanks to the context, `FilterBar` is now a simple, clean layout component with no props. Its children use the `useFilters` hook to get the data they need.

```tsx
// src/components/FilterBar.tsx
"use client";

import React from 'react';
import CountryFilter from './filters/CountryFilter';
import LanguageFilter from './filters/LanguageFilter';
import CategoryFilter from './filters/CategoryFilter';
import SearchInput from './filters/SearchInput';

// No props needed!
export default function FilterBar(){
  return (
    <div className="p-4 bg-card rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <SearchInput />
      <CountryFilter />
      <LanguageFilter />
      <CategoryFilter />
    </div>
  );
}
```

```tsx
// src/components/filters/CountryFilter.tsx
'use client'

import { useFilters } from "@/context/FilterContext";
import { useTranslation } from "react-i18next";
import FilterDropdown from "./FilterDropdown";

// No props needed!
export default function CountryFilter(){
  const { uniqueCountries, onCountryChange } = useFilters(); // Data comes from the hook
  const { t } = useTranslation('common');

  return (
    <FilterDropdown 
      label={t('filterByCountry')}
      filterKey="country"
      options={uniqueCountries}
      onChange={onCountryChange}
    />
  );
};
```

---

## Conclusion & Your Turn

You now have a complete guide to building "Voices of Truth" with a modern, server-centric, and scalable architecture that correctly manages state. By using a React Context for the filters, you've avoided prop drilling and created a much more maintainable codebase.

**Your next task:**
Explore the other filter components (`LanguageFilter`, `CategoryFilter`, `SearchInput`) and refactor them to use the `useFilters` hook, just like `CountryFilter`.

---

> **See also:**
> - [Styling Guide](03-styling-guide.md) — theme architecture and CSS setup
> - [Layout System](12-layout-system.md) — how the three layout layers work together
> - [Translation Guide](04-feature-translation.md) — i18n setup and middleware
> - [Prop Drilling Deep Dive](prop-drilling-deep-dive.md) — FilterContext implementation details