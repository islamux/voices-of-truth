# Refactoring Prop Drilling: A Step-by-Step Guide

Hello! This document is a hands-on tutorial to guide you through refactoring our `FilterBar` component. We will eliminate "prop drilling" by implementing React's native Context API. Follow these steps to make our code cleaner and more maintainable.

## The Goal

Our goal is to stop passing props through `FilterBar.tsx` and instead make the filter data and functions available directly to the components that need them.

## The Plan

We will perform this refactor in four main steps:

1.  **Create a `FilterContext`** to define and hold our shared state.
2.  **Provide the Context** in the `HomePageClient.tsx` component.
3.  **Refactor `FilterBar.tsx`** to be a simple layout component.
4.  **Refactor the child filter components** to consume the context.

---

## Step 1: Create the `FilterContext` File

First, we need to create a home for our new context. This file will define the "shape" of our shared data, create the context itself, and export a provider and a custom hook.

**Action:** Create a new file named `FilterContext.tsx` inside the `src/context/` directory.

**Code:** Copy the following code into `src/context/FilterContext.tsx`.

```tsx
// src/context/FilterContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

// 1. Define the "shape" of the context data.
// This interface ensures type safety for our context.
export interface FilterContextType {
  uniqueCountries: Array<{ value: string; label: string }>;
  uniqueLanguages: string[];
  uniqueCategories: Array<{ value: string; label: string }>;
  onCountryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

// 2. Create the actual context.
// We initialize it with `null` because the real value will be provided by the component below.
const FilterContext = createContext<FilterContextType | null>(null);

// 3. Create a custom hook for easy access.
// This is a best practice that makes consuming the context cleaner and safer.
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    // This error is a safeguard. It will let us know if we ever try to use
    // this hook outside of a component wrapped in our provider.
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

// 4. Create the Provider component.
// This is the component that will wrap our application tree and provide the context value.
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

---

## Step 2: Provide the Context in `HomePageClient.tsx`

Now that we have our `FilterProvider`, we need to use it. We will wrap our page components with it. The data it provides will be prepared on the server and passed down as props.

**Action:** Modify the `src/app/[locale]/HomePageClient.tsx` file.

**Code:** Replace the content of `HomePageClient.tsx` with the following. Notice that it no longer performs any data mapping.

```tsx
// src/app/[locale]/HomePageClient.tsx (Refactored)

'use client';

import { Scholar, Country } from "@/types";
import ScholarList from "@/components/ScholarList";
import FilterBar from "@/components/FilterBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterProvider } from '@/context/FilterContext';

interface HomePageClientProps {
  scholars: Scholar[];
  countries: Country[];
  // Data is now pre-processed by the server and passed as props
  uniqueCountries: { value: string; label: string }[];
  uniqueCategories: { value: string; label: string }[];
  uniqueLanguages: string[];
}

export default function HomePageClient({
  scholars,
  countries,
  uniqueCountries,
  uniqueCategories,
  uniqueLanguages
}: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

// Function to handle filter changes and update the URL accordingly (key = filter type, value = selected value)
  const handleFilterChange = (key: string, value: string) => { 
  
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    // Update or delete the filter based on the value
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    
    const search = current.toString(); // Get the updated query string
    const query = search ? `?${search}` : ''; // Format it properly
    router.push(`${pathname}${query}`); // Navigate to the new URL
  };

  // No more mapping! The data is ready to be used directly in the context value.
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
    // Wrap the components in the provider and pass the context value.
    <FilterProvider value={filterContextValue}>
      <FilterBar /> {/* Notice: No more props are being drilled! */}
      <ScholarList scholars={scholars} countries={countries} />
    </FilterProvider>
  );
}
```

---

## Step 3: Refactor `FilterBar.tsx`

This is the most satisfying step. We can now completely clean up the `FilterBar` component, removing all the props it was just passing through.

**Action:** Modify the `src/components/FilterBar.tsx` file.

**Code:** Replace the content of `FilterBar.tsx` with this much simpler version.

```tsx
// src/components/FilterBar.tsx (Refactored)

"use client";

import CountryFilter from './filters/CountryFilter';
import LanguageFilter from './filters/LanguageFilter';
import CategoryFilter from './filters/CategoryFilter';
import SearchInput from './filters/SearchInput';

// Look how clean this is! It has no props and its only job
// is to act as a layout container for the filter components.
export default function FilterBar() {
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

---

## Step 4: Refactor the Child Filter Components

Finally, we update the individual filter components to get their data from our `useFilters` hook instead of from props.

**Action:** Modify the filter components inside `src/components/filters/`.

**Code Example (`CountryFilter.tsx`):** Here is how you would update `CountryFilter.tsx`. Apply the same logic to `LanguageFilter.tsx`, `CategoryFilter.tsx`, and `SearchInput.tsx`.

```tsx
// src/components/filters/CountryFilter.tsx (Refactored)

import { useFilters } from '@/context/FilterContext'; // Import our custom hook
import { useTranslation } from "react-i18next";
import FilterDropdown from "./FilterDropdown";

export default function CountryFilter() {
  // Call the hook to get the data and functions directly from the context.
  const { uniqueCountries, onCountryChange } = useFilters();
  const { t } = useTranslation('common');

  return (
    <FilterDropdown
      label={t('filterByCountry')}
      filterKey="country"
      options={uniqueCountries} // Use the data from context
      onChange={onCountryChange}  // Use the function from context
    />
  );
}
```

---

## Conclusion

Congratulations! You have successfully refactored the filter components to use the React Context API. You have eliminated prop drilling, made the code more maintainable, and improved the overall architecture.

### The Benefits

-   **No More Prop Drilling**: `FilterBar` is now a clean layout component.
-   **Improved Maintainability**: Adding a new filter is much easier.
-   **Centralized Logic**: The state is managed in one place and provided to all.
-   **Readability**: It is now much clearer where components get their data from.
