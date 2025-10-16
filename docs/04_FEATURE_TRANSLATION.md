# 🌍 Guide: Implementing and Optimizing Multi-Language Support (i18next + Next.js)

> This unified guide explains how to **set up translation support** in a Next.js app  
> using `i18next`, and how to **optimize performance** by improving the `I18nProviderClient` component.

---

## 🧭 1. The Big Picture — How It Works

Here’s how your app handles multiple languages using **Next.js App Router** and **i18next**:

1. **User Request:**  
   The user visits your site (e.g., `voices-of-truth.com`).

2. **Middleware:**  
   The middleware (`src/middleware.ts`) intercepts requests and ensures the URL contains a language code (`/en`, `/ar`, etc.).  
   - If missing, it detects the browser language and redirects to the correct locale (e.g., `/en`).

3. **Server Layout:**  
   The root layout (`src/app/[locale]/layout.tsx`) fetches translations using `getTranslation()` from `lib/i18n.ts`.

4. **Client Provider:**  
   The layout renders `<I18nProviderClient>` and passes both the language and translation data.

5. **React Context:**  
   The provider initializes `i18next` and wraps your app so that all Client Components can access translations.

6. **Component Usage:**  
   Client Components use `useTranslation()` to get the translation function `t()` and display localized text.

✅ **Why this method?**  
Translations are **loaded once on the server** and sent to the client — avoiding redundant requests.

---

## ⚙️ 2. Step-by-Step Implementation

### 🧩 Step 1: Middleware Setup

Ensures all URLs contain a language prefix.

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // Detect language from Accept-Language header
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const missingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (missingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|avatars|locales).*)'],
};
````

---

### 🧠 Step 2: i18n Helper Function

Loads translation JSON files from the `/public/locales` directory.

```typescript
// src/lib/i18n.ts
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

async function initI18next(lng: string, ns: string | string[]) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language, namespace) =>
      import(`../../public/locales/${language}/${namespace}.json`)
    ))
    .init({
      lng,
      fallbackLng: 'en',
      defaultNS: 'common',
    });
  return i18nInstance;
}

export async function getTranslation(lng: string, ns: string | string[] = 'common') {
  const instance = await initI18next(lng, ns);
  return {
    t: instance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: instance,
    resources: instance.services.resourceStore.data,
  };
}
```

---

### 🏗️ Step 3: Root Layout

Connects the server and client sides by fetching translations and providing them to the app.

```tsx
// src/app/[locale]/layout.tsx
import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';

export default async function RootLayout({ children, params }) {
  const { locale } = params;
  const { resources } = await getTranslation(locale);

  return (
    <I18nProviderClient locale={locale} resources={resources}>
      <ThemeProvider>
        <Layout>{children}</Layout>
      </ThemeProvider>
    </I18nProviderClient>
  );
}
```

---

## 🚀 3. Step-by-Step Optimization (Performance Upgrade)

After implementing translations, you might notice that your `I18nProviderClient` re-renders too often.
This happens because a new `i18next` instance is created on **every render**.

Let’s fix that using **React’s `useMemo` hook**.

---

### ⚡ Step 1: Open the File

`src/components/I18nProviderClient.tsx`

---

### ⚙️ Step 2: Import `useMemo`

Add it to your imports:

```tsx
import { useMemo } from 'react';
```

---

### 🧠 Step 3: Memoize the i18n Instance

Wrap the instance creation and initialization in `useMemo`.

```tsx
'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance, Resource } from 'i18next';
import { useMemo } from 'react';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, supportedLngs, defaultNS } from '../lib/i18n';

interface I18nProviderClientProps {
  children: React.ReactNode;
  locale: string;
  resources: Resource;
}

export default function I18nProviderClient({
  children,
  locale,
  resources,
}: I18nProviderClientProps) {
  const i18n = useMemo(() => {
    const instance = createInstance();
    instance.use(initReactI18next).init({
      supportedLngs,
      fallbackLng,
      lng: locale,
      ns: defaultNS,
      defaultNS,
      resources,
    });
    return instance;
  }, [locale, resources]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

✅ **Result:**
The `i18next` instance is now **cached** and only re-created when the locale or resources change,
significantly reducing unnecessary re-renders.

---

## 💡 4. Using Translations in Components

Here’s how you use translated strings in Client Components:

```tsx
'use client';
import { useTranslation } from 'react-i18next';

export default function SearchInput() {
  const { t } = useTranslation();

  return (
    <div>
      <input type="text" placeholder={t('searchPlaceholder')} />
      <button>{t('searchButton')}</button>
    </div>
  );
}
```

Add new keys by editing:

* 🇬🇧 `public/locales/en/common.json`
* 🇸🇦 `public/locales/ar/common.json`

```json
{
  "title": "Voices of Truth",
  "searchButton": "Search"
}
```

```json
{
  "title": "أصوات الحقيقة",
  "searchButton": "بحث"
}
```

---

## 🏁 5. Summary

| Step | File                     | Purpose                                                |
| ---- | ------------------------ | ------------------------------------------------------ |
| 1️⃣  | `middleware.ts`          | Ensures URLs always include locale                     |
| 2️⃣  | `lib/i18n.ts`            | Loads JSON translations from filesystem                |
| 3️⃣  | `layout.tsx`             | Passes translations to client provider                 |
| 4️⃣  | `I18nProviderClient.tsx` | Initializes i18next (optimized with `useMemo`)         |
| 5️⃣  | `useTranslation()`       | Used in Client Components to display localized strings |

---

> 🎉 **Final Note:**
> You now have a **fully multilingual**, **optimized**, and **production-ready** translation system
> using `i18next` + `Next.js App Router`.
> Fast, clean, and scalable 🌐✨

```

