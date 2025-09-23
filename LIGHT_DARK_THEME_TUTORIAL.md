# 🌙 Implementing Light/Dark Theme in Next.js with Tailwind CSS

This tutorial outlines the steps to implement a light and dark theme in a Next.js project using Tailwind CSS, leveraging both system preference and a manual toggle.

## 1. Configure Tailwind CSS for Dark Mode

First, ensure your `tailwind.config.ts` is set up to use the `class` strategy for dark mode. This allows you to manually toggle the dark mode by adding or removing a `dark` class on the `<html>` element.

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
    extend: {
      colors: {
        // Optional: Define custom colors that can use CSS variables
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
```

## 2. Define CSS Variables for Themes

In your global CSS file (`src/app/globals.css`), define CSS variables for your colors. Use the `@media (prefers-color-scheme: dark)` media query to set different values for these variables based on the user's system preference.

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Light theme colors */
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme colors */
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
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

## 3. Apply Theme Classes in Components

Now you can use Tailwind CSS classes that respond to the `dark` class. For example, `bg-white` will be the default background, and `dark:bg-gray-900` will apply a dark gray background when the `dark` class is present on the `<html>` element.

```tsx
// Example: src/components/SomeComponent.tsx
export default function SomeComponent() {
  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-4 rounded-lg">
      This component adapts to the theme.
    </div>
  );
}
```

## 4. Implement a Client-Side Theme Toggle (Optional)

To allow users to manually switch themes, you'll need a client-side component that adds or removes the `dark` class from the `<html>` element. You can use React's `useState` and `useEffect` hooks to manage the theme state and persist it (e.g., in `localStorage`).

Here's a conceptual example of a `ThemeSwitcher` component:

```tsx
// src/components/ThemeSwitcher.tsx
"use client"; // Mark as a client component

import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Apply or remove the 'dark' class on the html element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-md bg-gray-200 dark:bg-gray-700">
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
```

You would then include this `ThemeSwitcher` component in your `layout.tsx` or any other client-side component where you want the toggle to appear.

## 5. Integrate ThemeSwitcher into your Layout

To make the `ThemeSwitcher` available across your application, you can place it in your root `layout.tsx` or a shared component. Remember that `layout.tsx` in Next.js 13+ App Router is a Server Component by default, so you might need to wrap client components or pass props.

```tsx
// src/app/layout.tsx (conceptual integration)
import type { Metadata } from "next";
import "./globals.css";
import { dir } from "i18next";
import ThemeSwitcher from '../components/ThemeSwitcher'; // Assuming you created this

export const metadata: Metadata = {
  title: "Voices of Truth",
  description: "A directory of scholars and preachers.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        {/* Place your ThemeSwitcher here or within a client component */}
        <ThemeSwitcher />
        {children}
      </body>
    </html>
  );
}
```

By following these steps, you can effectively implement a light/dark theme in your Next.js application with Tailwind CSS, providing a great user experience.
