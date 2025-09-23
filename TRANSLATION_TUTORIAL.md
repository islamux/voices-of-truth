# How to Add Translation Feature to a Next.js Project (using next-intl)

This tutorial outlines the steps to integrate a robust translation feature into your Next.js application using the `next-intl` library, based on the existing implementation in this project.

## 1. Introduction

The translation feature allows your application to support multiple languages, providing a localized experience for users. This project utilizes `next-intl` for both server-side and client-side internationalization.

## 2. Core i18n Configuration (`src/lib/i18n.ts`)

This file sets up the core internationalization logic, defining how messages are loaded for a given locale.

```typescript
// src/lib/i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Array of supported locales
const locales = ['en', 'ar'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../../public/locales/${locale}/common.json`)).default
  };
});
```

*   **`getRequestConfig`**: This function is used on the server to load translation messages.
*   **`locales`**: An array defining all supported languages (e.g., 'en' for English, 'ar' for Arabic).
*   **Message Loading**: It dynamically imports the appropriate JSON translation file from `public/locales/{locale}/common.json` based on the detected locale.

## 3. Middleware for Locale Detection (`src/middleware.ts`)

The middleware is crucial for detecting the user's preferred locale and redirecting them to the correct localized path.

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported in this application
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};
```

*   **`createMiddleware`**: From `next-intl/middleware`, this function sets up the locale handling.
*   **`locales`**: Must match the `locales` defined in `src/lib/i18n.ts`.
*   **`defaultLocale`**: The fallback locale if no preferred locale is detected or supported.
*   **`matcher`**: Configures which paths the middleware should apply to, ensuring only internationalized routes are processed.

## 4. Client-side i18n Provider (`src/components/I18nProviderClient.tsx`)

For components that use client-side hooks (like `useTranslations`), a client-side provider is necessary to make the translation context available.

```typescript
// src/components/I18nProviderClient.tsx
'use client';

import { NextIntlClientProvider } from 'next-intl';

type Props = {
  locale: string;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
};

export default function I18nProviderClient({ locale, messages, children }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

*   **`'use client'`**: Marks this component as a Client Component.
*   **`NextIntlClientProvider`**: Wraps your application's components, providing them with the `locale` and `messages`.

## 5. Integrating the Provider in Layout (`src/app/[locale]/layout.tsx`)

The client-side provider is integrated into the root layout of your localized routes to ensure all child components have access to translations.

```typescript
// src/app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import '../globals.css';
import { notFound } from 'next/navigation';
import I18nProviderClient from '@/components/I18nProviderClient';
import { unstable_setRequestLocale } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

const locales = ['en', 'ar'];

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale as any)) notFound();

  // Enable static rendering
  unstable_setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../../public/locales/${locale}/common.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <I18nProviderClient locale={locale} messages={messages}>
          {children}
        </I18nProviderClient>
      </body>
    </html>
  );
}
```

*   **`unstable_setRequestLocale(locale)`**: Essential for static rendering with `next-intl`.
*   **Message Loading**: Similar to `i18n.ts`, it loads messages for the current locale.
*   **`I18nProviderClient`**: The `children` (your page content) are wrapped by this provider, passing the `locale` and `messages`.
*   **`lang` attribute**: The `<html>` tag's `lang` attribute is set to the current `locale` for better accessibility and SEO.

## 6. Using Translations in Pages/Components (`src/app/[locale]/page.tsx`)

To use translations within your components, you'll use the `useTranslations` hook.

```typescript
// src/app/[locale]/page.tsx
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export default function IndexPage({ params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const t = useTranslations('common'); // 'common' refers to the common.json file

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      {/* ... other content */}
    </div>
  );
}
```

*   **`useTranslations('common')`**: This hook provides a translation function `t`. The argument `'common'` refers to the `common.json` file where your translations are stored.
*   **`t('key')`**: Use the `t` function with the key of your translation string to display the translated text.

## 7. Translation Files (`public/locales/{locale}/common.json`)

Translation messages are stored in JSON files, organized by locale.

**Example: `public/locales/en/common.json`**

```json
{
  "title": "Voices of Truth",
  "description": "Explore diverse perspectives on Islamic thought.",
  "greeting": "Hello!"
}
```

**Example: `public/locales/ar/common.json`**

```json
{
  "title": "أصوات الحقيقة",
  "description": "استكشف وجهات نظر متنوعة حول الفكر الإسلامي.",
  "greeting": "مرحباً!"
}
```

*   Each key-value pair represents a translation. The key (e.g., `"title"`) is used in your code, and the value is the translated string for that locale.

## Conclusion

By following these steps, you can successfully implement a robust and scalable translation feature in your Next.js application using `next-intl`, providing a multilingual experience for your users. Remember to add new translation keys to your `common.json` files for each supported locale as your application grows.
