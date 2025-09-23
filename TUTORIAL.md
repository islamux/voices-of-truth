# Tutorial: Building "Voices of Truth" From Scratch

Welcome, junior developer! This document is your guide to rebuilding the "Voices of Truth" project. The goal of this exercise is for you to understand the architecture, data flow, and component-based structure of a modern Next.js application.

We'll be focusing on the "how" and "why" of the code, not the initial project setup.

**Our Tech Stack:**
*   **Framework:** Next.js 14+ (with App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** React
*   **Internationalization (i18n):** `i18next` and `react-i18next`

---

## Step 1: Project Structure & Configuration

First, let's understand the layout of the project. A clean structure is key to a maintainable application.

```
/
├── public/             # Static assets (images, fonts, and translation files)
│   ├── avatars/
│   └── locales/
├── src/                # Our main application source code
│   ├── app/            # Next.js App Router pages and layouts
│   ├── components/     # Reusable React components
│   ├── data/           # Static data for our scholars
│   ├── lib/            # Helper functions and libraries (like i18n setup)
│   └── types/          # TypeScript type definitions
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

### Configuration Files

*   **`tsconfig.json`**: Configures TypeScript. We use it to set our target JavaScript version, define module resolution, and enable strict type checking, which helps catch errors early.
*   **`next.config.ts`**: Basic configuration for Next.js. For now, it just enables `reactStrictMode`.
*   **`tailwind.config.ts`**: Configures Tailwind CSS. We tell it where our component and page files are so it can scan them and generate the necessary CSS classes.

---

## Step 2: Defining Our Data (The "Model")

Before we build anything, we need to define the shape of our data. What information does a "scholar" have? We define this in `src/types/index.ts`.

```typescript
// src/types/index.ts
export interface Scholar {
  id: string;
  name: Record<string, string>; // { en: "Name", ar: "الاسم" }
  socialMedia: {
    platform: string;
    link: string;
    icon?: string;
  }[];
  country: Record<string, string>;
  language: string[];
  avatarUrl: string;
  bio?: Record<string, string>;
  category: {
    [key: string]: string;
  };
}
```
**Why `Record<string, string>`?** This allows us to have multi-language support for fields like `name`, `country`, and `bio`. The `key` is the locale (e.g., 'en', 'ar'), and the `value` is the translation.

---

## Step 3: Creating the Data Source

Our app uses static data. We organize it by category in the `src/data/scholars/` directory and then combine it all into one master list.

1.  **Category Files (e.g., `src/data/scholars/hadith-studies.ts`)**: Each file contains an array of `Scholar` objects for that specific category.

2.  **Main Data File (`src/data/scholars.ts`)**: This file imports all the individual scholar arrays and exports a single, combined array. This makes our data management clean and modular.

```typescript
// src/data/scholars.ts
import { Scholar } from '../types';
import { hadithStudiesScholars } from './scholars/hadith-studies';
// ... import all other categories

export const scholars: Scholar[] = [
  ...hadithStudiesScholars,
  // ... spread all other imported arrays
];
```

---

## Step 4: Building Reusable UI Components

Components are the building blocks of our app.

### The `ScholarCard` Component

This component is responsible for displaying a single scholar. It's a "dumb" component—it just receives data (`props`) and displays it.

```tsx
// src/components/ScholarCard.tsx
"use client";

import Image from 'next/image';
import { Scholar } from '../types';
// ... other imports

interface ScholarCardProps {
  scholar: Scholar;
  currentLang: string;
}

const ScholarCard: React.FC<ScholarCardProps> = ({ scholar, currentLang }) => {
  const name = scholar.name[currentLang] || scholar.name['en'];
  const country = scholar.country[currentLang] || scholar.country['en'];

  return (
    <div className="border rounded-lg p-5 ...">
      <Image
        src={scholar.avatarUrl || '/avatars/default-avatar.png'}
        alt={`${name}'s avatar`}
        width={112}
        height={112}
        className="rounded-full ..."
      />
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{country}</p>
      {/* ... other details and social media links */}
    </div>
  );
};

export default ScholarCard;
```
**Key Points:**
*   `"use client"`: We mark this as a Client Component because it uses `framer-motion` for animations, which requires browser APIs.
*   **Props:** It takes a `scholar` object and the `currentLang` to display the correct translation.
*   **Fallback Logic:** `scholar.name[currentLang] || scholar.name['en']` ensures that if a translation is missing, it defaults to English.

---

## Step 5: Internationalization (i18n)

This is a core feature. We need to handle different languages (`en` and `ar`).

### 1. The Middleware (`src/middleware.ts`)

The middleware runs on every request. Its job is to figure out the user's preferred language and redirect them to the correct URL (e.g., `/en` or `/ar`).

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the URL is missing a locale (e.g., /, /about)
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If it's missing, redirect to the detected or default locale
  if (pathnameIsMissingLocale) {
    const locale = /* logic to get locale from headers */;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  // Don't run middleware on static files or API routes
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
```

### 2. The i18n Setup (`src/lib/i18n.ts`)

This file configures `i18next`. It sets up how to load our translation files (`.json` files from `/public/locales`).

### 3. The Root Layout (`src/app/[locale]/layout.tsx`)

This is a Server Component layout that wraps our pages. It gets the `locale` from the URL, fetches the correct translations on the server, and provides them to all client components down the tree using a React Context Provider (`I18nProviderClient`).

```tsx
// src/app/[locale]/layout.tsx
import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;
  const { resources } = await getTranslation(locale); // Fetch translations on server

  return (
    <I18nProviderClient locale={locale} resources={resources}>
      {children}
    </I18nProviderClient>
  );
}
```

---

## Step 6: Assembling the Main Page

Now we put all the pieces together.

### 1. The Page (`src/app/[locale]/page.tsx`)

This is a simple Server Component. Its only job is to render our main client component.

```tsx
// src/app/[locale]/page.tsx
import HomePageClient from './HomePageClient';

export default function HomePage() {
  return <HomePageClient />;
}
```

### 2. The Client Page (`src/app/[locale]/HomePageClient.tsx`)

This is where the magic happens. This component manages the state for our filters and displays the list of scholars.

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import React, { useState, useEffect } from 'react';
import ScholarCard from '../../components/ScholarCard';
import FilterBar from '../../components/FilterBar';
import { scholars as allScholarsData } from '../../data/scholars';
import { useTranslation } from 'react-i18next';

const HomePageClient = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;

  // State for filters
  const [selectedCountry, setSelectedCountry] = useState('');
  // ... other filter states

  const [displayedScholars, setDisplayedScholars] = useState(allScholarsData);

  // useEffect to apply filters whenever a selection changes
  useEffect(() => {
    let result = allScholarsData;
    if (selectedCountry) {
      result = result.filter(/* filter logic */);
    }
    // ... other filter logic
    setDisplayedScholars(result);
  }, [selectedCountry, /* other dependencies */]);

  return (
    <Layout>
      <FilterBar /* pass filter data and change handlers */ />
      <div className="grid ...">
        {displayedScholars.map(scholar => (
          <ScholarCard key={scholar.id} scholar={scholar} currentLang={lang} />
        ))}
      </div>
    </Layout>
  );
}

export default HomePageClient;
```
**Key Concepts:**
*   **`"use client"`**: This component needs to be a client component because it uses React hooks (`useState`, `useEffect`) for interactivity.
*   **State Management**: `useState` holds the current value of each filter.
*   **Filtering Logic**: `useEffect` runs whenever a filter's state changes. It filters the `allScholarsData` array and updates the `displayedScholars` state, which causes the component to re-render with the filtered list.

---

## Conclusion & Your Turn

You now have a complete overview of how "Voices of Truth" is built. You've seen how we:
1.  Define data structures with TypeScript.
2.  Organize and import static data.
3.  Build isolated, reusable UI components.
4.  Implement a robust i18n system with middleware and providers.
5.  Separate concerns between Server and Client components.

**Your next task:**
Try to add a new scholar to one of the data files. See how the application automatically updates. Then, try adding a new filter, for example, by a scholar's main field of study.

Good luck!
