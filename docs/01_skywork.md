```typescript
    .filter((c): c is Country => c !== undefined)
    .map(c => ({ value: c.en, label: c.en }));

  const uniqueCategories = [...new Set(scholars.map(s => s.categoryId))]
    .map(id => specializations.find(s => s.id === id))
    .filter((s): s is Specialization => s !== undefined)
    .map(s => ({ value: s.en, label: s.en }));

  const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];

  // 4. Pass ONLY the filtered data and dropdown options to the client component.
  return (
    <HomePageClient
      scholars={filteredScholars}
      uniqueCountries={uniqueCountries}
      uniqueCategories={uniqueCategories}
      uniqueLanguages={uniqueLanguages}
      countries={countries}
    />
  );
}
```

The benefit is immense: if there are 1000 scholars but the filter matches only 5, the browser only ever receives data for those 5. This makes the application incredibly fast and scalable.

### Important Lesson: Asynchronous `searchParams` in Next.js 15+

The original document correctly pointed out a key change in recent Next.js versions. In older versions, `searchParams` was a plain object. Now, to support streaming rendering, it can be promise-like.

While in many simple cases like ours it might resolve immediately, the official and safest way to access it is with `await`, as shown in the original document's example:

```typescript
// The robust way to handle searchParams in modern Next.js
export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const { query, country } = resolvedSearchParams;
  // ... rest of the logic
}
```

For simplicity, our main code example destructures it directly, but it's vital to remember that it's an async-first feature. Always treat data access in Server Components as potentially asynchronous.

## Step 7: The Interactive Client Component

The server does the heavy lifting of filtering, but the client is responsible for the user experience. The `HomePageClient.tsx` component manages user input and tells the server when to re-filter the data.

> **Attention: Rules of Hooks**
> Remember these two golden rules for using React Hooks (like `useState`, `useRouter`, etc.):
> 1. **Only call hooks in Client Components.** They will not work in Server Components. This is why `HomePageClient.tsx` needs the `"use client"` directive.
> 2. **Only call hooks at the top level of your function.** Never call them inside loops, conditions, or nested functions. React relies on the consistent order of hook calls to work correctly.

### The Client-Side Hub: `src/app/[locale]/HomePageClient.tsx`

This component receives the filtered data as props and renders the UI. Its most important job is to handle changes from the filter controls.

**src/app/[locale]/HomePageClient.tsx**
```typescript
// src/app/[locale]/HomePageClient.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
// ... other imports and prop types ...

const HomePageClient: React.FC<HomePageClientProps> = ({
  scholars,
  uniqueCountries,
  uniqueCategories,
  uniqueLanguages,
  countries
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Define a memoized callback to handle filter changes.
  const handleFilterChange = useCallback(
    (name: string, value: string) => {
      // Create a mutable copy of the current search params.
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      
      // 2. Trigger a navigation to the new URL.
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams] // Dependencies for useCallback.
  );

  // 3. Pass the data and the handler down to presentational components.
  return (
    <div className="space-y-8">
      <FilterBar
        uniqueCountries={uniqueCountries}
        uniqueCategories={uniqueCategories}
        uniqueLanguages={uniqueLanguages}
        onCountryChange={(country) => handleFilterChange("country", country)}
        onCategoryChange={(category) => handleFilterChange("category", category)}
        onLanguageChange={(lang) => handleFilterChange("lang", lang)}
        onSearchChange={(query) => handleFilterChange("query", query)}
      />
      <ScholarList scholars={scholars} countries={countries} />
    </div>
  );
};

export default HomePageClient;
```

### A Deeper Look at `handleFilterChange`

This function is the heart of our client-server interaction. Let's dissect it.

> **Key Concept: Immutability in React**
> A core principle in React is to treat state and props as immutable (unchangeable). Instead of modifying an object or array directly, you create a new one with the desired changes. The line `const params = new URLSearchParams(searchParams.toString());` follows this rule perfectly. It creates a *new, editable copy* of the URL parameters, leaving the original `searchParams` from the hook untouched. This prevents bugs and makes our component's behavior predictable.

- **`useCallback`:** This hook memoizes the `handleFilterChange` function. This means the function itself is not recreated on every render of `HomePageClient`. It will only be recreated if one of its dependencies (`pathname`, `router`, or `searchParams`) changes. This is a performance optimization that can be useful when passing callbacks down to child components.

- **`new URLSearchParams(...)`:** This is a standard browser API that makes it easy to manipulate URL query strings. We create a new instance from the current parameters.

- **`params.set()` / `params.delete()`:** We update our copy. If a filter value is provided, we set it (e.g., `country=Egypt`). If the value is empty (e.g., the user selected "All Countries"), we delete the parameter entirely to keep the URL clean.

- **`router.push(...)`:** This is the magic trigger. We tell the Next.js router to navigate to a new URL. For example, if the user selects "Egypt", the new URL becomes `/en?country=Egypt`. This navigation is what tells Next.js to re-render the page on the server.

### The Client-Server Interaction Loop

This architecture creates a beautiful, reactive loop that is both efficient and simple to reason about:

1. **User Action:** The user selects "Egypt" from a dropdown in the `FilterBar` component.
2. **Client-Side Event:** The `onChange` event on the dropdown fires, calling `onCountryChange("Egypt")`.
3. **Handler Execution:** This calls our `handleFilterChange("country", "Egypt")` function in `HomePageClient`.
4. **URL Update:** The function constructs a new URL query string (`?country=Egypt`) and uses `router.push()` to change the browser's URL without a full page reload.
5. **Server Re-renders:** Next.js detects the URL change. It re-runs the `HomePage` Server Component, passing in the new `searchParams`: `{ country: 'Egypt' }`.
6. **Server-Side Filtering:** The `HomePage` component re-filters the master `scholars` list using the new parameters.
7. **New Props, New UI:** It passes the new, smaller list of filtered scholars as a prop to `HomePageClient`. React detects the prop change and re-renders the `ScholarList` component with the updated data. The user sees the filtered list almost instantly.

## Conclusion & Your Next Mission

Congratulations! You've now walked through a comprehensive guide to building a modern, server-centric Next.js application. You've seen how to structure a project, model data with TypeScript, and, most importantly, how to orchestrate a powerful data flow between Server and Client Components.

You've learned to:

- **Separate Concerns:** Use Server Components for data fetching and filtering, and Client Components for stateful user interaction.
- **Leverage the URL:** Use the URL's search parameters as the "single source of truth" for the application's state.
- **Create a Reactive Loop:** Understand how client-side actions can trigger server-side re-rendering through router-based navigation.
- **Handle Internationalization:** Implement a robust i18n system using middleware and context providers.

### Your Next Task:

The original tutorial gave you a great next step, and it remains your mission. Dive into the code for the `FilterBar.tsx` component and its children (like a hypothetical `CountryFilter.tsx`).

Trace how the `onCountryChange` prop is passed down from `HomePageClient` to `FilterBar`, and finally connected to the `onChange` event of a `<select>` element. Seeing this final piece of the puzzle will solidify your understanding of how a user's click is translated into a complete data refresh, all orchestrated by the elegant architecture of the Next.js App Router.

Happy coding!
