# Tutorial: Building "Voices of Truth" From Scratch (Updated)

Welcome, junior developer! This document is your up-to-date guide to rebuilding the "Voices of Truth" project. The goal is for you to understand the architecture, data flow, and component-based structure of a modern Next.js application.


Let's start by setting up our Next.js project.

### 1. Create a New Next.js Project

We'll use `pnpm` to create a new Next.js project with TypeScript, ESLint, and Tailwind CSS configured.

```bash
pnpm create next-app voices-of-truth --typescript --eslint --tailwind --app --src-dir --use-pnpm
```

This command will:
*   `voices-of-truth`: Name your project directory.
*   `--typescript`: Configure TypeScript.
*   `--eslint`: Configure ESLint.
*   `--tailwind`: Configure Tailwind CSS.
*   `--app`: Use the App Router (recommended for Next.js 13+).
*   `--src-dir`: Create an `src/` directory.
*   `--use-pnpm`: Use pnpm as the package manager.

Navigate into your new project:
```bash
cd voices-of-truth
```

### 2. Install Additional Dependencies

Our project uses a few extra libraries for features like internationalization and icons.

```bash
pnpm add i18next react-i18next i18next-resources-to-backend framer-motion react-icons tailwind-merge
```

*   **`i18next`, `react-i18next`, `i18next-resources-to-backend`**: For handling translations.
*   **`framer-motion`**: For animations.
*   **`react-icons`**: For easily adding icons.

### 3. Initial Project Structure

After setup, your project structure will look similar to this:
```
/
├── public/             # Static assets (images, fonts, translation files)
│   └── ...
├── src/                # Our main application source code
│   ├── app/            # Next.js App Router pages and layouts
│   │   └── ...
│   ├── ...
├── next.config.mjs     # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project dependencies and scripts
└── pnpm-lock.yaml      # pnpm lock file
```

**Our Tech Stack:**
*   **Framework:** Next.js 15+ (with App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** React
*   **Internationalization (i18n):** `i18next`
*   **Animation:** `framer-motion`

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
  [key: string]: string | number; //Index Signiture: instead of add another value like fr, gr, it, he, Or other kye like poplution:
}

export interface Specialization {
  id: number;
  en: string;
  ar: string;
  [key: string]: string | number;
}
```
**Why `Record<string, string>`?** This is a simple and effective way to support multiple languages for a single field. The `key` is the language code (e.g., 'en', 'ar'), and the `value` is the translated text.

---

## Step 3: Creating the Data Source

Our app uses static data stored in files. We organize it by category in `src/data/scholars/` and then combine it all into one master list in `src/data/scholars.ts`.

```typescript
// src/data/scholars/index.ts
import { comparativeReligionScholars } from "./comparative-religion";
// ... import all other scholar category files

export const allScholars = [
  ...comparativeReligionScholars,
  // ... spread all other imported arrays
];

// src/data/scholars.ts
import { allScholars } from './scholars/index';
import { Scholar } from '../types';

// i update these file with direct lists instead of allScholars;
export const scholars: Scholar[] = [
....
];
```

---

## Step 4: The Layout System (Refactored)

In Next.js, the "layout" isn't just one file; it's a system of nested components. Our app uses a clean, component-based architecture to create a consistent and context-aware user experience. This approach separates concerns and makes our code much more maintainable.

Think of our layouts as Russian Dolls, each one wrapping the next:

#  Layouts – Russian Dolls Inside Next.js

RootLayout (supplies `<html lang=...>)`
  └─ LocaleLayout (supplies translations and theme)
      └─ PageLayout (The visual structure: header, main, footer)
          └─ Header (Contains title, language switcher, theme toggle)
              └─ Actual Page (list of scholars)
          └─ Footer

### A. The Root Layout: `src/app/layout.tsx`

This is the top-level layout for the entire application. It's the main HTML shell.

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

**What it does:**
*   It's a **Server Component**.
*   It defines the `<html>` and `<body>` tags.
*   It sets the language (`lang`) and direction (`dir`) on the `<html>` tag based on the URL, which is crucial for accessibility and styling.

### B. The Locale Layout: `src/app/[locale]/layout.tsx`

This layout wraps all pages for a specific language. It's responsible for providing the contexts for translations and themes.

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

**What it does:**
*   Also a **Server Component**.
*   Fetches translations for the current language.
*   Wraps the page (`{children}`) with two important providers:
    1.  `I18nProviderClient`: Provides the translation context.
    2.  `ThemeProvider`: Provides the theme (light/dark) context.
*   It then renders the `PageLayout` component, which holds the visual structure.

### C. The Theme System: Provider and Hook

To keep our code organized, the theme system is split into two main files: the provider component and a custom hook to consume it.

**The Provider: `src/components/ThemeProvider.tsx`**

This component manages the theme state and provides it to the application.

```tsx
// src/components/ThemeProvider.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Export the context type and the context itself
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // This effect runs once on the client to set the initial theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme as 'light' | 'dark');
  }, []);

  // This effect runs whenever the 'theme' state changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**The Hook: `src/hooks/useTheme.ts`**

We create a dedicated `hooks` directory to store all our custom hooks. This is a common and recommended convention.

```tsx
// src/hooks/useTheme.ts
'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/components/ThemeProvider';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

**How it works, step-by-step:**
1.  **`'use client'`**: Both files are marked as client-side because they use hooks (`useState`, `useEffect`, `useContext`).
2.  **Context (`ThemeProvider.tsx`)**: We create and **export** `ThemeContext`. Exporting it is key, as it allows our external hook to import and use it.
3.  **Provider (`ThemeProvider.tsx`)**: This component wraps our application. Its job is to hold the theme state (`'light'` or `'dark'`) and the logic for changing it. It passes these down via the `ThemeContext.Provider`.
4.  **Hook (`useTheme.ts`)**: This is our consumer. Any client component can now call `useTheme()` to get the current `theme` and the `toggleTheme` function, without needing to import `useContext` and `ThemeContext` every time. This keeps our components cleaner.
5.  **Synchronization**: The `useEffect` hooks in the provider still handle the logic of checking `localStorage` and adding/removing the `.dark` class from the `<html>` element.

### D. The Reusable Button Component

To ensure all our buttons are consistent and easy to maintain, we create a reusable `Button` component.

```tsx
// src/components/Button.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, className, ...props }, ref) {
  const baseClasses = "px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  
  const mergedClasses = twMerge(baseClasses, className);

  return (
    <button className={mergedClasses} ref={ref} {...props}>
      {children}
    </button>
  );
});
```

### E. The Page Layout and its Children

Now that the providers and our reusable button are set up, the rest of the components are simple and focused on their specific tasks.

**`src/components/PageLayout.tsx`** (Updated)



To fix our theming issue and simplify our code, we'll remove the redundant background styling from our `PageLayout`. The `<body>` tag, styled in `globals.css`, is already handling the background gradient for the entire page. Our layout should just focus on arranging its children.



```tsx

// src/components/PageLayout.tsx

"use client";



import React, { ReactNode } from 'react';

import Header from './Header';

import Footer from './Footer';



interface PageLayoutProps {

  children: ReactNode;

}



export default function PageLayout({ children }: PageLayoutProps) {

  return (

    // The background is now handled by the body tag in globals.css

    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-6">

        {children}

      </main>

      <Footer />

    </div>

  );

}

```



> **Reasoning for the fix:** Previously, this component had its own background that was identical to the `<body>`'s background. This was redundant. By removing it, we let the main `<body>` style show through, which simplifies our layout and makes it easier to manage styles. The core of the theme-switching problem lies in the components *inside* `<main>`, which now need their own `dark:` styles.

**`src/components/Header.tsx`**

```tsx
// src/components/Header.tsx
'use client';

import { useTranslation } from "react-i18next";
import LanguageSwicher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Header(){
  const {t} = useTranslation('common');

  return (
    <header className="p-4 bg-gray-100 dark:bg-gray-800 shadow-md text-gray-900 dark:text-white">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-semibold">{t('headerTitle')}</h1>
        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
          <LanguageSwicher/>
          <ThemeToggle/>
        </div>
      </div>
    </header>
  );
}
```

> **Note for Junior Devs:** In the code block above, the class `items-centers` had a typo and has been corrected to `items-center`. This is a common mistake. Using the correct class ensures the items inside the flex container are properly centered vertically.


**`src/components/ThemeToggle.tsx`**

```tsx
// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from "@/hooks/useTheme"; // Updated import path
import { useTranslation } from "react-i18next";
import Button from './Button';

export default function ThemeToggle(){
  const {theme, toggleTheme} = useTheme();
  const {t} = useTranslation('common');

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

**`src/components/LanguageSwitcher.tsx`**

```tsx
// src/components/LanguageSwitcher.tsx
'use client';

import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from 'next/navigation';
import Button from './Button';

export default function LanguageSwicher(){
  const {t, i18n} = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = i18n.language;

  const changeLanguage = (newLang: string)=>{
    if(currentLang === newLang) return;
    if(pathname){
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      router.push(newPath);
    }else{
      router.push(`/${newLang}`);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        onClick={ ()=>changeLanguage('en') }
        disabled ={currentLang === 'en'}
        className="enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700"
      >
        {t('english')}
      </Button>
      <Button
        onClick={ ()=> changeLanguage('ar') }
        disabled={currentLang === 'ar'}
        className="enabled:hover:bg-gray-200 dark:enabled:hover:bg-orange-700"
      >
        {t('arabic')}
      </Button>
    </div>
  );
}
```

### D. The Translation Bridge: `I18nProviderClient.tsx` (Optimized)

We've seen that `LocaleLayout` (a Server Component) fetches translations and passes them to `I18nProviderClient`. This component is the critical bridge that makes translations available to all our interactive **Client Components**.

A recent update optimized this component for performance using the `useMemo` hook.

```tsx
// src/components/I18nProviderClient.tsx
'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance, Resource } from 'i18next';
import { useMemo } from 'react';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, supportedLngs, defaultNS } from '../lib/i18n';

interface I18nProviderClientProps {
  children: React.ReactNode;
  locale: string;
  resources: Resource;
}

export default function I18nProviderClient({
  children,
  locale,
  resources,
}: I18nProviderClientProps) {
  const i18n = useMemo(() => {
    const instance = createInstance();
    instance.use(initReactI18next).init({
      supportedLngs,
      fallbackLng,
      lng: locale,
      ns: defaultNS,
      defaultNS,
      resources,
    });
    return instance;
  }, [locale, resources]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

**What it does (and why it's optimized):**

*   **`'use client';`**: Marks this as a Client Component.
*   **Receives Server Data**: It accepts `locale` and `resources` as props from the `LocaleLayout` Server Component.
*   **Initializes on the Client**: It creates and initializes an `i18next` instance on the client side.
*   **Provides Context**: It wraps its `children` with `<I18nextProvider>`, making the `i18n` instance available to any nested Client Component via the `useTranslation()` hook.
*   **`useMemo` for Performance**: The entire `i18next` instance creation is wrapped in a `useMemo` hook. This is a crucial optimization. It ensures that the `i18n` instance is **only created once** unless the `locale` or `resources` props change. Without this, a new instance would be created on every render, causing unnecessary work and potential re-renders for all child components.

This pattern is the standard way to handle i18n in the Next.js App Router: **Load data on the Server, provide context on the Client, and memoize the context provider to prevent unnecessary re-renders.**

### Summary of the Layout System

1.  At build time, `generateStaticParams` tells Next.js to create versions of the page for `/en` and `/ar`.
2.  A request comes in for a URL like `/en/some-page`.
3.  **`RootLayout`** runs, creating the `<html>` and `<body>` tags with `lang="en"`.
4.  **`LocaleLayout`** runs, fetching English translations and wrapping everything in the necessary providers and our `PageLayout` component.
5.  The **Page Component** (`some-page.tsx`) runs and is placed inside the `<main>` tag of the `PageLayout` component.
6.  The final HTML is sent to the browser.

This nested structure is a powerful Next.js pattern for separating concerns: the root document structure, language/theme contexts, and the final visual presentation.
---

## Step 5: Internationalization (i18n) and Middleware

Our app supports English and Arabic. This is handled by a combination of a middleware and a helper function.

**`src/middleware.ts`**: This file is responsible for redirecting users to their preferred language. If a user visits `/`, it checks their browser's language and redirects them to `/en` or `/ar`.

**`src/lib/i18n.ts`**: This helper sets up `i18next` to load the correct translation files from the `public/locales` directory based on the `[locale]` parameter in the URL.

---

## Step 6: Server-Side Filtering with Server Components

A major architectural shift in this project was moving from client-side filtering to **server-side filtering**. This improves performance by sending only the necessary data to the client.

This logic now lives in `src/app/[locale]/page.tsx`, which is a **Server Component**.

```tsx
// src/app/[locale]/page.tsx
import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
// ... other data imports

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;

}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  // 1. Get filter values from the URL's search parameters.
  const { query, country, lang, category } = await searchParams;

  const searchQuery = (query || '').toString().toLowerCase();

  // 2. Filter the scholars on the server
  const filteredScholars = scholars.filter(scholar => {
    const matchSearch = searchQuery
      ? scholar.name.en.toLowerCase().includes(searchQuery) ||
        scholar.name.ar.toLowerCase().includes(searchQuery)
      : true;

    // Add logic for country, category, filters here.
    const countryId = country ? countries.find(c => c.en === country)?.id : undefined;
    const matchCountry = country ? scholar.countryId === countryId : true;

    const matchesLang = lang ? scholar.language.includes(lang as string) : true;

    const categoryId = category ? specializations.find(s => s.en === category)?.id : undefined;
    const matchesCategory = category ? scholar.categoryId === categoryId : true;

    return matchSearch && matchCountry && matchesLang && matchesCategory;
  });
// 3. Prepare data for the client (e.g., for filter dropdowns)
    /*  unique... avoid dupliaction  "SEARCCH TO SPLIT THEM IN SEPERATED FILES LATER"*/    // uniqueCountries

    const uniqueCountries = [...new Set(scholars.map(s => s.countryId))] /* Set():  First Make Arry mayb contain dupliactions*/
      .map(id => countries.find(c => c.id === id))
      .filter((country): country is Country => country !== undefined)
      .map(country => ({ value: country.en, label: country.en }));

//------------ Another solution but simpler -------------- //
// The same func unique but using normal func not arrow.
// 1. Get countries numbers
const allCountryIds = scholars.map(function(scholar) {
  return scholar.countryId;
});
// 2. Remove dupliactions
const uniqueCountryIds = Array.from(new Set(allCountryIds));
// 3. Get country info based on id
const foundCountries = uniqueCountryIds.map(function(id) {
  return countries.find(function(country) {
    return country.id === id;
  });
}).filter(function(country) {
  return country !== undefined;
});
// 4. Create a ready array (e.g, select)
const uniqueCountries = foundCountries.map(function(country) {
  return {
    value: country.en,
    label: country.en
  };
});
//----------------------------------------------//
    // uniqueCategories
    const uniqueCategories = [...new Set(scholars.map(s => s.categoryId))]
      .map(id => specializations.find(s => s.id === id))
      .filter((specialization): specialization is Specialization => specialization !== undefined)
      .map(specialization => ({ value: specialization.en, label: specialization.en }));

      // uniqueLanguages
    const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];

  // 4. Pass the filtered data to the client component.
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

### Important Lesson: `searchParams` in Next.js 15

You might have noticed `const { query, country, lang, category } = await searchParams;`.

In Next.js 15, the `searchParams` object in Server Components is **asynchronous**. You **must `await` it** before you can access its properties. Forgetting this will cause an error. This is a key change from previous versions.

> 🪄 **Why `async params`?** Next.js 15 made **all** dynamic params `Promise` so the framework can stream things in parallel.


---

## Step 7: The Interactive Client Component

While the server handles filtering, the `HomePageClient.tsx` component is responsible for managing user interaction and telling the server when to re-filter the data.

Here’s how it works:

> **Attention: Hooks are for Client Components Only**
>
> A critical rule in Next.js is that React hooks (e.g., `useState`, `useEffect`, `useCallback`, and `useSearchParams()`) can **only** be used inside Client Components. This is why the `HomePageClient.tsx` file starts with the `"use client";` directive.
>
> Server Components cannot use hooks because they run on the server and don't have the interactive, stateful lifecycle that hooks depend on.

> **Attention: Follow the Rules of Hooks**
>
> Another key rule is that you must always use hooks at the **top level** of your React component.
>
> -   **DON'T** call hooks inside loops, conditions (`if` statements), or nested functions.
> -   **DO** call them unconditionally at the top of your component every single time it renders.
>
> This is because React relies on the order in which hooks are called to associate state with the correct component. The code example for `HomePageClient` follows this rule correctly: `useRouter`, `usePathname`, and `useSearchParams` are all called right at the start of the component function.

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
// ... other imports

// ... (interface definition) ...

const HomePageClient: React.FC<HomePageClientProps> = ({
  scholars,
  uniqueCountries,
  // ... other props
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Define a callback to handle filter changes
  const handleFilterChange = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value); // set() adds or updates the parameter
      } else {
        params.delete(name); // delete() removes the parameter to clear the filter
        }
      // 2. Trigger Re-render: Push the new URL to the router.
      // This tells Next.js to re-render the server component with new searchParams.
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // 3. Pass the handler down to the FilterBar
  return (
    <div className="space-y-8">
      <FilterBar
        uniqueCountries={uniqueCountries}
        // ... other props
        onCountryChange={(country) => handleFilterChange("country", country)}
        onCategoryChange={(category) => handleFilterChange("category", category)}
        // ... other handlers
      />
      <ScholarList scholars={scholars} countries={countries} />
    </div>
  );
};

export default HomePageClient;
```

### A Deeper Look at `handleFilterChange`

> **Attention: Immutability in React**
>
> A fundamental principle in React is to treat state and props as immutable. This means you should never directly modify objects or arrays. Instead, always create a new copy with the updated values.
>
> -   **DON'T (Mutable):** `myArray.push(newItem);` or `myObject.property = 'new value';`
> -   **DO (Immutable):** `const newArray = [...myArray, newItem];` or `const newObject = { ...myObject, property: 'new value' };`
>
> In our `handleFilterChange` function, we follow this rule by creating a `new URLSearchParams(searchParams.toString())`. This creates a safe, editable copy of the parameters that we can change without affecting the original `searchParams` object provided by the hook. This prevents unexpected side effects and makes our component's behavior more predictable.

This function is the bridge between the user's actions on the client and the data filtering on the server. Its one and only job is to change the URL's query parameters whenever a user interacts with a filter. Let's break it down.

First, the function is wrapped in `useCallback` for performance. This ensures that the function isn't recreated on every single render, only when its dependencies (`pathname`, `router`, or `searchParams`) change.

When a user picks a filter (e.g., selecting "Egypt"), the `FilterBar` component calls `handleFilterChange("country", "Egypt")`. Here’s what happens inside:

**1. Get the Current URL Params**
```typescript
const params = new URLSearchParams(searchParams.toString());
```
We get the current URL's query string (e.g., `?category=hadith-studies`) and use the standard `URLSearchParams` API to create a new, **editable copy** of the parameters.

**2. Update the Params**
```typescript
if (value) {
  params.set(name, value);
} else {
  params.delete(name);
}
```
If the user selected a `value` (like "Egypt"), we `set` it (e.g., `country=Egypt`). If they cleared the filter, the `value` is empty, and we `delete` that parameter from our copy.

**3. Trigger the Server Rerender**
```typescript
router.push(`${pathname}?${params.toString()}`);
```
This is the most important step. We use the router to push a new URL, combining the current `pathname` (like `/en`) with our newly modified query string. The final URL might look like: `/en?category=hadith-studies&country=Egypt`.

This URL change is the magic trigger. As we'll see in the next section, Next.js detects this change and automatically re-runs the Server Component with the new parameters.

**Key Concept: The Client-Server Interaction Loop**
1.  **User Action:** The user selects a category in the `FilterBar`.
2.  **Event Handler:** The `onCategoryChange` callback fires, calling `handleFilterChange('category', 'islamic-thought')`.
3.  **URL Update:** `handleFilterChange` constructs the new URL query string and `router.push()` changes the URL (e.g., to `/en?category=islamic-thought`).
4.  **Server Reruns:** Next.js detects the URL change and re-renders the Server Component (`page.tsx`) with the new `searchParams`.
5.  **New Data:** The server filters the data and passes the new, smaller list down to `HomePageClient`.
6.  **UI Update:** The client re-renders with the new `scholars` prop.

## Cheat-Sheet – Print & Stick on Wall
| Shortcut | Meaning |
|---|---|
| `params` **must** be awaited in Next.js 15 | `const {locale} = await params` |
| Server Component = **no hooks** | Hooks only inside `"use client"` files |
| URL is the **single source of truth** | Refresh page → same filter state |
| `className="dark:bg-black"` | Works because we toggle `<html class="dark">` |
| `t('key')` | Always use the **English** key in code, even when UI is Arabic |

> 🔄 **Client-Server ping-pong**:
> User clicks ▶ `handleFilterChange` ▶ URL changes ▶ `HomePage` (server) re-runs ▶ new props ▶ UI updates.

> The server does the heavy lifting of filtering, but the client is responsible for the user experience. The `HomePageClient.tsx` component manages user input and tells the server when to re-filter the data.


> 🪄 **Image optimisation**: Next.js `<Image>` auto-serves **WebP**, **lazy-loads**, and **prevents layout shift** – all for free.

> 🪄 **Tailwind dark mode**: Because we manually toggle `class="dark"` on `<html>`, Tailwind automatically enables `dark:bg-gray-900`, `dark:text-white`, etc.

** Feature | How to add |
|---|---|
| **Search with Arabic diacritics** | Install `arabic-persian-search` npm pkg → normalize strings before `.includes()` |
| **Pagination** | Use `searchParams.page` + `slice((page-1)*12, page*12)` |
| **SEO** | Add `generateMetadata({ params })` in `page.tsx` → return `{title: …, openGraph: …}` |
| **CMS** | Replace static `scholars.ts` with **Sanity**, **Strapi**, or **Contentful** |
| **Tests** | Use **Playwright** to click language switcher → assert `<html lang="ar">` |
| **Deploy** | Push to **GitHub** → import repo into **Vercel** → zero-config deploy |
---

## Conclusion & Your Turn

You now have a complete overview of how "Voices of Truth" is built with a modern, server-centric architecture. You've seen how we:
1.  Define data structures with TypeScript.
2.  Perform data filtering on the server using Server Components.
3.  Use a **stateful Client Component** to manage user input.
4.  Use `useRouter` to create a reactive loop where client-side actions trigger server-side data filtering.

**Your next task:**
Explore the `FilterBar` and its child components (`CategoryFilter`, etc.). See how the `onCategoryChange` prop is passed down and connected to the `<select>` element's `onChange` event. This is the final link in the chain from a user's click to a full data refresh.

