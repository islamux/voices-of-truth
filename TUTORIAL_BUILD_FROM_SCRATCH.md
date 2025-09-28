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

## Step 5: The "Dumb" Client Component

With the filtering logic on the server, our `HomePageClient.tsx` becomes a "dumb" component. It simply receives data as props and renders the UI. It doesn't know how the data was filtered; it just displays what it's given.

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import { Scholar } from "@/types";
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";

interface HomePageClientProps {
  scholars: Scholar[];
  uniqueCountries: { value: string; label: string }[];
  uniqueCategories: { value: string; label: string }[];
  uniqueLanguages: string[];
}

const HomePageClient = ({
  scholars,
  uniqueCountries,
  uniqueCategories,
  uniqueLanguages,
}: HomePageClientProps) => {
  // This component no longer has any filtering logic!
  // It just receives props and renders UI.
  return (
    <div className="container ...">
      <h1 className='text-4xl ...'>Voices of Truth</h1>

      <FilterBar
        uniqueCountries={uniqueCountries}
        uniqueLanguages={uniqueLanguages}
        uniqueCategories={uniqueCategories}
        // Note: The filter bar now needs to update the URL
        // to trigger a new server-side render with new searchParams.
      />

      <ScholarList scholars={scholars} />
    </div>
  );
};

export default HomePageClient;
```

**Key Concept: Server vs. Client Components**
*   **Server Components (`page.tsx`):** Run on the server. Good for data fetching, accessing databases, and keeping sensitive logic off the client.
*   **Client Components (`HomePageClient.tsx`):** Run on the client (the browser). Needed for interactivity, state, and browser-only APIs.

---

## Conclusion & Your Turn

You now have a complete overview of how "Voices of Truth" is built with a modern, server-centric architecture. You've seen how we:
1.  Define data structures with TypeScript.
2.  Perform data filtering on the server using Server Components.
3.  Handle asynchronous `searchParams` in Next.js 15.
4.  Pass data down to "dumb" Client Components for rendering.

**Your next task:**
Explore the `FilterBar` component. How does it update the URL when a filter is changed? (Hint: Look for `useRouter` or `window.location`). Understanding this is key to seeing how the client tells the server to re-filter the data.

Good luck!