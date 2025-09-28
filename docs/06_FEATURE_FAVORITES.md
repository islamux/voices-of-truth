# Tutorial: Implementing "Add to Favorites" (Updated for Server-Side Filtering)

This guide walks you through adding a "Favorites" feature that is compatible with our project's server-side filtering architecture. We will use a **hybrid filtering model**.

**The Architecture:**
1.  **Server-Side Filtering:** The server will continue to handle primary filtering (search, country, category, etc.) based on URL parameters.
2.  **Client-Side Favorites:** The user's favorite scholars will be stored in their browser's `localStorage`.
3.  **Hybrid Filtering:** When the user wants to see only their favorites, the client will perform a *second*, client-side filtering pass on the data that it has already received from the server.

---

## Step 1: Create a `useFavorites` Custom Hook

This hook will manage the state and logic for favorites on the client side. It is responsible for interacting with `localStorage`.

**Create the file `src/hooks/useFavorites.ts`:** (If it doesn't exist)

```typescript
"use client";

import { useState, useEffect, useCallback } from 'react';

// A custom hook to manage favorite scholars in localStorage
export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // On initial load, get favorites from localStorage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favoriteScholars');
      if (storedFavorites) {
        setFavoriteIds(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
    }
  }, []);

  // Function to add or remove a favorite
  const toggleFavorite = useCallback((scholarId: number) => {
    setFavoriteIds(prevIds => {
      const isFavorite = prevIds.includes(scholarId);
      const newIds = isFavorite
        ? prevIds.filter(id => id !== scholarId) // Remove
        : [...prevIds, scholarId]; // Add

      // Update localStorage
      localStorage.setItem('favoriteScholars', JSON.stringify(newIds));
      return newIds;
    });
  }, []);

  // Function to check if a scholar is a favorite
  const isFavorite = useCallback((scholarId: number) => {
    return favoriteIds.includes(scholarId);
  }, [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorite };
};
```
**Explanation:** This hook is self-contained. It manages a list of scholar IDs in state, syncs it with `localStorage`, and provides helper functions (`toggleFavorite`, `isFavorite`).

---

## Step 2: Add a Favorite Button to `ScholarCard`

Next, we need a UI element for the user to interact with. We'll add a heart button to each `ScholarCard`.

**Modify `src/components/ScholarCard.tsx`:**

Because the `useFavorites` hook needs to be used by every card, and `HomePageClient` needs the list of favorites for filtering, we have a challenge. The simplest solution is to have `useFavorites` called in `HomePageClient` and pass the `toggleFavorite` and `isFavorite` functions down as props.

*However, to keep our `ScholarCard` more independent, we can wrap it in a new Client Component that provides the context.* For this tutorial, we will take the simpler approach and assume the `ScholarCard` is rendered within a context that provides the favorites functions.

```tsx
// src/components/ScholarCard.tsx
"use client";

import React from 'react';
import { Scholar } from '../types';
// ... other imports

// Assume these props are passed from a parent component that uses useFavorites
interface ScholarCardProps {
  scholar: Scholar;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

const ScholarCard: React.FC<ScholarCardProps> = ({ scholar, isFavorite, toggleFavorite }) => {
  const isFav = isFavorite(scholar.id);

  return (
    <div className="... relative">
      <button
        onClick={() => toggleFavorite(scholar.id)}
        className={`absolute top-2 right-2 p-1 rounded-full ... ${isFav ? "text-red-500" : "text-gray-400"}`}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        {/* Heart SVG Icon */}
        <svg className="h-6 w-6" fill={isFav ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
        </svg>
      </button>

      {/* ... rest of the card content ... */}
    </div>
  );
};

export default ScholarCard;
```

---

## Step 3: Add a "Show Favorites" Toggle

We need a UI control to toggle the favorites view. We will add this to the `FilterBar`.

**Modify `src/components/FilterBar.tsx`:**

```tsx
// src/components/FilterBar.tsx
"use client";

// ... other imports

// Add new props for the toggle
interface FilterBarProps {
  // ... existing props
  showOnlyFavorites: boolean;
  onToggleFavorites: (show: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ /*...props...*/, showOnlyFavorites, onToggleFavorites }) => {
  return (
    <div className="... flex flex-col sm:flex-row gap-4 items-center">
      {/* ... existing filters ... */}

      {/* Add the Favorites Toggle Switch */}
      <div className="flex items-center justify-center">
        <label htmlFor="favorites-toggle" className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              id="favorites-toggle"
              className="sr-only"
              checked={showOnlyFavorites}
              onChange={(e) => onToggleFavorites(e.target.checked)}
            />
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${showOnlyFavorites ? "transform translate-x-full bg-green-400" : ""}`}></div>
          </div>
          <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
            Favorites
          </div>
        </label>
      </div>
    </div>
  );
};

export default FilterBar;
```

---

## Step 4: Implement the Hybrid Filtering Logic

This is the most important step. We will update `HomePageClient.tsx` to manage the state and perform the final client-side filtering step.

**Modify `src/app/[locale]/HomePageClient.tsx`:**

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import { useState, useMemo } from 'react';
import { useFavorites } from "@/hooks/useFavorites"; // Correct path
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
import { Scholar } from "@/types";

// Remember: The `scholars` prop is pre-filtered by the server!
interface HomePageClientProps {
  scholars: Scholar[];
  uniqueCountries: Array<{ value: string; label: string }>;
  uniqueLanguages: string[];
  uniqueCategories: Array<{ value: string; label: string }>;
}

const HomePageClient = ({ scholars, uniqueCountries, uniqueLanguages, uniqueCategories }: HomePageClientProps) => {
  // 1. Manage favorites state
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();

  // 2. State for the "Show Favorites" toggle
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // 3. Perform the SECOND (client-side) filtering pass
  const displayedScholars = useMemo(() => {
    if (showOnlyFavorites) {
      return scholars.filter(scholar => favoriteIds.includes(scholar.id));
    }
    return scholars; // Otherwise, show the list from the server as-is
  }, [scholars, showOnlyFavorites, favoriteIds]);

  // The handlers for search, country, etc. are still needed to update the URL
  // and trigger the primary server-side filtering.
  // ... (handleSearchChange, handleCountryChange, etc.)

  return (
    <div className="container ...">
      <h1 className='...'>Voices of Truth</h1>
      <FilterBar
        uniqueCountries={uniqueCountries}
        uniqueLanguages={uniqueLanguages}
        uniqueCategories={uniqueCategories}
        // Pass down URL-changing handlers
        // ...
        // Pass down the new favorites toggle state and handler
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={setShowOnlyFavorites}
      />
      {/* Pass the functions down to the list, which will pass them to the cards */}
      <ScholarList
        scholars={displayedScholars}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default HomePageClient;
```

## Conclusion

This hybrid approach is powerful. It keeps the heavy lifting on the server for performance, while still allowing for dynamic, client-side-only features like `localStorage`-based favorites.

1.  **`useFavorites`** manages the data in `localStorage`.
2.  **`HomePageClient`** orchestrates the UI, using `useFavorites` and adding a secondary client-side filter on the data it gets from the server.
3.  **`ScholarCard`** and **`FilterBar`** are updated with the necessary UI and props to support the feature.