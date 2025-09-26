
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
import { countries } from "@/data/countries";
import { specializations } from "@/data/specializations";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const useScholars = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // 1. State for user's filter selections
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Memoized logic to filter scholars when selections change
  const filteredScholars = useMemo(() => {
    return scholars
      .map((scholar) => {
        const country = countries.find((c) => c.id === scholar.countryId);
        const category = specializations.find(
          (s) => s.id === scholar.categoryId
        );

        return {
          ...scholar,
          country: country
            ? { en: country.en, ar: country.ar }
            : { en: "", ar: "" },
          category: category
            ? { en: category.en, ar: category.ar }
            : { en: "", ar: "" },
        };
      })
      .filter((scholar) => {
        const countryMatch =
          !selectedCountry || scholar.country.en === selectedCountry;
        const languageMatch =
          !selectedLanguage || scholar.language.includes(selectedLanguage);
        const categoryMatch =
          !selectedCategory || scholar.category.en === selectedCategory;
        const searchMatch =
          !searchTerm ||
          Object.values(scholar.name).some((name) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        return countryMatch && languageMatch && categoryMatch && searchMatch;
      });
  }, [selectedCountry, selectedLanguage, selectedCategory, searchTerm]);

  // 3. Memoized logic to get unique, translated values for filter dropdowns
  const uniqueCountries = useMemo(() => {
    return countries
      .map((country) => ({
        value: country.en,
        label: country[currentLang] || country["en"],
      }))
      .filter((country) => country.value);
  }, [currentLang]);

  const uniqueLanguages = useMemo(() => {
    const allLanguages = scholars.flatMap((scholar) => scholar.language);
    return [...new Set(allLanguages)];
  }, []);

  const uniqueCategories = useMemo(() => {
    return specializations
      .map((category) => ({
        value: category.en,
        label: category[currentLang] || category["en"],
      }))
      .filter((category) => category.value);
  }, [currentLang]);

  // 4. Return everything the component needs
  return {
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

**Update:** The `FilterBar` component has been successfully broken down into smaller, more focused components for each filter control. This makes the `FilterBar` component more modular and easier to extend with new filters.

**Example Breakdown:**
*   `CountryFilter.tsx`: A dropdown for filtering by country.
*   `LanguageFilter.tsx`: A dropdown for filtering by language.
*   `CategoryFilter.tsx`: A dropdown for filtering by category.
*   `SearchInput.tsx`: A text input for searching by name.

## Further Suggestions

Here are some additional suggestions for improving the project:

*   **Error Handling:** There is no explicit error handling in the `useScholars` hook. If the data files were to be missing or malformed, the application would crash. Consider adding `try...catch` blocks or other error handling mechanisms to gracefully handle these situations.

*   **Loading State:** There is no loading state in the `HomePageClient` component. When the data is being fetched and processed, the user sees a blank page. Consider adding a loading spinner to the `HomePageClient` component to improve the user experience.

*   **Testing:** There are no tests in the project. Consider adding unit tests for the `useScholars` hook and the components to ensure the application is working as expected and to prevent regressions. Tools like Jest and React Testing Library would be a good choice.

*   **Code Duplication:** The `uniqueCountries` and `uniqueCategories` logic in the `useScholars` hook is very similar. This could be extracted into a reusable function to reduce code duplication.

*   **Performance:** The `filteredScholars` logic is memoized with `useMemo`, which is good. However, the `map` and `filter` operations are still performed on every render. For a larger dataset, this could become a performance bottleneck. Consider looking into more advanced techniques like virtualization or server-side filtering to improve performance.
## 4. Data Organization (`/data` directory)

The data is now more structured and scalable.

**Update:** The data has been organized into separate files for scholars, countries, and specializations, and they are linked by ID. This makes the data easier to manage and query.

*   `scholars.ts`: Contains the main list of scholars, with `countryId` and `categoryId` to link to the other data files.
*   `countries.ts`: A list of countries with their `id`, `en`, and `ar` names.
*   `specializations.ts`: A list of specializations with their `id`, `en`, and `ar` names.

## General Architectural Suggestions

*   **Adopt Atomic Design Principles:**
    *   Organize your components into `atoms`, `molecules`, and `organisms`. This will create a more consistent and scalable component library.
    *   **Atoms:** Basic UI elements like `Button`, `Input`, `Avatar`.
    *   **Molecules:** Combinations of atoms, like a search form (`SearchInput` + `Button`).
    *   **Organisms:** More complex components like `ScholarCard` and `FilterBar`.

By applying these suggestions, you can improve the modularity, reusability, and maintainability of your codebase.
