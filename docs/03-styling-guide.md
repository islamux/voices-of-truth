# Styling Guide: Tailwind CSS and Custom Theming

> **Status:** ✅ Current — Tailwind v4 with CSS-based config, custom `ThemeProvider` (no `next-themes`).

This guide provides a comprehensive overview of the styling architecture for this Next.js project. It covers the integration of Tailwind CSS and our custom, hook-based strategy for implementing light and dark themes.

## 1. Core Styling Technologies

- **[Tailwind CSS v4](https://tailwindcss.com/)**: A utility-first CSS framework that enables rapid UI development by composing pre-built utility classes directly in your markup. Configuration is CSS-based via the `@theme` directive instead of a JavaScript config file.
- **[PostCSS](https://postcss.org/)**: A tool for transforming CSS with JavaScript plugins. We use it as the engine that processes Tailwind CSS via the `@tailwindcss/postcss` plugin. Vendor prefixes are handled automatically by Tailwind v4.
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
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

- **`'@tailwindcss/postcss': {}`**: Integrates Tailwind CSS v4 as a PostCSS plugin. Autoprefixing is built into Tailwind v4 — no separate `autoprefixer` dependency needed.

### Theme Configuration via CSS (`globals.css`)

Tailwind v4 replaces the JavaScript `tailwind.config.ts` with a CSS-based configuration system. There is **no `tailwind.config.ts`** file in this project. Theme tokens (colors, spacing, etc.) are defined in `src/app/globals.css` using the `@theme` directive.

```css
/* src/app/globals.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  /* ... see globals.css for full list */
}
```

- **`@import "tailwindcss"`**: Replaces the old `@tailwind base/components/utilities` directives. Tailwind v4 automatically injects all layers through this single import.
- **`@custom-variant dark (...)`**: Defines the dark mode variant. The selector `&:where(.dark, .dark *)` applies dark styles when the `.dark` class is present on a parent element (set on `<html>` by the `ThemeProvider`).
- **`@theme` block**: Registers custom design tokens as CSS custom properties, making them available as Tailwind utility classes (e.g., `bg-card`, `text-foreground`, `border-border`).

### `src/app/globals.css`

This file is the entry point for our global styles. It's where Tailwind's directives are injected and where we define the color values for our themes using CSS variables.

**To properly work with our `ThemeProvider`, the CSS should be structured like this:**

```css
/* src/app/globals.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
}

@layer base {
  :root {
    /* Light mode (default) — HSL format: hue saturation lightness */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... see globals.css for full list */
  }

  .dark {
    /* Dark mode — HSL format */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... see globals.css for full list */
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

- **`@import "tailwindcss"`**: Tailwind v4 single-entry import (replaces `@tailwind base/components/utilities`).
- **`@theme` block**: Registers color tokens so Tailwind utility classes like `bg-card` and `text-foreground` work.
- **`@custom-variant dark`**: Configures class-based dark mode so `dark:bg-gray-800` activates when `.dark` is on `<html>`.
- **`@layer base`**: Defines the raw HSL variable values. `:root` = light theme, `.dark` = dark theme. The `ThemeProvider` toggles the `.dark` class on `<html>`.

## 3. Theming Strategy: Custom `ThemeProvider`

This project uses a **custom** `ThemeProvider` and `useTheme` hook in `src/lib/theme.tsx`, rather than a third-party library like `next-themes`. This was done for Next.js 16 / React 19 compatibility — `next-themes` injects `<script>` tags during rendering, which React 19 rejects.

The custom provider is ~70 lines and handles:

- **Theme state**: `'light' | 'dark' | 'system'` via React Context.
- **localStorage persistence**: Reads saved preference on init, writes on change.
- **System preference detection**: Defaults to `system` and listens for OS-level changes via `matchMedia`.
- **Flash prevention**: An inline `<script>` in `src/app/layout.tsx` applies the theme before React hydrates (see root layout).

### A. The Provider

The `ThemeProvider` from `src/lib/theme.tsx` is used in `src/app/[locale]/layout.tsx`. It takes no props — its behavior is self-contained.

```tsx
// src/app/[locale]/layout.tsx
import I18nProviderClient from "@/components/I18nProviderClient";
import PageLayout from "@/components/PageLayout";
import { ThemeProvider } from '@/lib/theme';
import { getTranslation, supportedLngs } from "@/lib/i18n";

interface LocaleLayoutProps{
  children : React.ReactNode;
  params: Promise<{locale: string}>;
}

export default async function LocaleLayout({children, params}:LocaleLayoutProps){
  const {locale} = await params;
  const {resources} = await getTranslation(locale, ['common', 'header']);

  return (
    <ThemeProvider>
      <I18nProviderClient locale={locale} resources={resources}>
        <PageLayout> {children} </PageLayout>
      </I18nProviderClient>
    </ThemeProvider>
  );
}

export async function generateStaticParams() {
  return supportedLngs.map(function(locale) {
    return { locale :locale};
  });
}
```

### B. The `ThemeToggle` Component

The toggle component uses the `useTheme` hook from `@/lib/theme` to switch between light and dark modes. It also uses the `useHasMounted` hook (backed by `useSyncExternalStore`) to ensure the button's text is only rendered on the client, preventing hydration mismatches.

```tsx
// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/lib/theme';
import { useTranslation } from "react-i18next";
import Button from './Button';
import { useHasMounted } from '@/hooks/useHasMounted';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('common');
  const mounted = useHasMounted();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // The useHasMounted hook ensures we don't render the theme-specific
  // button text on the server, preventing a hydration mismatch.
  if (!mounted) {
    return (
      <Button
        disabled
        className="hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {t('theme')}
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      className="hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === 'light' ? t('dark') : t('light')} {t('theme')}
    </Button>
  );
}
```

### C. Flash Prevention

To prevent a flash of the wrong theme on page load, an inline script in `src/app/layout.tsx` runs before React hydration. It reads `localStorage` and applies the correct class to `<html>` immediately:

```tsx
// src/app/layout.tsx (inside the <head>)
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'system';
      var resolved = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      document.documentElement.classList.add(resolved);
      document.documentElement.style.colorScheme = resolved;
    } catch(e) {}
  })();
`;

return (
  <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </head>
    ...
  </html>
);
```

This script runs synchronously before any React code, ensuring the correct theme class is present on the very first paint. The `suppressHydrationWarning` on `<html>` prevents React from complaining that the server-rendered class list differs from the client. Once the `ThemeProvider` hydrates, it takes over all subsequent theme management.

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