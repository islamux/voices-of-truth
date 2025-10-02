# Tutorial: How Filtering Works in This Project

Welcome! This tutorial will guide you through the filtering mechanism used in the "Voices of Truth" project. We use a powerful pattern that leverages Next.js Server Components for data filtering and Client Components for user interaction, with the URL acting as the "single source of truth" for the filter state.

## High-Level Overview: Server-Side Filtering

Instead of loading all scholars into the browser and filtering them there (which can be slow), we perform the filtering on the server. Here’s the basic flow:

1.  A user selects a filter option in their browser (e.g., chooses a country).
2.  The browser updates the URL to include the filter (e.g., `.../?country=Egypt`).
3.  This URL change tells Next.js to re-render the page on the server.
4.  The server reads the filter from the URL, filters the list of scholars, and sends the *already filtered* list to the browser to be displayed.

This approach is fast and efficient, especially as the number of scholars grows.

---

## The Data Flow: A Step-by-Step Journey

Let's trace what happens when a user filters by "Category".

### Step 1: The User Interaction (Client-Side)

The user interacts with a dropdown menu. This UI is built from a chain of components:

-   **`FilterDropdown.tsx`**: This is the core, reusable `<select>` dropdown component. When a user picks an option, its `onChange` event fires.
-   **`CategoryFilter.tsx`**: This component wraps `FilterDropdown`, providing it with the specific options for categories and a function to call when the selection changes.
-   **`FilterBar.tsx`**: This component simply organizes all the individual filter components (`CategoryFilter`, `CountryFilter`, etc.) into a single bar.

When the user selects a new category, `FilterDropdown`'s `onChange` calls the `onCategoryChange` function that was passed all the way from `HomePageClient.tsx`.

### Step 2: Updating the URL (Client-Side)

The main client-side logic lives in **`src/app/[locale]/HomePageClient.tsx`**. This component is responsible for reacting to user input and updating the URL.

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
// ... other imports

const HomePageClient: React.FC<HomePageClientProps> = ({...}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Define a callback to handle all filter changes.
  const handleFilterChange = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // 2. Push the new URL to the router.
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // 3. Pass the handler to the FilterBar.
  return (
    <div className="space-y-8">
      <FilterBar
        onCategoryChange={(category) => handleFilterChange("category", category)}
        // ... other handlers
      />
      {/* ... */}
    </div>
  );
};
```
This is the key step! Calling `router.push()` with a new URL triggers the server-side part of the process.

### Step 3: The Server Reacts (Server-Side)

The main page component, **`src/app/[locale]/page.tsx`**, is a **Server Component**. It runs on the server every time the page is requested.

1.  **Reading the URL**: It receives `searchParams` as a prop, which contains the filter values from the URL.
    ```tsx
    // src/app/[locale]/page.tsx
    export default async function HomePage({ searchParams }: HomePageProps) {
      const { query, country, lang, category } = await searchParams;
      // ...
    }
    ```

2.  **Filtering the Data**: It then uses this information to filter the main `scholars` array directly on the server.
    ```tsx
    // src/app/[locale]/page.tsx
    const filteredScholars = scholars.filter(scholar => {
      // ... filtering logic for search, country, lang ...

      const categoryId = category ? specializations.find(s => s.en === category)?.id : undefined;
      const matchesCategory = category ? scholar.categoryId === categoryId : true;

      return matchSearch && matchCountry && matchesLang && matchesCategory;
    });
    ```

### Step 4: Rendering the Result

Finally, the server component passes the filtered data down to the client component for rendering.

```tsx
// src/app/[locale]/page.tsx
export default async function HomePage(...) {
  // ... filtering happens above ...

  // Pass the *already filtered* data to the client component.
  return (
    <HomePageClient
      scholars={filteredScholars as Scholar[]}
      // ... other props
    />
  );
}
```

The `HomePageClient` receives the new, smaller list of scholars and renders it using the `ScholarList` component. The user sees an updated list of scholars that matches their selection, and the URL in their address bar reflects the current filter state.

---

## Summary

This "URL as State" pattern combined with Server-Side Filtering is a modern and highly effective way to build data-driven applications in Next.js.

-   **Performance**: The server handles the heavy lifting of filtering, so the client-side remains fast and responsive.
-   **Shareable URLs**: Since the filter state is in the URL, users can bookmark or share links to specific filtered views.
-   **Clean Architecture**: It creates a clear separation of concerns:
    -   **Server (`page.tsx`)**: Data fetching and filtering.
    -   **Client (`HomePageClient.tsx`)**: UI interaction and URL management.
    -   **UI Components (`Filter*.tsx`)**: Reusable and focused on presentation.
