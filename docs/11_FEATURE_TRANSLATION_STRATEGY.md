# Internationalization (i18n) Strategy Guide

Welcome, developer! This guide explains our project's strategy for managing multiple languages. Our goal is to have a system that is simple to use, easy to maintain, and ready to scale in the future.

## 1. Core Technology

We use the following industry-standard libraries to handle translations:

-   **[i18next](https://www.i18next.com/)**: A powerful i18n framework.
-   **[react-i18next](https://react.i18next.com/)**: The official React integration for i18next, which provides the `useTranslation` hook to access translations in our components.

This is a native and widely supported solution in the React ecosystem, ensuring long-term stability.

## 2. Our Current Strategy: A Single "Namespace"

For the current size of our project, we use a single file for all translations for each language. This is often called a single "namespace" strategy.

### File Structure

You can find the translation files here:

```
/public
└── /locales
    ├── /en
    │   └── common.json  # English translations
    └── /ar
        └── common.json  # Arabic translations
```

-   **`[locale]`**: A two-letter language code (e.g., `en`, `ar`).
-   **`common.json`**: A JSON file containing all the key-value pairs for the text in that language.

### Why This Approach?

-   **Simplicity**: With only one file per language, you always know exactly where to find and add new text. There's no need to wonder which file a piece of text belongs to.
-   **Low Overhead**: It's the fastest way to get started and is perfect for small to medium-sized applications.

## 3. How to Use Translations in a Component

To use a translation in any client component (`'use client'`), you just need the `useTranslation` hook.

```tsx
// Example in src/components/Header.tsx
'use client';

import { useTranslation } from "react-i18next";

export default function Header(){
  // The 'common' argument is optional since it's our default, but it's good practice.
  const { t } = useTranslation('common');

  return (
    <header>
      {/* The t() function takes the key from the JSON file */}
      <h1>{t('headerTitle')}</h1>
    </header>
  );
}
```

-   **`const { t } = useTranslation()`**: This hook gives you the translation function, `t`.
-   **`t('headerTitle')`**: This looks inside the `common.json` file for the current language, finds the key `"headerTitle"`, and returns its value.

## 4. How to Add a New Translation

Adding new text is a simple, two-step process.

**Step 1: Add the Key to Both Language Files**

Let's say you need to add a "Read More" button label.

First, open the English file:

```json
// public/locales/en/common.json
{
  "headerTitle": "Voices of Truth",
  "readMore": "Read More" // <-- Add your new key and value here
}
```

Second, open the Arabic file and add the same key with the translated value:

```json
// public/locales/ar/common.json
{
  "headerTitle": "أصوات الحق",
  "readMore": "اقرأ المزيد" // <-- Add the same key here
}
```

> **Senior Dev Tip:** Always use **camelCase** for your JSON keys. This is a standard convention in JavaScript and keeps our codebase consistent.

**Step 2: Use the New Key in Your Component**

Now you can use the new `readMore` key in your component.

```tsx
import { useTranslation } from "react-i18next";
import Button from './Button';

function MyComponent() {
  const { t } = useTranslation('common');

  return (
    <Button>{t('readMore')}</Button>
  );
}
```

## 5. Future-Proofing: How We Will Scale

As our application grows, the `common.json` file might become very large and difficult to manage. When that happens, we will evolve our strategy by introducing **multiple namespaces**.

This means we would split our single `common.json` file into smaller, feature-focused files.

**Future File Structure Example:**

```
/public
└── /locales
    ├── /en
    │   ├── common.json    # For truly shared text (OK, Cancel)
    │   ├── header.json    # Text only for the Header
    │   └── scholar.json   # Text for the ScholarCard and ScholarInfo
    └── /ar
        ├── common.json
        ├── header.json
        └── scholar.json
```

When we make this change, the only thing that will change in the code is the `useTranslation` hook. We would tell it which file to use:

```tsx
// Example of how we would use namespaces in the future
const { t } = useTranslation('scholar'); // <-- Load translations from scholar.json
```

For now, you don't need to worry about this. Just know that we have a clear and simple plan to scale our translations as the project grows.