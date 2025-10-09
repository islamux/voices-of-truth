# Guide: Modern Translation in Next.js with `next-intl`

Hello! This guide will walk you through our app's new and improved approach to handling multiple languages using `next-intl`. This library is specifically designed for the Next.js App Router and makes managing translations much simpler and more efficient.

It's a powerful, modern replacement for our old `i18next` setup.

## 1. The Big Picture: Why `next-intl`?

`next-intl` is great because it's deeply integrated with Next.js. It simplifies our code and improves performance.

Here's the new flow:

1.  **User Request:** A user visits a URL, like `/ar/some-page`.
2.  **Middleware:** A simple, one-line middleware from `next-intl` (`src/middleware.ts`) checks the URL for a locale (`en`, `ar`, etc.) and makes sure every page has one.
3.  **Server-Side Translations:** `next-intl` automatically loads the correct translation file (e.g., `messages/ar.json`) on the server.
4.  **Use in Server Components:** We can now get translations directly in any **Server Component** using a simple hook. No more passing props down from the layout!
5.  **Use in Client Components:** For **Client Components**, we still use a provider, but it's configured once in the root layout and is very straightforward.

**The main benefits are:**
*   **Simpler Code:** Less boilerplate for setup.
*   **Server-First:** Embraces Server Components for better performance.
*   **Great Developer Experience:** Easy-to-use hooks for both server and client.

---

## 2. The Code in Detail

Here’s how to set up `next-intl`.

### Step 1: Installation

First, we need to add the library to our project.

```bash
pnpm add next-intl
```

### Step 2: Create Translation Files

Instead of `public/locales`, we'll create a new `messages` directory at the root of our project.

```
/
├── messages/
│   ├── en.json
│   └── ar.json
└── src/
    └── ...
```

The JSON files look the same as before:

```json
// messages/en.json
{
  "HomePage": {
    "title": "Voices of Truth",
    "filterByCategory": "Filter by Category"
  }
}
```

```json
// messages/ar.json
{
  "HomePage": {
    "title": "أصوات الحقيقة",
    "filterByCategory": "التصنيف حسب الفئة"
  }
}
```
*Pro-tip: Grouping translations by page or component (`HomePage`, `FilterBar`) makes them easier to manage.*

### Step 3: The Middleware (`src/middleware.ts`)

Our middleware becomes incredibly simple. `next-intl` provides a factory function that does all the heavy lifting.

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en'
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\..*).*)']
};
```

### Step 4: The Root Layout (`src/app/[locale]/layout.tsx`)

This Server Component connects the server and client worlds. We get the messages for the current locale and pass them to a provider.

```tsx
// src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';

// ... other imports

// Can be imported from a shared config
const locales = ['en', 'ar'];

export default function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  if (!locales.includes(locale as any)) notFound();

  // Receive messages provided in `i18n.ts`
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <Layout>
              {children}
            </Layout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

We also need a `src/i18n.ts` file to configure where to load messages from:

```typescript
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}));
```

---

## 3. How to Use It: A Practical Guide

This is where you'll see the biggest improvement.

### How to Use Translations in a **Server Component**

Let's say we want to display a title in our main page (`src/app/[locale]/page.tsx`), which is a Server Component.

```tsx
// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage'); // Load the 'HomePage' namespace

  return (
    <div>
      <h1>{t('title')}</h1>
      {/* ... rest of the page */}
    </div>
  );
}
```
It's that easy! No props, no providers needed for Server Components.

### How to Use Translations in a **Client Component**

For a Client Component (like a filter button), the process is very similar.

1.  Make sure the component has `'use client';` at the top.
2.  Import `useTranslations` from `next-intl` (it works on both client and server!).

```tsx
// src/components/filters/CategoryFilter.tsx
'use client';

import { useTranslations } from 'next-intl';

export default function CategoryFilter() {
  const t = useTranslations('HomePage'); // Also loading 'HomePage' namespace

  return (
    <div>
      <label>{t('filterByCategory')}</label>
      {/* ... dropdown logic */}
    </div>
  );
}
```

The hook automatically gets the translations from the `<NextIntlClientProvider>` we set up in the layout.

### How to Add a New Translation Key

1.  **Open `messages/en.json`** and add your key:
    ```json
    {
      "HomePage": {
        "title": "Voices of Truth",
        "filterByCategory": "Filter by Category",
        "searchPlaceholder": "Search for a scholar..."
      }
    }
    ```
2.  **Open `messages/ar.json`** and add the translated key:
    ```json
    {
      "HomePage": {
        "title": "أصوات الحقيقة",
        "filterByCategory": "التصنيف حسب الفئة",
        "searchPlaceholder": "ابحث عن عالم..."
      }
    }
    ```
3.  **Use it in your component:**
    ```tsx
    const t = useTranslations('HomePage');
    return <input placeholder={t('searchPlaceholder')} />;
    ```

This new setup is much cleaner and aligns perfectly with the latest Next.js best practices. Happy coding!
