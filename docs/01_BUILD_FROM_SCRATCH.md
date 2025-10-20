# Tutorial: Building "Voices of Truth" From Scratch (Updated)

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
  [key: string]: string | number;
}

export interface Specialization {
  id: number;
  en: string;
  ar: string;
  [key: string]: string | number;
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
  params: Promise<{locale:string}>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const {locale} = await params;
  return (
    <html lang={locale} dir={dir(locale)}>
    <body>{children}</body>
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
import ThemeProvider from "@/components/ThemeProvider";
import { getTranslation, supportedLngs } from "@/lib/i18n";

interface LocaleLayoutProps{
  children : React.ReactNode;
  params: Promise<{locale: string}>;
}

export default async function LocaleLayout({children, params}:LocaleLayoutProps){
  const {locale} = await params;
  const {resources} = await getTranslation(locale);

  return (
    <I18nProviderClient locale={locale} resources={resources} >
      <ThemeProvider>
        <PageLayout> {children} </PageLayout>
      </ThemeProvider>
    </I18nProviderClient>
  );
}

export async function generateStaticParams() {
  return supportedLngs.map(function(locale) {
    return { locale :locale};
  });
}
```

### C. The Theme System: Provider and Hook

To manage the theme, we use a Context Provider and a custom hook. This follows our established naming convention of `...Type` for context value interfaces.

**The Provider: `src/components/ThemeProvider.tsx`**
```tsx
// src/components/ThemeProvider.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Following our convention for context values
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // ... (theme logic as in your file)
}
```

**The Hook: `src/hooks/useTheme.ts`**
```tsx
// src/hooks/useTheme.ts
'use client';

import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@/components/ThemeProvider';

export default function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

---

## Step 4: Server-Side Data Filtering

The core logic of our app lives in the main page, which is a **Server Component**. It fetches data, filters it based on URL parameters, and then passes the result to a Client Component for display.

```tsx
// src/app/[locale]/page.tsx
import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Scholar } from '@/types';

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const { query, country, lang, category } = searchParams;

  const searchQuery = (query || '').toString().toLowerCase();

  const filteredScholars = scholars.filter(scholar => {
    const matchSearch = searchQuery
      ? scholar.name.en.toLowerCase().includes(searchQuery) ||
      scholar.name.ar.toLowerCase().includes(searchQuery)
      : true;

    const matchCountry = country ? scholar.countryId === parseInt(country as string, 10) : true;

    const matchesLang = lang ? scholar.language.includes(lang as string) : true;

    const matchesCategory = category ? scholar.categoryId === parseInt(category as string, 10) : true;

    return matchSearch && matchCountry && matchesLang && matchesCategory;
  });

  const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];

  return (
    <HomePageClient
      scholars={filteredScholars as Scholar[]}
      countries={countries}
      specializations={specializations}
      uniqueLanguages={uniqueLanguages}
    />
  );
}
```

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
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
  value: FilterContextType;
}

export const FilterProvider = ({ children, value }: FilterProviderProps) => {
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
```

### B. Create the Interactive Client Component

`HomePageClient` is responsible for user interaction. It will now use our `FilterProvider` to pass down the filter data and handlers.

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
  uniqueLanguages: string[];
}

export default function HomePageClient({ scholars, countries, specializations, uniqueLanguages }: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const uniqueCountries = countries.map(c => ({ value: c.id.toString(), label: c.en }));
  const uniqueCategories = specializations.map(s => ({ value: s.id.toString(), label: s.en }));

  const filterContextValue = {
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
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
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
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