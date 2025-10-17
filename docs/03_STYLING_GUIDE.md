# Styling Guide: Tailwind CSS and Custom Theming

This guide provides a comprehensive overview of the styling architecture for this Next.js project. It covers the integration of Tailwind CSS and our custom, hook-based strategy for implementing light and dark themes.

## 1. Core Styling Technologies

- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework that enables rapid UI development by composing pre-built utility classes directly in your markup.
- **[PostCSS](https://postcss.org/)**: A tool for transforming CSS with JavaScript plugins. We use it as the engine that processes Tailwind CSS directives. Next.js automatically includes `autoprefixer` to add vendor prefixes for cross-browser compatibility.
- **CSS Custom Properties (Variables)**: Used to manage dynamic values for theming (e.g., switching between light and dark mode colors).

## 2. Configuration Deep Dive

Correct configuration is crucial for the styling pipeline to work. Here’s a breakdown of the key files.

### `postcss.config.mjs`

This file configures the PostCSS pipeline. It's very simple, as Next.js handles most of the configuration for us.

```javascript
// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

- **`tailwindcss: {}`**: Integrates Tailwind CSS as a PostCSS plugin. `autoprefixer` is included automatically by Next.js.

### `tailwind.config.ts`

This is the heart of your Tailwind setup. It defines which files to scan for classes and configures the dark mode strategy.

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", 
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [], 
};
export default config;
```

- **`content`**: Tells Tailwind to scan all relevant files to generate only the CSS that is actually used, keeping the final bundle small.
- **`darkMode: 'class'`**: This is the key to our theme-switching implementation. It instructs Tailwind to apply dark mode styles (e.g., `dark:bg-black`) whenever a `dark` class is present on a parent element (in our case, the `<html>` tag).

### `src/app/globals.css`

This file is the entry point for our global styles. It's where Tailwind's directives are injected and where we define the color values for our themes using CSS variables.

**To properly work with our `ThemeProvider`, the CSS should be structured like this:**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Define CSS variables for light mode (default) */
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}
 
/* Define CSS variables for dark mode */
.dark {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 0, 0, 0;
  --background-end-rgb: 0, 0, 0;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
```

- **`@tailwind` directives**: These inject Tailwind's base styles, component classes, and utility classes.
- **`:root`**: Defines the default (light theme) color values.
- **`.dark`**: Defines the color values that will be applied when the `dark` class is active on the `<html>` element. Our `ThemeProvider` is responsible for adding and removing this class.

## 3. Theming Strategy: A Custom Hook Approach

Our project uses a custom, self-contained theme provider, not a third-party library. This gives us full control.

1.  **`ThemeProvider.tsx`**: This client component (`'use client'`) is the core of our theming system.
2.  **`useTheme()` Hook**: The `ThemeProvider` also exports a `useTheme` custom hook.
3.  **`src/app/[locale]/layout.tsx`**: The `ThemeProvider` component wraps our application in the locale layout.
4.  **`ThemeToggle.tsx`**: This is the UI component that allows the user to switch themes.

### Deep Dive: The Theme System (Refactored)

To improve organization, the theme system has been split into three parts: the Context, the Provider, and the consumer Hook.

**1. The Provider: `src/components/ThemeProvider.tsx`**

This component is now solely responsible for the state management and logic of the theme.

```tsx
// src/components/ThemeProvider.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

// 1. Define and export the shape of the context and the context itself
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// 2. The Provider Component
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Effect to set the initial theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme as 'light' | 'dark');
  }, []);

  // Effect to apply and save theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**2. The Hook: `src/hooks/useTheme.ts`**

A dedicated file now holds the `useTheme` hook. This is a clean convention for all custom hooks.

```tsx
// src/hooks/useTheme.ts
'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/components/ThemeProvider';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

**How It Works Now:**

1.  **Context Definition (`ThemeProvider.tsx`)**: The `ThemeContext` and its type `ThemeContextType` are now **exported** directly from the provider file. This allows other files, like our new hook, to import them.
2.  **Provider Logic (`ThemeProvider.tsx`)**: The provider component itself remains largely the same. It manages the state and the side effects of applying the theme to the DOM and `localStorage`.
3.  **Consumer Hook (`useTheme.ts`)**: The `useTheme` hook is now in its own file. It imports the `ThemeContext`, consumes it with `useContext`, and returns the value. This separates the "consuming" logic from the "providing" logic.

This refactoring makes our code more organized and follows the common pattern of keeping reusable hooks in a dedicated `src/hooks` directory.

## 4. Usage in Components

```tsx
// Example usage in a React component
export default function MyComponent() {
  return (
    // Use Tailwind's dark: prefix for conditional styling
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold">Hello, Theming!</h1>
    </div>
  );
}
```

- **`dark:` prefix**: Use Tailwind's `dark:` prefix to apply styles specifically for dark mode.

## 5. Component Styling Deep Dive

Let's break down the classes used in our main layout components.

### `PageLayout.tsx`

This component provides the main visual structure for every page: a header, a main content area, and a footer. It arranges the main sections of the page.

```tsx
// src/components/PageLayout.tsx
'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    // The background is now handled by the body tag in globals.css
    <div class="min-h-screen flex flex-col">
      <Header />
      <main class="flex-grow container mx-auto p-4 md:p-6">{children}</main>
      <Footer />
    </div>
  );
}
```

- **`min-h-screen`**: Ensures the layout takes up at least the full height of the viewport.
- **`flex flex-col`**: Establishes a vertical flexbox context, stacking the `Header`, `main`, and `Footer` on top of each other.
- The background styling is intentionally omitted here. It is handled globally on the `<body>` tag in `src/app/globals.css` to avoid redundancy.

**`<main className="...">` (The Content Area):**
- **`flex-grow`**: Allows the main content area to expand and fill any available vertical space between the header and footer.
- **`container`**: Constrains the width of the content area.
- **`mx-auto`**: Centers the container horizontally.
- **`p-4 md:p-6`**: Adds padding around the content, with more padding on larger screens.

### `Header.tsx`

This component serves as the top banner of our application.

```tsx
// src/components/Header.tsx
<header className="p-4 bg-gray-100 dark:bg-gray-800 shadow-md text-gray-900 dark:text-white">
  <div className="container mx-auto flex flex-wrap justify-between items-center">
    <h1 className="text-xl sm:text-2xl font-semibold">...</h1>
    <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
      ...
    </div>
  </div>
</header>
```

**`<header>` element:**
- **`p-4`**: Applies `1rem` of padding.
- **`bg-gray-100`**: Sets a light gray background color in light mode.
- **`dark:bg-gray-800`**: Sets a dark gray background color in dark mode.
- **`shadow-md`**: Applies a medium box shadow for a lifting effect.
- **`text-gray-900`**: Sets the default text color to a dark gray in light mode.
- **`dark:text-white`**: Sets the text color to white in dark mode.

**`<div>` container:**
- **`container mx-auto`**: Centers the content within a max-width container.
- **`flex`**: Enables Flexbox layout.
- **`flex-wrap`**: Allows items to wrap to the next line on small screens.
- **`justify-between`**: Distributes items evenly, with the first item at the start and the last at the end.
- **`items-center`**: Aligns items vertically to the center.

**`<h1>` title:**
- **`text-xl`**: Sets the font size to `1.25rem`.
- **`sm:text-2xl`**: On small screens (`sm`) and up, increases font size to `1.5rem`.
- **`font-semibold`**: Sets the font weight to 600.

**`<div>` for buttons:**
- **`flex items-center`**: Enables Flexbox and vertically centers the buttons.
- **`space-x-2`**: Adds horizontal space (`0.5rem`) between the child elements (the buttons).
- **`sm:space-x-4`**: On small screens and up, increases the space to `1rem`.
- **`mt-2`**: Adds a margin-top of `0.5rem`.
- **`sm:mt-0`**: On small screens and up, removes the top margin.

### `Footer.tsx`

This component serves as the bottom banner of our application.

```tsx
// src/components/Footer.tsx
<footer className="p-4 bg-gray-100 dark:bg-gray-800 shadow-md text-gray-900 dark:text-white">
  <div className="container mx-auto text-center">
    ...
  </div>
</footer>
```

**`<footer>` element:**
- The classes are identical to the `<header>` element, creating a consistent visual style for the top and bottom of the page.

**`<div>` container:**
- **`container mx-auto`**: Centers the content within a max-width container.
- **`text-center`**: Centers the text inside the div.

## 6. Troubleshooting: Main Content Area Not Changing Theme

A common issue you might face is that the `Header` and `Footer` switch themes correctly, but the main content area (the background behind the scholar cards) does not.

### The Problem

The `body` element has its background color changed by the theme switcher, but components like `ScholarCard` or `FilterBar` might have their own opaque backgrounds (e.g., `bg-white`). These opaque backgrounds will cover the `body`'s background, so you won't see the theme change.

### The Solution

You must add `dark:` variants to every component that needs to change its appearance in dark mode. The component must be responsible for its own theme-aware styling.

**Example: Fixing `ScholarCard.tsx`**

If your `ScholarCard` is styled like this:

```tsx
// Incorrect: No dark mode styles
<div className="border rounded-lg shadow-lg p-5 bg-white">
  ...
</div>
```

You need to add `dark:` variants for the background, text, and border colors:

```tsx
// Correct: With dark mode styles
<div className="border rounded-lg shadow-lg p-5 bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
  ...
</div>
```

By applying this principle to all the components in your main content area, you ensure that your entire application will correctly respond to theme changes.
