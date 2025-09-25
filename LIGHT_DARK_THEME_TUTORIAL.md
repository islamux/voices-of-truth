# 🌙 Implementing Light/Dark Theme in Next.js with Tailwind CSS

This tutorial outlines the steps to implement a light and dark theme in a Next.js project using Tailwind CSS, leveraging a client-side provider and `localStorage` to persist user choice.

## 1. Configure Tailwind CSS for Dark Mode

First, ensure your `tailwind.config.ts` is set up to use the `class` strategy for dark mode. This allows you to manually toggle dark mode by adding or removing a `dark` class on the `<html>` element.

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode based on the presence of a 'dark' class
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

## 2. Define CSS Variables for Themes

In your global CSS file (`src/app/globals.css`), you can define CSS variables for your colors. While this project uses Tailwind's `dark:` variants directly, using CSS variables is a powerful alternative for more complex theming.

For this project, the key is that Tailwind will automatically apply `dark:` prefixed classes when the `dark` class is active on the `<html>` tag.

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Example of how you might set color variables, though not strictly necessary for this implementation */
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-start-rgb));
}
```

## 3. Create the Theme Components

We will create two components: a `ThemeProvider` to hold the logic and a `ThemeSwitcher` for the UI.

### `ThemeProvider.tsx`

This client component manages the theme state, checks for user preference in `localStorage` or system settings, and applies the `dark` class to the `<html>` element. It also renders the switcher button.

```tsx
// src/components/ThemeProvider.tsx
'use client';

import { useState, useEffect, ReactNode } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div>
      <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      {children}
    </div>
  );
}
```

### `ThemeSwitcher.tsx`

This component is the actual button the user interacts with. It displays a moon or sun icon depending on the current theme.

```tsx
// src/components/ThemeSwitcher.tsx
'use client';

import { FaSun, FaMoon } from 'react-icons/fa';

interface ThemeSwitcherProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function ThemeSwitcher({ theme, toggleTheme }: ThemeSwitcherProps) {
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-50 p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
    </button>
  );
}
```

## 4. Integrate the ThemeProvider into the Layout

To make the theme functionality available everywhere, wrap the content of your root layout with the `ThemeProvider`. In this project, we add it to `src/app/[locale]/layout.tsx`.

```tsx
// src/app/[locale]/layout.tsx
import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider'; // Import the provider

// ... (interface and other code)

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await Promise.resolve(params);
  const { resources } = await getTranslation(locale);

  return (
    <I18nProviderClient locale={locale} resources={resources}>
      {/* Wrap the children with ThemeProvider */}
      <ThemeProvider>{children}</ThemeProvider>
    </I18nProviderClient>
  );
}

// ... (generateStaticParams)
```

## 5. Apply Theme Classes in Components

Now you can use Tailwind's `dark:` variants in any component. They will be applied automatically when the theme is set to dark.

```tsx
// Example: src/components/ScholarCard.tsx

// ...
  return (
    <motion.div
      className="border rounded-lg shadow-lg p-5 bg-white dark:bg-gray-900 text-black dark:text-white"
      // ... (other props)
    >
      {/* ... component content ... */}
    </motion.div>
  );
// ...
```

By following these steps, you have successfully implemented a persistent light/dark theme in your Next.js application with Tailwind CSS.