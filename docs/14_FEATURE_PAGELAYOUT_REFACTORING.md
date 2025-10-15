# Refactoring `PageLayout` for a Scalable Next.js App

As our application grows, it's crucial to maintain a clean and organized codebase. This guide will walk you through refactoring the `PageLayout.tsx` component into smaller, more manageable pieces. This approach aligns with Next.js 14 best practices and will make your app easier to test, maintain, and scale.

## Why Refactor `PageLayout`?

- **Separation of Concerns**: Each component will have a single, clear responsibility.
- **Reusability**: Smaller components like `LanguageSwitcher` and `ThemeToggle` can be used in different parts of the application.
- **Improved Testability**: It's easier to write unit tests for smaller, focused components.
- **Better Code Organization**: A more modular structure is easier to navigate and understand.

## Step-by-Step Refactoring Guide

### Step 1: Create `useTheme` Hook

First, let's extract the theme management logic into a custom hook. This will allow any component in our app to access and modify the theme.

**Create the file `src/hooks/useTheme.ts`:**
```typescript
"use client";

import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return { theme, toggleTheme };
}
```

### Step 2: Create `LanguageSwitcher` Component

Next, we'll create a dedicated component for switching the application's language.

**Create the file `src/components/LanguageSwitcher.tsx`:**
```typescript
"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = i18n.language;

  const changeLanguage = (newLang: string) => {
    if (currentLang === newLang) return;
    if (pathname) {
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      router.push(newPath);
    } else {
      router.push(`/${newLang}`);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button 
        onClick={() => changeLanguage('en')} 
        disabled={currentLang === 'en'} 
        className="px-3 py-1.5 text-sm rounded-md disabled:opacity-60 enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700 disabled:cursor-not-allowed"
      >
        {t('english')}
      </button>
      <button 
        onClick={() => changeLanguage('ar')} 
        disabled={currentLang === 'ar'} 
        className="px-3 py-1.5 text-sm rounded-md disabled:opacity-60 enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700 disabled:cursor-not-allowed"
      >
        {t('arabic')}
      </button>
    </div>
  );
}
```

### Step 3: Create `ThemeToggle` Component

Now, let's create a component for toggling the theme.

**Create the file `src/components/ThemeToggle.tsx`:**
```typescript
"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { t } = useTranslation('common');
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === 'light' ? t('dark') : t('light')} {t('theme')}
    </button>
  );
}
```

### Step 4: Create `Header` Component

With the `LanguageSwitcher` and `ThemeToggle` components ready, we can now create a `Header` component to house them.

**Create the file `src/components/Header.tsx`:**
```typescript
"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { t } = useTranslation('common');

  return (
    <header className="p-4 bg-gray-100 dark:bg-gray-800 shadow-md text-gray-900 dark:text-white">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-semibold">{t('headerTitle')}</h1>
        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

### Step 5: Simplify `PageLayout`

Finally, we can simplify the `PageLayout` component to use our new `Header` component. We'll also assume you have a `Footer` component.

**Update the file `src/components/PageLayout.tsx`:**
```typescript
"use client";

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer'; // Assuming you have a Footer component

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-transparent to-[rgb(var(--background-end-rgb))] bg-[rgb(var(--background-start-rgb))]">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

## Conclusion

By following these steps, you've successfully refactored your `PageLayout` component into a more modular and maintainable structure. This approach not only cleans up your code but also aligns with the best practices for building modern Next.js applications.