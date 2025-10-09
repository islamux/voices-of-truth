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
pnpm add i18next react-i18next i18next-resources-to-backend framer-motion react-icons
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
  [key: string]: string | number;
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

export const scholars: Scholar[] = allScholars;
```

---

## Step 4: Internationalization (i18n) and Middleware

Our app supports English and Arabic. This is handled by a combination of a middleware and a helper function.

**`src/middleware.ts`**: This file is responsible for redirecting users to their preferred language. If a user visits `/`, it checks their browser's language and redirects them to `/en` or `/ar`.

**`src/lib/i18n.ts`**: This helper sets up `i18next` to load the correct translation files from the `public/locales` directory based on the `[locale]` parameter in the URL.

---

## Step 5: Server-Side Filtering with Server Components

A major architectural shift in this project was moving from client-side filtering to **server-side filtering**. This improves performance by sending only the necessary data to the client.

This logic now lives in `src/app/[locale]/page.tsx`, which is a **Server Component**.

```tsx
// src/app/[locale]/page.tsx
import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
// ... other data imports

interface HomePageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
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

    const countryId = country ? countries.find(c => c.en === country)?.id : undefined;
    const matchCountry = country ? scholar.countryId === countryId : true;

    const matchesLang = lang ? scholar.language.includes(lang as string) : true;

    const categoryId = category ? specializations.find(s => s.en === category)?.id : undefined;
    const matchesCategory = category ? scholar.categoryId === categoryId : true;

    return matchSearch && matchCountry && matchesLang && matchesCategory;
  });

  // 3. Prepare data for the client (e.g., for filter dropdowns)
  const uniqueCountries = /* ... logic to get unique countries ... */;
  const uniqueCategories = /* ... logic to get unique categories ... */;
  const uniqueLanguages = /* ... logic to get unique languages ... */;

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

---

## Step 6: The Interactive Client Component

While the server handles filtering, the `HomePageClient.tsx` component is responsible for managing user interaction and telling the server when to re-filter the data.

Here’s how it works:

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
      // Create a mutable copy of the current search params
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
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

**Key Concept: The Client-Server Interaction Loop**
1.  **User Action:** The user selects a category in the `FilterBar`.
2.  **Event Handler:** The `onCategoryChange` callback fires, calling `handleFilterChange('category', 'islamic-thought')`.
3.  **URL Update:** `handleFilterChange` constructs the new URL query string and `router.push()` changes the URL (e.g., to `/en?category=islamic-thought`).
4.  **Server Reruns:** Next.js detects the URL change and re-renders the Server Component (`page.tsx`) with the new `searchParams`.
5.  **New Data:** The server filters the data and passes the new, smaller list down to `HomePageClient`.
6.  **UI Update:** The client re-renders with the new `scholars` prop.

---

## Conclusion & Your Turn

You now have a complete overview of how "Voices of Truth" is built with a modern, server-centric architecture. You've seen how we:
1.  Define data structures with TypeScript.
2.  Perform data filtering on the server using Server Components.
3.  Use a **stateful Client Component** to manage user input.
4.  Use `useRouter` to create a reactive loop where client-side actions trigger server-side data filtering.

**Your next task:**
Explore the `FilterBar` and its child components (`CategoryFilter`, etc.). See how the `onCategoryChange` prop is passed down and connected to the `<select>` element's `onChange` event. This is the final link in the chain from a user's click to a full data refresh.
