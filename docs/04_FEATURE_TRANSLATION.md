# How to Add a Translation Feature to a Next.js Project (using i18next)

This tutorial outlines the steps to integrate a robust translation feature into your Next.js application using `i18next` and `react-i18next`, based on the existing implementation in this project.

## 1. Introduction

The translation feature allows your application to support multiple languages, providing a localized experience for users. This project utilizes `i18next` for both server-side and client-side internationalization, leveraging the Next.js App Router.

**Libraries Used:**
*   `i18next`: The core internationalization library.
*   `react-i18next`: React bindings for `i18next`.
*   `i18next-resources-to-backend`: A plugin to load translation files dynamically.

## 2. Middleware for Locale Detection (`src/middleware.ts`)

The middleware is crucial for detecting the user's preferred locale and redirecting them to the correct localized path (e.g., `/en` or `/ar`).

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of supported locales
const locales = ['en', 'ar'];
const defaultLocale = 'en';

// Get the preferred locale from the request
function getLocale(request: NextRequest): string {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const detectedLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .find(lang => locales.includes(lang.substring(0, 2)));
    
    if (detectedLocale) {
      return detectedLocale.substring(0, 2);
    }
  }
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next/static|_next/image|favicon.ico|avatars|locales).*)',
  ],
};
```
*   **`getLocale`**: This function parses the `accept-language` header to find a supported locale.
*   **`middleware`**: It checks if the URL path already contains a locale. If not, it determines the best locale and redirects the user.
*   **`config.matcher`**: This ensures the middleware doesn't run on requests for static assets like images or API routes.

## 3. Core i18n Configuration (`src/lib/i18n.ts`)

This file configures `i18next` to load translations for Server Components. It uses `i18next-resources-to-backend` to dynamically import the JSON files from `/public/locales`.

```typescript
// src/lib/i18n.ts
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export const fallbackLng = 'en';
export const supportedLngs = [fallbackLng, 'ar'];
export const defaultNS = 'common';

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
    .init({
      supportedLngs,
      fallbackLng,
      lng,
      ns,
      defaultNS,
      fallbackNS: defaultNS,
    });
  return i18nInstance;
}

export async function getTranslation(lng: string, ns: string | string[] = defaultNS) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
    resources: i18nextInstance.services.resourceStore.data,
  };
}
```
*   **`initI18next`**: Creates and configures an `i18next` instance, attaching the backend plugin to load resources. Note the addition of `fallbackNS` for robustness.
*   **`getTranslation`**: An async function used in Server Components to get the translation function (`t`) and the loaded resources. This is the primary way to handle translations on the server.

## 4. Client-side i18n Provider (`src/components/I18nProviderClient.tsx`)

For Client Components, we need a provider to make the `i18next` instance available via React's context. This provider is initialized with the resources fetched on the server.

```typescript
// src/components/I18nProviderClient.tsx
'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, supportedLngs, defaultNS } from '../lib/i18n';

export default function I18nProviderClient({
  children,
  locale,
  resources
}: {
  children: React.ReactNode;
  locale: string;
  resources: Resource;
}) {
  const i18n = createInstance();

  i18n
    .use(initReactI18next)
    .init({
      supportedLngs,
      fallbackLng,
      lng: locale,
      ns: defaultNS,
      defaultNS,
      resources,
    });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```
*   **`'use client'`**: Marks this as a Client Component.
*   **`init`**: The instance is initialized on the client with the `resources` passed down from the server. This prevents re-fetching translation files. It also reuses configuration constants (`supportedLngs`, `fallbackLng`, etc.) imported from `lib/i18n.ts`.
*   **`I18nextProvider`**: Wraps the application, making the `i18n` instance accessible to any child component via the `useTranslation` hook.

## 5. Integrating the Provider in the Root Layout (`src/app/[locale]/layout.tsx`)

The root layout (`/app/[locale]/layout.tsx`) is a Server Component. It fetches translations and passes them to the `I18nProviderClient`, which then wraps the entire application, including other providers like `ThemeProvider` and the main `Layout`.

```tsx
// src/app/[locale]/layout.tsx
import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/Layout';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  const { resources } = await getTranslation(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
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
      </body>
    </html>
  );
}

// Statically generate routes for supported locales
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
```
*   **`getTranslation(locale)`**: This server-side function fetches the translation JSON for the current locale.
*   **Provider Nesting**: The `I18nProviderClient` wraps all other providers and the main `Layout`, ensuring translations are available everywhere.
*   **`<html>` tag**: The `lang` and `dir` attributes are set here for accessibility and correct text direction (LTR/RTL).

## 6. Using Translations in Client Components

In any Client Component, you can now use the `useTranslation` hook from `react-i18next` to access the translation function `t`.

```tsx
// src/components/filters/CategoryFilter.tsx (Example)
'use client'

import React from "react"
import { useTranslation } from "react-i18next"
import FilterDropdown from "./FilterDropdown"

// ...

const CategoryFilter: React.FC<CategoryFilterProps> = ({uniqueCategories, onCategoryChange})=> {

  const { t } = useTranslation('common');

  return (
    <FilterDropdown 
      label={t('filterByCategory')}
      // ...
    />
  );
};
export default CategoryFilter;
```
*   **`useTranslation('common')`**: This hook provides the `t` function. The argument `'common'` is the namespace, which corresponds to our `common.json` file.
*   **`t('key')`**: Use the `t` function with a key from your JSON file (e.g., `filterByCategory`) to render the translated string.

## 7. Translation Files (`public/locales/{locale}/common.json`)

Translation messages are stored in JSON files, organized by locale and namespace.

**Example: `public/locales/en/common.json`**
```json
{
  "title": "Voices of Truth",
  "filterByCategory": "Filter by Category"
}
```

**Example: `public/locales/ar/common.json`**
```json
{
  "title": "أصوات الحقيقة",
  "filterByCategory": "التصنيف حسب الفئة"
}
```

## Conclusion

By following this structure, you can implement a robust and scalable translation feature. The key is to fetch translations on the server within the layout, pass them down to a client-side provider, and then consume them in Client Components using the `useTranslation` hook. This approach is efficient and works seamlessly with the Next.js App Router.