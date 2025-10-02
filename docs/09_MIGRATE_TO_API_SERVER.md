# GUIDE: Refactoring to a Client-Side Data Fetching Model

Hello! As our application grows, it's time to evolve our architecture. This guide will walk you through refactoring our data filtering from being coupled with Server Components to a more flexible model where our client-side components fetch data from a dedicated API endpoint.

### Why This Change?

Currently, our `page.tsx` Server Component handles all filtering based on URL `searchParams`. This is a simple and effective pattern for server-rendered apps. However, by creating a separate API, we gain several advantages:

*   **Separation of Concerns:** Our data logic (backend) will be completely separate from our presentation logic (frontend).
*   **Improved User Experience:** We can manage loading and error states on the client with more control, preventing full-page reloads for simple filter changes.
*   **Scalability:** A dedicated API is easier to maintain, test, and can even be used by other applications (like a mobile app) in the future.

We will explore two ways to do this:
1.  **The Native Approach:** Using React's built-in `useState` and `useEffect` hooks with `fetch`.
2.  **The Best Practice (SWR):** Using `SWR`, a lightweight data-fetching library from Vercel (the creators of Next.js), which simplifies our code and adds many performance benefits out-of-the-box.

---

## Step 1: Create the API Endpoint

First, let's create the API endpoint that will serve our scholar data. This part is the same regardless of which client-side method you choose. We'll move the filtering logic that currently lives in `page.tsx` here.

**Create the file `src/app/api/scholars/route.ts`:**

```typescript
// src/app/api/scholars/route.ts
import { NextResponse } from 'next/server';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Scholar } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get filter values from the request's query parameters.
  const query = searchParams.get('query') || '';
  const country = searchParams.get('country');
  const lang = searchParams.get('lang');
  const category = searchParams.get('category');

  const searchQuery = query.toString().toLowerCase();

  // Filter the scholars on the server
  const filteredScholars = scholars.filter(scholar => {
    const scholarNameEn = scholar.name.en.toLowerCase();
    const scholarNameAr = scholar.name.ar.toLowerCase();
    const matchSearch = scholarNameEn.includes(searchQuery) || scholarNameAr.includes(searchQuery);

    const countryId = country ? countries.find(c => c.en === country)?.id : undefined;
    const matchCountry = country ? scholar.countryId === countryId : true;

    const matchesLang = lang ? scholar.language.includes(lang) : true;

    const categoryId = category ? specializations.find(s => s.en === category)?.id : undefined;
    const matchesCategory = category ? scholar.categoryId === categoryId : true;

    return matchSearch && matchCountry && matchesLang && matchesCategory;
  });

  // Return the filtered data as JSON.
  return NextResponse.json(filteredScholars as Scholar[]);
}
```
You can test this by running your dev server and visiting `http://localhost:3000/api/scholars`.

---

## Step 2: The Native Client-Side Fetching Approach

Let's first refactor `HomePageClient.tsx` using only native React hooks. This is important to understand the fundamentals.

**Modify `src/app/[locale]/HomePageClient.tsx`:**

```tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
import { Scholar } from "@/types";
import ScholarCardSkeleton from '@/components/ScholarCardSkeleton';

const HomePageClient: React.FC<any> = ({ uniqueCountries, uniqueLanguages, uniqueCategories }) => {
  // 1. State for scholars, loading, and the current filters
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    country: '',
    lang: '',
    category: '',
  });

  // 2. useEffect to fetch data whenever the `filters` state changes
  useEffect(() => {
    const fetchScholars = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(filters);
      try {
        const response = await fetch(`/api/scholars?${params.toString()}`);
        const data = await response.json();
        setScholars(data);
      } catch (error) {
        console.error("Failed to fetch scholars:", error);
        // Here you could set an error state to show a message to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholars();
  }, [filters]); // This dependency array is key!

  // 3. This function now just updates the local `filters` state
  const handleFilterChange = useCallback((name: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  }, []);

  return (
    <div className="space-y-8">
      <FilterBar
        // ... pass props ...
        onCountryChange={(country) => handleFilterChange("country", country)}
        onCategoryChange={(category) => handleFilterChange("category", category)}
        onLanguageChange={(lang) => handleFilterChange("lang", lang)}
        onSearchChange={(query) => handleFilterChange("query", query)}
      />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => <ScholarCardSkeleton key={index} />)}
        </div>
      ) : (
        <ScholarList scholars={scholars} countries={countries} />
      )}
    </div>
  );
};

export default HomePageClient;
```

This works, but notice the boilerplate. We have to manually manage loading state, error state (which we haven't even fully implemented), and the fetched data itself. For a more robust solution, let's look at SWR.

---

## Step 3: The Best Practice with SWR

SWR (Stale-While-Revalidate) is a data fetching library from Vercel. It simplifies our code and gives us caching, automatic re-fetching, loading/error states, and more, for free. This is the approach we should use for a production-ready application.

**3.1. Install SWR**

First, add it to the project.
```bash
pnpm add swr
```

**3.2. Refactor `HomePageClient` with `useSWR`**

Now, let's simplify our component significantly.

```tsx
"use client";

import { useState, useCallback } from 'react';
import useSWR from 'swr'; // 1. Import useSWR
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
import { Scholar } from "@/types";
import ScholarCardSkeleton from '@/components/ScholarCardSkeleton';

// 2. Create a simple fetcher function that SWR will use
const fetcher = (url: string) => fetch(url).then(res => res.json());

const HomePageClient: React.FC<any> = ({ uniqueCountries, uniqueLanguages, uniqueCategories }) => {
  // 3. State for filters remains the same
  const [filters, setFilters] = useState({
    query: '',
    country: '',
    lang: '',
    category: '',
  });

  // 4. Build the API URL and use the useSWR hook
  const params = new URLSearchParams(filters);
  const apiUrl = `/api/scholars?${params.toString()}`;
  const { data: scholars, error, isLoading } = useSWR<Scholar[]>(apiUrl, fetcher);

  // 5. The filter handler is the same
  const handleFilterChange = useCallback((name: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  }, []);

  // 6. Handle error state
  if (error) return <div>Failed to load scholars. Please try again later.</div>;

  // 7. The rest of the component is almost the same!
  return (
    <div className="space-y-8">
      <FilterBar
        // ... pass props ...
        onCountryChange={(country) => handleFilterChange("country", country)}
        onCategoryChange={(category) => handleFilterChange("category", category)}
        onLanguageChange={(lang) => handleFilterChange("lang", lang)}
        onSearchChange={(query) => handleFilterChange("query", query)}
      />
      {/* The isLoading flag comes directly from SWR! */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => <ScholarCardSkeleton key={index} />)}
        </div>
      ) : (
        <ScholarList scholars={scholars || []} countries={countries} />
      )}
    </div>
  );
};

export default HomePageClient;
```
Look how much cleaner that is! The `useSWR` hook replaces our `useEffect` and the `useState` for both `scholars` and `isLoading`. It also gives us a declarative `error` state.

---

## Step 4: Simplify the Server Page

Finally, regardless of the client-side approach you chose, the `page.tsx` Server Component now has a much simpler role. It just needs to render the `HomePageClient` and provide the static data for the filter dropdowns.

**Modify `src/app/[locale]/page.tsx`:**

```tsx
// src/app/[locale]/page.tsx
import HomePageClient from './HomePageClient';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { scholars } from '@/data/scholars';

// This page no longer needs to be async and doesn't need searchParams
export default function HomePage() {
  // We still need to provide the data for the filter dropdowns.
  // In a larger app, this could also come from its own API endpoint.
  const uniqueCountries = [...new Set(scholars.map(s => s.countryId))]
    .map(id => countries.find(c => c.id === id))
    .filter(Boolean);

  const uniqueCategories = [...new Set(scholars.map(s => s.categoryId))]
    .map(id => specializations.find(c => c.id === id))
    .filter(Boolean);

  const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];

  // Note: We are no longer passing the filtered scholars list.
  return (
    <HomePageClient
      uniqueCountries={uniqueCountries}
      uniqueCategories={uniqueCategories}
      uniqueLanguages={uniqueLanguages}
    />
  );
}
```

## Conclusion

Well done! You've now learned how to decouple the client from the server by creating a dedicated API. You've seen both the "native" React way and the more robust, "best practice" way using SWR.

For our project, the SWR approach is preferred. It's more maintainable, more performant, and gives us a better user experience with minimal effort.
