# Proposal: Implementing a Loading State

> **Status:** 🗄️ Archived — Suspense boundary implemented instead (ms1_029). See `src/app/[locale]/page.tsx` for the `<Suspense>` wrapper.
> **Note:** This proposal is superseded. The `useScholars` hook no longer exists; filtering logic lives in the server component. A `<Suspense>` boundary was added in `page.tsx` per Next.js `useSearchParams` requirements. Loading skeletons are not needed because filtering is instant server-side with static data.

This guide explains how to add a loading indicator to the application. This improves user experience by showing that content is being prepared, especially if data processing takes a noticeable amount of time or if you switch to fetching data from an API in the future.

## Step 1: Introduce a Loading State in `HomePageClient`

Since filtering is done server-side and data arrives via props, the loading state would trigger when the page initially renders or when URL params change.

**Modify `src/app/[locale]/HomePageClient.tsx`:**

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Scholar, Country, Specialization } from "@/types";
import ScholarList from "@/components/ScholarList";
import FilterBar from "@/components/FilterBar";
import ScholarCardSkeleton from "@/components/ScholarCardSkeleton";
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
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Show loading state when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    window.history.pushState(null, '', `${window.location.pathname}${query}`);
  };

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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ScholarCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <ScholarList scholars={scholars} countries={countries} />
      )}
    </FilterProvider>
  );
}
```

## Step 2: Create a Skeleton Loader for `ScholarCard`

**Create `src/components/ScholarCardSkeleton.tsx`:**

```tsx
import React from 'react';

const ScholarCardSkeleton = () => {
  return (
    <div className="border rounded-lg shadow-lg p-5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mb-4"></div>
        <div className="h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-700 mb-2"></div>
        <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
        <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700 mb-2"></div>
        <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
        <div className="flex space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default ScholarCardSkeleton;
```

## Step 3: Explanation

- When `searchParams` change (user applies a filter), `isLoading` is set to `true`
- After 300ms, it reverts to `false`, showing the filtered results
- This gives a smooth transition feel for filter changes
- For initial page load with server data, loading is instant (already fetched server-side)
- If switching to API-based data fetching, replace the `setTimeout` with your fetch lifecycle

This approach provides a much smoother and more professional-looking loading experience for the user.
