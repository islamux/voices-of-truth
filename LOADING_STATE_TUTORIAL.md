# Tutorial: Implementing a Loading State

This guide explains how to add a loading indicator to the application. This improves user experience by showing that content is being prepared, especially if data processing takes a noticeable amount of time or if you switch to fetching data from an API in the future.

## Step 1: Introduce a Loading State in `useScholars` Hook

We'''ll add a new state variable to our `useScholars` hook to track whether the initial data processing is complete.

**Modify `src/app/hooks/useScholars.ts`:**

```typescript
// src/app/hooks/useScholars.ts
import { useMemo, useState, useEffect } from "react"; // 1. Import useEffect
import { useTranslation } from "react-i18next";
import { scholars } from "@/data/scholars";
import { countries } from "@/data/countries";
import { specializations } from "@/data/specializations";

export const useScholars = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const [isLoading, setIsLoading] = useState(true); // 2. Add isLoading state
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Set loading to false after initial setup
  useEffect(() => {
    // Since our data is loaded synchronously, we can set loading to false right away.
    // If you were fetching data from an API, you would set this to false
    // in the .then() or finally() block of your fetch call.
    setIsLoading(false);
  }, []);

  // ... (rest of the hook is the same)
  const filteredScholars = useMemo(() => { /* ... */ });
  const uniqueCountries = useMemo(() => { /* ... */ }, [currentLang]);
  const uniqueLanguages = useMemo(() => { /* ... */ }, []);
  const uniqueCategories = useMemo(() => { /* ... */ }, [currentLang]);

  return {
    isLoading, // 4. Return the loading state
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

## Step 2: Create a Skeleton Loader for `ScholarCard`

A skeleton loader provides a better user experience than a simple spinner because it mimics the layout of the content that is about to appear.

**Create the file `src/components/ScholarCardSkeleton.tsx`:**

```tsx
// src/components/ScholarCardSkeleton.tsx
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

## Step 3: Conditionally Render in `HomePageClient`

Now, let'''s use the `isLoading` state in `HomePageClient.tsx` to show the skeleton loaders.

**Modify `src/app/[locale]/HomePageClient.tsx`:**

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import { useScholars } from "../hooks/useScholars";
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
import ScholarCardSkeleton from "@/components/ScholarCardSkeleton"; // 1. Import skeleton

const HomePageClient = () => {
  const {
    isLoading, // 2. Get isLoading state
    filteredScholars,
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange,
    onLanguageChange,
    onCategoryChange,
    onSearchChange,
  } = useScholars();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className='text-4xl font-bold text-center mb-8'>Voices of Truth</h1>
      <FilterBar 
        uniqueCountries={uniqueCountries}
        uniqueLanguages={uniqueLanguages}
        uniqueCategories={uniqueCategories}
        onCountryChange={onCountryChange}
        onLanguageChange={onLanguageChange}
        onCategoryChange={onCategoryChange} 
        onSearchChange={onSearchChange}
      />

      {/* 3. Conditional rendering */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Render a few skeleton cards to fill the screen */}
          {Array.from({ length: 8 }).map((_, index) => (
            <ScholarCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <ScholarList scholars={filteredScholars} />
      )}
    </div>
  );
};

export default HomePageClient;
```

**Explanation:**
*   We get the `isLoading` flag from the `useScholars` hook.
*   If `isLoading` is `true`, we render a grid of `ScholarCardSkeleton` components. `Array.from({ length: 8 })` is a simple way to create an array of 8 items to map over.
*   If `isLoading` is `false`, we render the actual `ScholarList`.

This approach provides a much smoother and more professional-looking loading experience for the user.
