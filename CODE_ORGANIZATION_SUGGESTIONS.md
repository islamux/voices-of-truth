
# Code Organization and Component Breakdown Suggestions

Based on the analysis of the project structure and the content of the key components, here are some suggestions for further breaking down the code into smaller, more manageable pieces.

## 1. `HomePageClient.tsx` and `useScholars` Hook

**Update:** The logic for data fetching and filtering has been successfully extracted from `HomePageClient` into the `useScholars` custom hook, as originally suggested. This has significantly cleaned up the main page component, separating the presentation logic from the state management and business logic.

The `HomePageClient` now simply calls the `useScholars` hook and passes the returned data and functions to the appropriate child components (`FilterBar` and `ScholarList`).

Here is the current implementation of the `useScholars` hook, which now manages state for multiple filters and derives unique values for the filter dropdowns:

**`src/app/hooks/useScholars.ts`:**
```typescript
"use client";

import { scholars } from "@/data/scholars";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const useScholars = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // 1. State for user's filter selections
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // 2. Memoized logic to filter scholars when selections change
  const filteredScholars = useMemo(() => {
    return scholars.filter((scholar) => {
      const countryMatch = !selectedCountry || (scholar.country[currentLang] || scholar.country['en']) === selectedCountry;
      const languageMatch = !selectedLanguage || scholar.language.includes(selectedLanguage);
      const categoryMatch = !selectedCategory || (scholar.category[currentLang] || scholar.category['en']) === selectedCategory;
      return countryMatch && languageMatch && categoryMatch;
    });
  }, [selectedCountry, selectedLanguage, selectedCategory, currentLang]);

  // 3. Memoized logic to get unique, translated values for filter dropdowns
  const uniqueCountries = useMemo(() => { /* ... */ }, [currentLang]);
  const uniqueCategories = useMemo(() => { /* ... */ }, [currentLang]);
  // ...

  // 4. Return everything the component needs
  return {
    filteredScholars,
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange: setSelectedCountry,
    onLanguageChange: setSelectedLanguage,
    onCategoryChange: setSelectedCategory,
  };
};
```

## 2. `ScholarCard.tsx`

This component is responsible for displaying a single scholar in the list. It has been refactored to be more self-sufficient by using the `useTranslation` hook internally, removing the need for a `currentLang` prop.

**Further Suggestions:**

*   **Break Down into Smaller Components:**
    *   As the `ScholarCard` component evolves, consider breaking it down into smaller, more focused components. This will improve readability and maintainability.

    **Example Breakdown:**
    *   `ScholarAvatar.tsx`: (Already implemented) Manages the display of the scholar's image.
    *   `ScholarInfo.tsx`: (Already implemented) Displays the scholar's name, country, bio, and languages.
    *   `SocialMediaLinks.tsx`: (Already implemented) Renders the social media icons and links.

    The card is already well-componentized, but keep this principle in mind if more complexity is added.


## 3. `FilterBar.tsx`

This component provides the UI for filtering the scholars.

**Suggestions:**

*   **Create Separate Components for Each Filter:**
    *   If the filter bar contains multiple filter controls (e.g., by specialization, by country, by name), each of these can be extracted into its own component.
    *   This will make the `FilterBar` component more modular and easier to extend with new filters.

    **Example Breakdown:**
    *   `SpecializationFilter.tsx`: A dropdown or a list of checkboxes for filtering by specialization.
    *   `CountryFilter.tsx`: A dropdown for filtering by country.
    *   `SearchInput.tsx`: A text input for searching by name.

import { on } from "events";
## 4. Data Organization (`/data` directory)

The data is already well-organized by specialization.

**Suggestions:**

*   **Consider a More Scalable Data Structure:**
    *   For a larger dataset, consider using a more database-like structure, where you have separate files for scholars, specializations, and countries, and then link them by ID.
    *   This would make the data easier to manage and query.

## General Architectural Suggestions

*   **Adopt Atomic Design Principles:**
    *   Organize your components into `atoms`, `molecules`, and `organisms`. This will create a more consistent and scalable component library.
    *   **Atoms:** Basic UI elements like `Button`, `Input`, `Avatar`.
    *   **Molecules:** Combinations of atoms, like a search form (`SearchInput` + `Button`).
    *   **Organisms:** More complex components like `ScholarCard` and `FilterBar`.

By applying these suggestions, you can improve the modularity, reusability, and maintainability of your codebase.
