# Guide: Understanding the Translation Feature (i18next)

Hey there! This guide breaks down how our app handles multiple languages. It might seem complex at first, but it's a very powerful and efficient system built on `i18next` and the Next.js App Router.

## 1. The Big Picture: How It Works

Here is the journey of a user request to get a translated page:

1.  **User Request:** A user visits our site (e.g., `voices-of-truth.com`).
2.  **Middleware:** Our middleware (`src/middleware.ts`) intercepts the request. It checks if a language is specified in the URL (like `/en` or `/ar`).
    *   If **not**, it looks at the user's browser settings (`Accept-Language` header) and redirects them to the appropriate language URL (e.g., `voices-of-truth.com/en`).
3.  **Server-Side Layout (`layout.tsx`):** The root layout, which is a **Server Component**, takes over. It sees the `/en` in the URL.
4.  **Fetch Translations:** The layout calls our `getTranslation('en')` helper function (`src/lib/i18n.ts`). This function reads the `public/locales/en/common.json` file on the server.
5.  **Client-Side Provider:** The layout then renders the `<I18nProviderClient>`. It passes the fetched language (`en`) and the JSON translation data (`resources`) as props to this provider.
6.  **React Context:** The `I18nProviderClient` (a **Client Component**) initializes `i18next` on the client-side with the translations it just received from the server. It wraps the entire application in a React Context provider.
7.  **Use in Components:** Now, any Client Component in the app (like `ThemeSwitcher.tsx`) can use the `useTranslation()` hook to get the translation function (`t`) and display the correct text (e.g., `t('toggleTheme')`).

**Why this way?** We load the translations **once** on the server and pass them to the client. This is very efficient and avoids the client having to re-fetch the same files.

---

## 2. The Code in Detail

### Step 1: The Middleware (`src/middleware.ts`)

This is the entry point. Its only job is to make sure every URL has a language code.

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // ... logic to parse 'accept-language' header ...
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|avatars|locales).*)',
  ],
};
```

### Step 2: The i18n Helper (`src/lib/i18n.ts`)

This file contains the server-side logic to load our JSON files.

```typescript
// src/lib/i18n.ts
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// ... config variables ...

async function initI18next(lng: string, ns: string | string[]) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({ /* ... options ... */ });
  return i18nInstance;
}

export async function getTranslation(lng: string, ns: string | string[] = 'common') {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
    resources: i18nextInstance.services.resourceStore.data,
  };
}
```

### Step 3: The Root Layout (`src/app/[locale]/layout.tsx`)

This Server Component connects the server and client worlds.

```tsx
// src/app/[locale]/layout.tsx
import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
// ... other imports

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  const { resources } = await getTranslation(locale);

  return (
    <I18nProviderClient
      locale={locale}
      resources={resources}
    >
      <ThemeProvider>
        <Layout>
          {children}
        </Layout>
      </ThemeProvider>
    </I18nProviderClient>
  );
}
```

### Step 4: The Client Provider (`src/components/I18nProviderClient.tsx`)

This component receives the translations from the server and makes them available to all other client components.

```tsx
// src/components/I18nProviderClient.tsx
'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance, Resource } from 'i18next';
// ... other imports

export default function I18nProviderClient({ children, locale, resources }) {
  const i18n = createInstance();

  i18n
    .use(initReactI18next)
    .init({
      lng: locale,
      resources,
      // ... other options
    });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

---

## 3. How to Use It: A Practical Guide

This is what you'll do in your day-to-day work.

### How to Add a New Translation Key

Let's say you want to add a "Search" button label.

1.  **Open the English file:** `public/locales/en/common.json`
2.  **Add the new key and value:**
    ```json
    {
      "title": "Voices of Truth",
      "filterByCategory": "Filter by Category",
      "searchButton": "Search"
    }
    ```

3.  **Open the Arabic file:** `public/locales/ar/common.json`
4.  **Add the same key with the Arabic translation:**
    ```json
    {
      "title": "أصوات الحقيقة",
      "filterByCategory": "التصنيف حسب الفئة",
      "searchButton": "بحث"
    }
    ```

### How to Use the New Key in a Component

Now, let's use this `searchButton` key in a component.

1.  Make sure the component is a Client Component (it has `'use client';` at the top).
2.  Import and use the `useTranslation` hook.

```tsx
// Example: src/components/filters/SearchInput.tsx
'use client';

import { useTranslation } from 'react-i18next';

export default function SearchInput() {
  const { t } = useTranslation();

  return (
    <div>
      <input type="text" placeholder={t('searchPlaceholder')} />
      <button>{t('searchButton')}</button> // Here is our new key!
    </div>
  );
}
```

That's it! The `useTranslation` hook automatically gets the right language from the context provided by `<I18nProviderClient>` and the `t` function returns the correct string.
