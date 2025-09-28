# Code Organization and Feature Suggestions

This document outlines completed refactoring tasks and suggests future improvements and features.

## Completed Refactoring

The following refactoring tasks have been successfully implemented:

*   ✅ **`useScholars` Hook:** Data fetching and filtering logic has been extracted from `HomePageClient` into the `useScholars` custom hook. This separates presentation logic from state management and business logic.
*   ✅ **`ScholarCard` Componentization:** The `ScholarCard` has been broken down into smaller, more focused components: `ScholarAvatar`, `ScholarInfo`, and `SocialMediaLinks`.
*   ✅ **`FilterBar` Modularity:** The `FilterBar` has been decomposed into individual filter components (`CountryFilter`, `LanguageFilter`, `CategoryFilter`, `SearchInput`), making it more modular and extensible.
*   ✅ **Data Organization:** The data in the `/data` directory has been structured into separate, linked files for scholars, countries, and specializations, improving manageability.

## Future Suggestions & New Features

Here are some suggestions for new features and further improvements:

*   **Add to Favorites:**
    *   Implement a "favorite" feature allowing users to mark and save their preferred scholars.
    *   This would likely involve:
        *   A "favorite" button or icon on each `ScholarCard`.
        *   A mechanism to persist the list of favorites (e.g., using `localStorage`).
        *   A new state management hook (`useFavorites`) or an extension of the existing `useScholars` hook.
        *   A UI element, such as a new filter or a dedicated "Favorites" tab, to display the saved scholars.

*   **Error Handling:** There is no explicit error handling in the `useScholars` hook. If the data files were to be missing or malformed, the application would crash. Consider adding `try...catch` blocks or other error handling mechanisms to gracefully handle these situations.

*   **Loading State:** There is no loading state in the `HomePageClient` component. When the data is being fetched and processed, the user sees a blank page. Consider adding a loading spinner to the `HomePage-Client` component to improve the user experience.

*   **Testing Framework (High Priority):** The project currently has no automated tests, which is a critical risk for maintaining code quality and preventing regressions. A testing framework is essential for confident refactoring and future development.

    *   **Proposed Solution:** Implement a testing suite using **Jest** and **React Testing Library**.
    *   **Implementation Plan:**

        **Phase 1: Infrastructure Setup**
        1.  **Install Dependencies:** Add the required development dependencies using pnpm.
            ```bash
            pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-jest
            ```
        2.  **Configure Jest:** Create a `jest.config.js` file at the project root to configure Jest for a Next.js environment, including setting up the test environment, module aliases, and handling for static assets.
        3.  **Create Setup File:** Create a `jest.setup.js` file to import necessary polyfills or custom matchers, such as those from `@testing-library/jest-dom`.

        **Phase 2: Initial Tests**
        1.  **Add Test Script:** Add a `"test": "jest"` script to `package.json` to easily run the tests.
        2.  **Write a Component Test:** Create a test file for a simple, presentational component (e.g., `ScholarAvatar.test.tsx`) to ensure it renders correctly.
        3.  **Write a Hook Test:** Create a test file for the `useScholars` hook to verify that the filtering and data transformation logic works as expected under various conditions. This is crucial for ensuring the core functionality of the application is reliable.

*   **Code Duplication:** The `uniqueCountries` and `uniqueCategories` logic in the `useScholars` hook is very similar. This could be extracted into a reusable function to reduce code duplication.

*   **Performance:** The `filteredScholars` logic is memoized with `useMemo`, which is good. However, the `map` and `filter` operations are still performed on every render. For a larger dataset, this could become a performance bottleneck. Consider looking into more advanced techniques like virtualization or server-side filtering to improve performance.

## General Architectural Suggestions

*   **Adopt Atomic Design Principles:**
    *   Organize your components into `atoms`, `molecules`, and `organisms`. This will create a more consistent and scalable component library.
    *   **Atoms:** Basic UI elements like `Button`, `Input`, `Avatar`.
    *   **Molecules:** Combinations of atoms, like a search form (`SearchInput` + `Button`).
    *   **Organisms:** More complex components like `ScholarCard` and `FilterBar`.

By applying these suggestions, you can improve the modularity, reusability, and maintainability of your codebase.