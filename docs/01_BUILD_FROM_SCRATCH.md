# Tutorial: Building "Voices of Truth" From Scratch

Welcome, junior developer! This document is your guide to rebuilding the "Voices of Truth" project. The goal is for you to understand the architecture, data flow, and component-based structure of a modern Next.js application.

We'll focus on the "how" and "why" of the code, not the initial project setup.

**Our Tech Stack:**
*   **Framework:** Next.js 15+ (with App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** React
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
│   ├── app/            # Next.js App Router pages and layouts
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
  id: string;
  name: Record<string, string>; // e.g., { en: "Name", ar: "الاسم" }
  socialMedia: { /* ... */ }[];
  countryId: number;
  language: string[];
  avatarUrl: string;
  bio?: Record<string, string>;
  categoryId: number;
}
```
**Why `Record<string, string>`?** This is a simple and effective way to support multiple languages for a single field. The `key` is the language code (e.g., 'en', 'ar'), and the `value` is the translated text.

---

## Step 3: Creating the Data Source

Our app uses static data stored in files. We organize it by category in `src/data/scholars/` and then combine it all into one master list in `src/data/scholars.ts`.

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

## Step 4: Server-Side Filtering with Server Components

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
    // ... filtering logic based on searchQuery, country, lang, category
    return true; // placeholder for actual logic
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
    />
  );
}
```

### Important Lesson: `searchParams` in Next.js 15

You might have noticed `const { query, country, lang, category } = await searchParams;`.

In Next.js 15, the `searchParams` object in Server Components is **asynchronous**. You **must `await` it** before you can access its properties. Forgetting this will cause an error. This is a key change from previous versions.

---

## Step 5: The Stateful Client Component

While the heavy lifting of filtering happens on the server, the `HomePageClient.tsx` component is the "brain" of the user interaction. It's a **stateful Client Component** responsible for managing the user's filter selections and telling the server when to re-filter the data.

Here’s how it works:

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
import { Scholar } from "@/types";

// ... (interface definition) ...

const HomePageClient = ({ scholars, ... }: HomePageClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. State Management: Initialize state from URL search params.
  const [category, setCategory] = useState(searchParams.get('category') || '');
  // ... (state for other filters: searchQuery, country, lang)

  // 2. URL Syncing: This effect watches for changes in the filter state.
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (category) newSearchParams.set('category', category);
    // ... (set other params if they exist)

    // 3. Trigger Re-render: Push the new URL to the router.
    // This tells Next.js to re-render the server component with new searchParams.
    router.push(`?${newSearchParams.toString()}`);
  }, [category, router, /* other state variables */]);

  // 4. Event Handlers: These functions update the state when a user interacts with the FilterBar.
  const handleCategoryChange = (selectedCategory: string) => setCategory(selectedCategory);

  return (
    <div className="container ...">
      <h1 className='text-4xl ...'>Voices of Truth</h1>

      <FilterBar
        // ... (pass down unique values for dropdowns)
        onCategoryChange={handleCategoryChange}
        // ... (pass other change handlers)
      />

      <ScholarList scholars={scholars} />
    </div>
  );
};

export default HomePageClient;
```

**Key Concept: The Client-Server Interaction Loop**
1.  **User Action:** The user selects a category in the `FilterBar`.
2.  **State Update:** The `onCategoryChange` callback fires, calling `setCategory()`.
3.  **Effect Triggered:** The `useEffect` hook detects a change in the `category` state.
4.  **URL Update:** `router.push()` changes the URL (e.g., to `/?category=islamic-thought`).
5.  **Server Reruns:** Next.js detects the URL change and re-renders the Server Component (`page.tsx`) with the new `searchParams`.
6.  **New Data:** The server filters the data and passes the new, smaller list down to `HomePageClient`.
7.  **UI Update:** The client re-renders with the new `scholars` prop.

---

## Conclusion & Your Turn

You now have a complete overview of how "Voices of Truth" is built with a modern, server-centric architecture. You've seen how we:
1.  Define data structures with TypeScript.
2.  Perform data filtering on the server using Server Components.
3.  Use a **stateful Client Component** to manage user input.
4.  Use `useState`, `useEffect`, and `useRouter` to create a reactive loop where client-side actions trigger server-side data filtering.

**Your next task:**
Explore the `FilterBar` and its child components (`CategoryFilter`, etc.). See how the `onCategoryChange` prop is passed down and connected to the `<select>` element's `onChange` event. This is the final link in the chain from a user's click to a full data refresh.