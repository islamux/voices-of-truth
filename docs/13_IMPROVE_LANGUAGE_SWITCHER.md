# Tutorial: A Scalable `LanguageSwitcher` Component

Hello! This guide demonstrates the best practice for creating a dynamic and scalable `LanguageSwitcher` component.

## The Core Goal: A Maintainable Component

Our goal is to build a component that automatically updates when we add new languages, without requiring complex changes. The key is to maintain a direct and simple connection between our language configuration and our translation files.

## The Solution: Language Codes as Keys

The cleanest and most scalable solution is to use the official language codes (e.g., `en`, `ar`) directly as the translation keys in your `common.json` files.

This approach eliminates the need for any intermediate mapping object, reducing complexity and making the code easier to understand and maintain.

### The Updated `LanguageSwitcher.tsx`

Here is the refactored code. It is simpler, cleaner, and more robust.

```tsx
// src/components/LanguageSwitcher.tsx (Refactored)
'use client';

import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from 'next/navigation';
import Button from "./Button";
import { supportedLngs } from "@/lib/i18n"; // 1. Import the single source of truth for languages

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = i18n.language;

  const changeLanguage = (newLang: string) => {
    if (currentLang === newLang) return;
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-1">
      {/* 2. Map directly over the supported language CODES */}
      {supportedLngs.map((langCode) => (
        <Button
          key={langCode}
          onClick={() => changeLanguage(langCode)}
          disabled={currentLang === langCode}
          className="enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700"
        >
          {/* 3. Use the language code DIRECTLY as the translation key */}
          {t(langCode)}
        </Button>
      ))}
    </div>
  );
}
```

### How to Add a New Language (The New, Simpler Way)

With this new structure, adding a language like French (`fr`) is a simple two-step process:

1.  **Update Configuration**: Add `'fr'` to the `supportedLngs` array in `src/lib/i18n.ts`.
2.  **Add Translations**: Add the new key to your translation files.
    *   In `en/common.json`: `"fr": "French"`
    *   In `ar/common.json`: `"fr": "الفرنسية"`
    *   Create `fr/common.json` with: `"fr": "Français"`, `"en": "Anglais"`, etc.

That's it! The `LanguageSwitcher` component will automatically pick up the new language and render the button for it.

### Why This is the Best Solution

*   **Single Source of Truth**: The `supportedLngs` array is the single authority for which languages are available. The component logic reads directly from it.
*   **No Redundancy**: There is no need for a `langKeyMap`, removing a layer of abstraction and a potential source of bugs.
*   **Scalable and Maintainable**: The process for adding or removing languages is simple, predictable, and requires touching fewer files.