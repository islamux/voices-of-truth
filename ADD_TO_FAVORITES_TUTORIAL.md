# Tutorial: Implementing "Add to Favorites"

This guide will walk you through adding a feature that allows users to mark scholars as "favorites" and view them in a separate list. We'''ll use `localStorage` to persist the user'''s choices in their browser.

## Step 1: Create a `useFavorites` Custom Hook

We'''ll start by creating a dedicated hook to manage the state and logic for favorites. This keeps our code organized and reusable.

**Create the file `src/app/hooks/useFavorites.ts`:**

```typescript
"use client";

import { useState, useEffect, useCallback } from 'react';

// A custom hook to manage favorite scholars
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
        ? prevIds.filter(id => id !== scholarId) // Remove from favorites
        : [...prevIds, scholarId]; // Add to favorites

      // Update localStorage
      try {
        localStorage.setItem('favoriteScholars', JSON.stringify(newIds));
      } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
      }

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

**Explanation:**
*   `useState<number[]>([]):` Holds an array of the favorite scholar IDs.
*   `useEffect(() => ...)`: Runs once when the component mounts to load the saved favorites from `localStorage`.
*   `toggleFavorite`: A function that adds or removes a scholar'''s ID from the `favoriteIds` array and updates `localStorage`.
*   `isFavorite`: A helper function to easily check if a scholar is already in the favorites list.

## Step 2: Add a "Favorite" Button to `ScholarCard`

Now, let'''s add a button to the `ScholarCard` component so users can favorite a scholar.

**Modify `src/components/ScholarCard.tsx`:**

We need to:
1.  Import and use the `useFavorites` hook.
2.  Add a button that calls `toggleFavorite`.
3.  Conditionally style the button to show if a scholar is a favorite.

```tsx
// src/components/ScholarCard.tsx
"use client";

import React from 'react';
import { Scholar } from '../types';
import { motion } from 'framer-motion';
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
import SocialMediaLinks from './SocialMediaLinks';
import { useFavorites } from '@/app/hooks/useFavorites'; // 1. Import the hook
import { useTranslation } from 'react-i18next';

interface ScholarCardProps {
  scholar: Scholar;
}

const ScholarCard: React.FC<ScholarCardProps> = ({ scholar }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const { toggleFavorite, isFavorite } = useFavorites(); // 2. Use the hook
  const isFav = isFavorite(scholar.id);

  if (!scholar.name) {
    console.error("Scholar with missing name:", scholar);
    return null;
  }
  const name = scholar.name[currentLang] || scholar.name['en'];
  const country = scholar.country[currentLang] || scholar.country.en;
  const bio = scholar.bio && (scholar.bio[currentLang] || scholar.bio['en']);

  return (
    <motion.div
      className="border rounded-lg shadow-lg p-5 bg-[rgb(var(--card-bg-rgb))] border-[rgb(var(--card-border-rgb))] flex flex-col items-center text-center relative" // Added relative positioning
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.15)" }}
    >
      {/* 3. Add the favorite button */}
      <button
        onClick={() => toggleFavorite(scholar.id)}
        className={`absolute top-2 right-2 p-1 rounded-full focus:outline-none transition-colors duration-200 ${
          isFav
            ? "text-red-500 bg-red-100 dark:bg-red-900"
            : "text-gray-400 hover:text-red-500"
        }`}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFav ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
        </svg>
      </button>

      <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name}/>
      <ScholarInfo name={name} country={country} bio={bio} languages={scholar.language}/>
      <SocialMediaLinks socialMedia={scholar.socialMedia} name={name}/>
    </motion.div>
  );
};

export default ScholarCard;
```

## Step 3: Display Only Favorite Scholars

We need a way for users to see their list of favorite scholars. A simple way is to add a "Show Favorites" toggle to the `FilterBar`.

**Modify `src/app/hooks/useScholars.ts`:**

Let'''s extend the `useScholars` hook to handle filtering by favorites.

1.  Accept `favoriteIds` as an argument.
2.  Add a new state for toggling the favorites view.
3.  Update the `filteredScholars` logic.

```typescript
// src/app/hooks/useScholars.ts
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { scholars } from "@/data/scholars";
import { countries } from "@/data/countries";
import { specializations } from "@/data/specializations";

// 1. Update the hook to accept favoriteIds
export const useScholars = (favoriteIds: number[]) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // 2. New state

  const filteredScholars = useMemo(() => {
    return scholars
      .map((scholar) => {
        const country = countries.find((c) => c.id === scholar.countryId);
        const category = specializations.find(
          (s) => s.id === scholar.categoryId
        );
        return { /* ...scholar mapping... */ };
      })
      .filter((scholar) => {
        // 3. Add favorites filter logic
        if (showOnlyFavorites && !favoriteIds.includes(scholar.id)) {
          return false;
        }
        const countryMatch = !selectedCountry || scholar.country.en === selectedCountry;
        const languageMatch = !selectedLanguage || scholar.language.includes(selectedLanguage);
        const categoryMatch = !selectedCategory || scholar.category.en === selectedCategory;
        const searchMatch = !searchTerm || Object.values(scholar.name).some(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
        return countryMatch && languageMatch && categoryMatch && searchMatch;
      });
  }, [selectedCountry, selectedLanguage, selectedCategory, searchTerm, showOnlyFavorites, favoriteIds]); // 3. Add dependencies

  const uniqueCountries = useMemo(() => { /* ... */ }, [currentLang]);
  const uniqueLanguages = useMemo(() => { /* ... */ }, []);
  const uniqueCategories = useMemo(() => { /* ... */ }, [currentLang]);

  return {
    filteredScholars,
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange: setSelectedCountry,
    onLanguageChange: setSelectedLanguage,
    onCategoryChange: setSelectedCategory,
    onSearchChange: setSearchTerm,
    showOnlyFavorites, // 4. Return new state and handler
    onToggleFavorites: setShowOnlyFavorites,
  };
};
```

**Modify `src/components/FilterBar.tsx`:**

Add a toggle switch to the filter bar.

```tsx
// src/components/FilterBar.tsx
"use client";

import React from 'react';
import CountryFilter from './filters/CountryFilter';
import LanguageFilter from './filters/LanguageFilter';
import CategoryFilter from './filters/CategoryFilter';
import SearchInput from './filters/SearchInput';

// 1. Update props to include favorites toggle
interface FilterBarProps {
  uniqueCountries: Array<{ value: string; label: string }>;
  uniqueLanguages: string[];
  uniqueCategories: Array<{ value: string; label: string }>;
  onCountryChange: (country: string) => void;
  onLanguageChange: (language: string) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (term: string) => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: (show: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  uniqueCountries,
  uniqueLanguages,
  uniqueCategories,
  onCountryChange,
  onLanguageChange,
  onCategoryChange,
  onSearchChange,
  showOnlyFavorites,
  onToggleFavorites
}) => {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <SearchInput onSearchChange={onSearchChange}/>
      <CountryFilter uniqueCountries={uniqueCountries} onCountryChange={onCountryChange} />
      <LanguageFilter uniqueLanguages={uniqueLanguages} onLanguageChange={onLanguageChange}/>
      <CategoryFilter uniqueCategories={uniqueCategories} onCategoryChange={onCategoryChange}/>

      {/* 2. Add the Favorites Toggle Switch */}
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

## Step 4: Connect Everything in `HomePageClient`

Finally, let'''s tie it all together in the main page component.

**Modify `src/app/[locale]/HomePageClient.tsx`:**

1.  Use both `useFavorites` and `useScholars` hooks.
2.  Pass the `favoriteIds` to `useScholars`.
3.  Pass the new props to `FilterBar`.

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

import { useScholars } from "../hooks/useScholars";
import { useFavorites } from "../hooks/useFavorites"; // 1. Import useFavorites
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";

const HomePageClient = () => {
  const { favoriteIds } = useFavorites(); // 1. Use useFavorites
  const {
    filteredScholars,
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange,
    onLanguageChange,
    onCategoryChange,
    onSearchChange,
    showOnlyFavorites,
    onToggleFavorites,
  } = useScholars(favoriteIds); // 2. Pass favoriteIds

  return (
    <div className="container max-auto px-4 py-8">
      <h1 className='text-4xl font-bold text-center mb-8'>Voices of Truth</h1>
      <FilterBar
        uniqueCountries={uniqueCountries}
        uniqueLanguages={uniqueLanguages}
        uniqueCategories={uniqueCategories}
        onCountryChange={onCountryChange}
        onLanguageChange={onLanguageChange}
        onCategoryChange={onCategoryChange}
        onSearchChange={onSearchChange}
        showOnlyFavorites={showOnlyFavorites} // 3. Pass props
        onToggleFavorites={onToggleFavorites} // 3. Pass props
      />
      <ScholarList scholars={filteredScholars} />
    </div>
  );
};

export default HomePageClient;
```

And that'''s it! With these changes, users can now save their favorite scholars, and the choices will be remembered the next time they visit the site.
