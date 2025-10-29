# Refactoring Plan: A Better i18n Strategy

Hello! This document outlines a plan to improve our internationalization (i18n) system. We will move from a single `common.json` file to multiple, smaller files, each one tied to a specific part of our application.

This is a common best practice that will make our project much easier to manage as it grows.

## 1. The Goal: Why Are We Doing This?

Currently, all of our translations are in one big file: `common.json`. This is simple, but it has some problems:

-   **Hard to Find Text:** As we add more features, this file will get crowded, making it difficult to find the specific text you want to change.
-   **Less Organized:** It's not clear which part of the application uses which piece of text.
-   **Risk of Mistakes:** It's easier to accidentally change a translation that is used in multiple places without realizing it.

By splitting our translations into files that match our components, our code will become cleaner, more organized, and easier to maintain.

## 2. The New Plan: Feature-Specific Files (Namespaces)

We will create a new JSON file for each major component or feature. This is called using **namespaces**.

### Proposed New File Structure

```
/public
└── /locales
    ├── /en
    │   ├── common.json    # For truly shared text (e.g., "Save", "Close")
    │   ├── header.json    # Translations for the Header
    │   ├── footer.json    # Translations for the Footer
    │   ├── scholar.json   # Translations for ScholarCard, ScholarInfo, etc.
    │   └── filters.json   # Translations for the FilterBar and its children
    └── /ar
        ├── common.json
        ├── header.json
        ├── footer.json
        ├── scholar.json
        └── filters.json
```

## 3. The Refactoring Process: A Step-by-Step Guide

Here is how we will perform the refactor.

### Step 1: Create the New JSON Files

First, we will create the new files (`header.json`, `footer.json`, `scholar.json`, `filters.json`) inside both the `/public/locales/en` and `/public/locales/ar` directories.

### Step 2: Move the Translations

Next, we will go through our existing `common.json` files and move each key-value pair into the appropriate new file.

**Example:**

The `headerTitle` key belongs to the `Header` component. So, we will cut it from `common.json` and paste it into `header.json`.

**`en/common.json` (Before):**
```json
{
  "headerTitle": "Voices of Truth",
  "filterByCountry": "Filter by Country"
}
```

**`en/header.json` (After):**
```json
{
  "headerTitle": "Voices of Truth"
}
```

**`en/filters.json` (After):**
```json
{
  "filterByCountry": "Filter by Country"
}
```

We will repeat this process for all keys until `common.json` only contains text that is truly used everywhere.

### Step 3: Update the `useTranslation` Hook

Finally, we will update our components to tell them which translation file to use.

We do this by passing the name of the file (the "namespace") to the `useTranslation` hook.

## 4. Concrete Example: Refactoring the `Header`

Here is a complete before-and-after example for the `Header.tsx` component.

### Before (`common.json`)

The component loads the general `common` namespace.

```tsx
// src/components/Header.tsx (Before)
'use client';

import { useTranslation } from "react-i18next";

export default function Header(){
  // This loads the entire common.json file
  const { t } = useTranslation('common');

  return (
    <header>
      <h1>{t('headerTitle')}</h1>
    </header>
  );
}
```

### After (`header.json`)

We tell the component to load only the `header` namespace.

```tsx
// src/components/Header.tsx (After)
'use client';

import { useTranslation } from "react-i18next";

export default function Header(){
  // This now loads only the small header.json file
  const { t } = useTranslation('header');

  return (
    <header>
      <h1>{t('headerTitle')}</h1>
    </header>
  );
}
```

## 5. What Stays in `common.json`?

After the refactor, the `common.json` file should be mostly empty. It should only contain words or phrases that are used in many **different and unrelated** parts of the application.

Good examples for `common.json`:
-   `"save": "Save"`
-   `"cancel": "Cancel"`
-   `"loading": "Loading..."`

This refactoring plan will set us up with a professional, scalable i18n architecture that is a pleasure to work with.
