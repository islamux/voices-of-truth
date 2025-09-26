# Tutorial: Building "Voices of Truth" From Scratch

Welcome, junior developer! This document is your guide to rebuilding the "Voices of Truth" project. The goal is for you to understand the architecture, data flow, and component-based structure of a modern Next.js application.

We'll focus on the "how" and "why" of the code, not the initial project setup.

**Our Tech Stack:**
*   **Framework:** Next.js 14+ (with App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** React
*   **State Management:** React Hooks (`useState`, `useMemo`, custom hooks)
*   **Internationalization (i18n):** `i18next` and `react-i18next`

---

## Step 1: Project Structure & Configuration

A clean structure is key to a maintainable application.

```
/
├── public/             # Static assets (images, fonts, translation files)
│   ├── avatars/
│   └── locales/
├── src/                # Our main application source code
│   ├── app/            # Next.js App Router pages, layouts, and hooks
│   │   ├── [locale]/   # Pages that change based on language
│   │   └── hooks/      # Our custom React hooks
│   ├── components/     # Reusable React components
│   ├── data/           # Static data for our scholars
│   ├── lib/            # Helper functions (like i18n setup)
│   └── types/          # TypeScript type definitions
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

---

## Step 2: Defining Our Data (The "Model")

Before we build anything, we need to define the shape of our data. What information does a "scholar" have? We define this in `src/types/index.ts`.

```typescript
// src/types/index.ts
export interface Scholar {
  id: string;
  name: Record<string, string>; // e.g., { en: "Name", ar: "الاسم" }
  socialMedia: { /* ... */ }[];
  country: Record<string, string>;
  language: string[];
  avatarUrl: string;
  bio?: Record<string, string>;
  category: {
    [key: string]: string;
  };
}
```
**Why `Record<string, string>`?** This is a simple and effective way to support multiple languages for a single field. The `key` is the language code (e.g., 'en', 'ar'), and the `value` is the translated text.

---

## Step 3: Creating the Data Source

Our app uses static data stored in files. We organize it by category in `src/data/scholars/` and then combine it all into one master list in `src/data/scholars.ts`. This keeps our data management clean and modular.

```typescript
// src/data/scholars.ts
import { Scholar } from '../types';
import { hadithStudiesScholars } from './scholars/hadith-studies';
// ... import all other scholar category files

export const scholars: Scholar[] = [
  ...hadithStudiesScholars,
  // ... spread all other imported arrays
];
```

---

## Step 4: Building Reusable UI Components

Components are the building blocks of our app. We create small, focused components and compose them together.

### The `ScholarCard` Component

This component displays a single scholar. It used to require a `currentLang` prop, but we refactored it to be more self-sufficient.

```tsx
// src/components/ScholarCard.tsx
"use client";

import React from 'react';
import { Scholar } from '../types';
import { useTranslation } from 'react-i18next'; // Import the hook
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
// ... other imports

interface ScholarCardProps {
  scholar: Scholar;
  // No more currentLang prop!
}

const ScholarCard: React.FC<ScholarCardProps> = ({ scholar }) => {
  const { i18n } = useTranslation(); // Use the hook to get language info
  const currentLang = i18n.language; // Get the current language

  // Now, the component gets the language by itself!
  const name = scholar.name[currentLang] || scholar.name['en'];
  const country = scholar.country[currentLang] || scholar.country['en'];
  const bio = scholar.bio && (scholar.bio[currentLang] || scholar.bio['en']);

  return (
    <div className="border rounded-lg ...">
      <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name} />
      <ScholarInfo name={name} country={country} bio={bio} languages={scholar.language} />
      {/* ... */}
    </div>
  );
};

export default ScholarCard;
```
**Why this change is better:**
*   **More Robust:** The component no longer depends on its parent to pass down the language. It gets the language directly from the i18n provider.
*   **Cleaner Code:** We don't have to pass the `currentLang` prop through multiple layers of components (this is called "prop drilling").

---

## Step 5: Setting Up the App Layout and Providers

The root layout at `src/app/[locale]/layout.tsx` is crucial. It sets up all the "providers" that give our components access to things like theme, language, and translations.

```tsx
// src/app/[locale]/layout.tsx
import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/Layout'; // Our main visual layout

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;
  const { resources } = await getTranslation(locale);

  return (
    // 1. Provides translations to client components
    <I18nProviderClient locale={locale} resources={resources}>
      {/* 2. Provides theme (light/dark) state */}
      <ThemeProvider>
        {/* 3. Provides the header, footer, and overall page structure */}
        <Layout>{children}</Layout>
      </ThemeProvider>
    </I18nProviderClient>
  );
}
```
This file now wraps every page with our `Layout` component, ensuring the header (with theme/language switchers) and footer appear everywhere.

---

## Step 6: Extracting Logic into a Custom Hook (`useScholars`)

Initially, all the filtering logic was inside the `HomePageClient` component. This made the component large and hard to read. We extracted all of this logic into a **custom hook** called `useScholars`.

A custom hook is just a JavaScript function whose name starts with "use". It lets you reuse stateful logic across different components.

```typescript
// src/app/hooks/useScholars.ts
"use client";

import { scholars } from "@/data/scholars";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const useScholars = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // 1. State for user's filter selections
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Memoized logic to filter scholars when selections change
  const filteredScholars = useMemo(() => {
    return scholars.filter((scholar) => {
      const countryMatch = !selectedCountry || (scholar.country[currentLang] || scholar.country['en']) === selectedCountry;
      const languageMatch = !selectedLanguage || scholar.language.includes(selectedLanguage);
      const categoryMatch = !selectedCategory || (scholar.category[currentLang] || scholar.category['en']) === selectedCategory;
      const searchMatch = !searchTerm || (scholar.name[currentLang] || scholar.name['en']).toLowerCase().includes(searchTerm.toLowerCase());
      return countryMatch && languageMatch && categoryMatch && searchMatch;
    });
  }, [selectedCountry, selectedLanguage, selectedCategory, currentLang]);

  // 3. Memoized logic to get unique, translated values for filter dropdowns
  const uniqueCountries = useMemo(() => { /* ... */ }, [currentLang]);
  const uniqueCategories = useMemo(() => { /* ... */ }, [currentLang]);
  // ...

  // 4. Return everything the component needs
  return {
    filteredScholars,
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange: setSelectedCountry,
    onLanguageChange: setSelectedLanguage,
    onCategoryChange: setSelectedCategory,
    onSearchChange: setSearchTerm,
  };
};
```

---

## Step 7: Assembling the Main Page (The Clean Way)

After moving all the logic to the `useScholars` hook, our `HomePageClient` component becomes incredibly simple and readable. Its only job is to manage the view.

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import { useScholars } from "../hooks/useScholars"; // Import our custom hook
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";

const HomePageClient = () => {
  // 1. Get all the data and functions from our hook with one line!
  const {
    filteredScholars,
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange,
    onLanguageChange,
    onCategoryChange,
    onSearchChange
  } = useScholars();

  // 2. Pass the data down to the presentational components
  return (
    <div className="container ...">
      <h1 className='text-4xl ...'>Voices of Truth</h1>

      <FilterBar
        uniqueCountries={uniqueCountries}
        uniqueLanguages={uniqueLanguages}
        uniqueCategories={uniqueCategories}
        onCountryChange={onCountryChange}
        onLanguageChange={onLanguageChange}
        onCategoryChange={onCategoryChange}
        onSearchChange={onSearchChange}
      />

      <ScholarList scholars={filteredScholars} />
    </div>
  );
};

export default HomePageClient;
```
**Key Concept: Separation of Concerns**
*   The **`useScholars` hook** handles the *logic* (state, filtering, data transformation).
*   The **`HomePageClient` component** handles the *presentation* (displaying the UI).

This is a very common and powerful pattern in modern React development.

---

## Conclusion & Your Turn

You now have a complete overview of how "Voices of Truth" is built with a more advanced and maintainable structure. You've seen how we:
1.  Define data structures with TypeScript.
2.  Build self-contained, reusable UI components.
3.  Use a root layout to provide consistent structure and context (theme, i18n).
4.  **Separate logic from presentation using custom hooks.**

**Your next task:**
Try to add a new filter to the app (for example, by a scholar's main language).
1.  Update the `useScholars` hook to add a new piece of state (e.g., `selectedLanguage`).
2.  Add the filtering logic for it inside the `useMemo` block.
3.  Add a new dropdown to the `FilterBar` component.
4.  Pass the new state handler (`onLanguageChange`) from `HomePageClient` to `FilterBar`.

Good luck!
