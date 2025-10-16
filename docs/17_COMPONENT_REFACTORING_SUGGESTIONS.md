# Component Refactoring Suggestions

This document provides an analysis of the current component structure and offers recommendations for breaking them down into smaller, more maintainable pieces. This process is key to long-term code health and scalability.

## High-Level Analysis

Your current component structure is already quite good and follows best practices. Key components like `HomePageClient`, `FilterBar`, `ScholarList`, and `ScholarCard` show a clear separation of concerns.

However, as in any growing project, there are always opportunities to refine and improve. The best candidate for refactoring at this stage is the `ScholarCard.tsx` component.

---

## Recommendation: Refactor `ScholarCard.tsx`

The `ScholarCard` component is currently responsible for three distinct tasks:
1.  **Data Logic:** It contains the logic for retrieving the correct localized data for the scholar (name, country, bio).
2.  **Layout & Animation:** It defines the card's visual structure and animations using `framer-motion`.
3.  **Composition:** It assembles smaller, presentational components (`ScholarAvatar`, `ScholarInfo`, `SocialMediaLinks`).

By extracting the data-handling logic into a custom hook, we can make the `ScholarCard` a pure **"presentational component"**. Its only job will be to display the data it receives, making it simpler, dumber, and much easier to test and reuse.

### Step 1: Create a `useLocalizedScholar` Custom Hook

Create a new directory `src/hooks` if it doesn't exist, and add the following file.

**`src/hooks/useLocalizedScholar.ts`**
```typescript
import { useTranslation } from 'react-i18next';
import { Scholar, Country } from '@/types';

export function useLocalizedScholar(scholar: Scholar, countries: Country[]) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // Retrieves the localized name, falling back to English if not available.
  const name = scholar.name[currentLang] || scholar.name['en'];
  
  // Finds the country object and retrieves the localized name.
  const countryObject = countries.find(c => c.id === scholar.countryId);
  const country = countryObject ? (currentLang === 'ar' ? countryObject.ar : countryObject.en) : '';
  
  // Retrieves the localized bio, falling back to English if available.
  const bio = scholar.bio ? (scholar.bio[currentLang] || scholar.bio['en']) : undefined;

  return { name, country, bio, languages: scholar.language };
}
```

### Step 2: Refactor `ScholarCard.tsx`

Now, update the `ScholarCard` to use our new hook. Notice how much cleaner it becomes.

**`src/components/ScholarCard.tsx` (Refactored)**
```tsx
"use client";

import React from 'react';
import { Scholar, Country } from '../types';
import { motion } from 'framer-motion';
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
import SocialMediaLinks from './SocialMediaLinks';
import { useLocalizedScholar } from '@/hooks/useLocalizedScholar';

interface ScholarCardProps {
  scholar: Scholar;
  countries: Country[];
}

const ScholarCard: React.FC<ScholarCardProps> = ({ scholar, countries }) => {
  // All the complex data logic is now handled by the hook.
  const { name, country, bio, languages } = useLocalizedScholar(scholar, countries);

  if (!scholar.name) {
    console.error("Scholar with missing name:", scholar);
    return null;
  }

  return (
    <motion.div
      className="border rounded-lg shadow-lg p-5 bg-[rgb(var(--card-bg-rgb))] border-[rgb(var(--card-border-rgb))] flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.15)" }}
    >
      <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name} />
      <ScholarInfo name={name} country={country} bio={bio} languages={languages} />
      <SocialMediaLinks socialMedia={scholar.socialMedia} name={name} />
    </motion.div>
  );
};

export default ScholarCard;
```

---

## Other Components: No Action Needed

-   **`FilterBar.tsx`**: This component is already well-designed. It correctly acts as a container and delegates its logic to smaller, specialized filter components. **No changes are recommended.**
-   **`ScholarList.tsx`**: This component is simple and has a single responsibility: to iterate over a list and render a `ScholarCard` for each item. **No changes are recommended.**

By implementing the `useLocalizedScholar` hook, you will make your `ScholarCard` component cleaner, more focused, and easier to maintain, which is a significant step forward for your codebase.
