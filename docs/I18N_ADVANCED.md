# Advanced Internationalization Guide (i18n)

> STATUS: Reference / Advanced
> PURPOSE: Extend the basic i18n setup (Section 6 of `01_BUILD_FROM_SCRATCH.md`) with guidance for scaling, new locales, namespaces, RTL, performance, and maintenance.

---
## 1. Recap of Current Setup
- Locales: `en`, `ar`
- Namespace: `common` only
- Loader: `i18next-resources-to-backend` dynamic imports
- Locale detection: middleware redirects `/` -> `/{locale}`
- Server loads translations once per request, passes `resources` to client provider
- Fallback: `fallbackLng = 'en'`, `fallbackNS = 'common'`

This is lean and good for small/medium projects.

---
## 2. Adding a New Locale (Step-by-Step)
1. Create folder: `public/locales/fr/`
2. Copy `common.json` from `en` as a template.
3. Translate keys (leave missing keys blank only if you want fallback, but prefer completeness).
4. Update `supportedLngs` in `src/lib/i18n.ts`:
   ```ts
   export const supportedLngs = ['en', 'ar', 'fr'];
   ```
5. Update `locales` array in `middleware.ts`.
6. Add to `generateStaticParams` in `[locale]/layout.tsx`:
   ```ts
   export async function generateStaticParams() {
     return [{ locale: 'en' }, { locale: 'ar' }, { locale: 'fr' }];
   }
   ```
7. Test: `/fr` loads with French or falls back to English keys.

---
## 3. Adding a New Namespace
Use multiple namespaces when your keys exceed ~150 lines or you need clear domain separation.

Example: Introduce `filters` namespace.

1. Create files:
   - `public/locales/en/filters.json`
   - `public/locales/ar/filters.json`
2. Move related keys (e.g. `filterByCountry`, etc.) from `common.json` into `filters.json`.
3. Adjust server call if you want to preload both:
   ```ts
   const { resources } = await getTranslation(locale, ['common', 'filters']);
   ```
4. Client usage:
   ```tsx
   const { t } = useTranslation(['filters']);
   t('filterByCountry');
   ```
5. Consider leaving truly global keys (app title, meta) in `common`.

---
## 4. RTL Support Enhancements
Currently only Arabic is RTL. Improve robustness:
1. Set direction on `<html>` element:
   ```tsx
   <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
   ```
2. For layout flips (flex row direction, padding), prefer logical CSS or utility classes conditional on `dir`.
3. If you add a second RTL language (e.g. `fa`), the conditional still holds.
4. Avoid hard-coded left/right icons; use CSS logical properties if custom styles are added.

---
## 5. Key Naming Conventions
Pick one pattern and stay consistent. Recommended: `domain.action.object`.
Examples:
- `filters.search.placeholder`
- `filters.country.label`
- `global.title`

Benefits: Easier grouping, avoids collisions.

Refactor gradually; do not churn stable keys without reason.

---
## 6. Detecting & Removing Unused Keys (Process)
You can:
1. Write a small script to scan `public/locales/**/common.json` and compare with a grep of `t('...')`.
2. Mark suspicious keys, then remove after validation.
3. Keep a `DEPRECATED_KEYS.md` if you need a soft removal cycle.

Avoid premature tooling if project is small.

---
## 7. Performance Considerations
Current dynamic import is fine. Optimization triggers:
- >5 locales
- >5 namespaces loaded together
- Very large JSON files (>50KB each)

Possible improvements:
- Namespace splitting (load only what page needs)
- Static bundling via next-intl or next dynamic route segments (optional trade-off)
- Caching layer (Edge middleware or RSC caching) if API-based translations introduced

Only optimize AFTER measuring (use browser devtools to inspect JSON loads if you later push fetching to client).

---
## 8. Handling Pluralization & Interpolation
Add examples to `common.json`:
```json
{
  "results": "{{count}} result",
  "results_plural": "{{count}} results"
}
```
Usage:
```tsx
const { t } = useTranslation('common');
const label = t('results', { count });
```
Arabic pluralization is more complex; i18next supports it automatically if the locale is correctly set and plural forms are provided.

Interpolation (variables):
```json
{
  "welcomeUser": "Welcome, {{name}}"
}
```
```tsx
{t('welcomeUser', { name: user.name })}
```

---
## 9. Error Handling & Fallback Strategy
If a key is missing:
- i18next falls back to `en` (configured via `fallbackLng`).
- If also missing in `en`, it returns the key string (e.g. `filters.missingKey`). Treat that as a visual alert during development.

You can enforce completeness with a simple dev script comparing key sets across locales.

---
## 10. When to Externalize Translations
Consider moving translations to a headless CMS or translation platform when:
- Non-developers (content team) must update phrasing.
- You need live updates without redeployment.
- You manage >10 locales.

Migration path outline:
1. Replace dynamic file import with a fetch to an API endpoint that returns JSON.
2. Cache on server (RSC) and revalidate periodically.
3. Keep local JSON as fallback if remote fetch fails.

---
## 11. Testing i18n
Minimal Jest + React Testing Library approach (conceptual):
```tsx
import { render } from '@testing-library/react';
import I18nProviderClient from '@/components/I18nProviderClient';
import Component from './Component';

const resources = { en: { common: { hello: 'Hello' } } } as any;

test('renders translated text', () => {
  const { getByText } = render(
    <I18nProviderClient locale="en" resources={resources}>
      <Component />
    </I18nProviderClient>
  );
  expect(getByText('Hello')).toBeInTheDocument();
});
```
Add more tests only after core functionality is stable.

---
## 12. Migration to Multiple Namespaces Without Pain
Strategy:
1. Create new namespace(s) while leaving existing keys in `common`.
2. Move a small group of keys; update usages.
3. Deploy; verify.
4. Repeat gradually.

Avoid mass refactors; they generate noisy diffs and risk regressions.

---
## 13. Troubleshooting Cheat Sheet
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Keys show raw (e.g. `filters.search`) | Namespace not loaded | Add namespace to `getTranslation` + `useTranslation()` |
| Always redirected to `/en` | Locale header not parsed | Check `middleware.ts` accepted languages logic |
| Arabic still LTR | Missing `dir="rtl"` on html | Add dynamic `dir` attribute |
| Fallback not working | `fallbackLng` misconfigured | Confirm `fallbackLng = 'en'` in i18n.ts |
| Duplicate network fetches | Not passing resources to client | Ensure layout supplies `resources` prop |

---
## 14. Roadmap Suggestions (If Scope Grows)
| Stage | Enhancement |
|-------|-------------|
| Short | Add `filters` namespace; RTL dir attribute |
| Medium | Add 1–2 new locales; introduce pluralization tests |
| Longer | External translation service; key completeness check script |

---
## 15. Summary
The current i18n system is intentionally minimal and fast. Scale it only when there is a **real** need: more locales, large teams, or dynamic content. Keep key names consistent, preload only what you need, and label proposals clearly.

You can now link here from the main build guide for deeper i18n details.





























































































---
## 16. Current Repository Implementation (Real Code Reference)
The earlier sections showed generalized / pattern-oriented snippets. Below are the EXACT current implementations from the repository so future edits stay in sync.

### 16.1 src/lib/i18n.ts
```ts
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export const fallbackLng = 'en';
export const supportedLngs = [fallbackLng, 'ar'];
export const defaultNS = 'common';

async function initI18next(
  lng: string,
  ns: string | string[]
) {
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

export async function getTranslation(
  lng: string,
  ns: string | string[] = defaultNS
) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
    resources: i18nextInstance.services.resourceStore.data,
  };
}
```
Notes:
- This version creates a fresh i18n instance per request (simple + safe for RSC context isolation).
- For heavy traffic + many locales you could introduce a cache layer keyed by (lng, ns) but ONLY if profiling shows a bottleneck.

### 16.2 src/app/[locale]/layout.tsx
```tsx
import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/Layout';

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params; // NOTE: params is awaited (typed as Promise) in current code
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

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
```
Differences vs earlier example:
- Uses an awaited Promise for params (could be simplified to a plain object type if desired).
- Does not currently set <html lang / dir>; those could be added if you wrap this in a top-level HTML shell (see Section 10 for RTL). If you migrate to the new Next.js root layout signature, move provider contents inside <html> / <body>.

### 16.3 src/components/I18nProviderClient.tsx
```tsx
'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, supportedLngs, defaultNS } from '../lib/i18n';
import { Resource } from 'i18next';

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
Considerations:
- A new instance each render is acceptable because this component should only mount once at the app shell. If you notice double inits in React Strict Mode DEV, you can guard with a ref or reuse a memoized singleton.
- If you later add multiple namespaces, pass an array to ns and preload them server-side.

### 16.4 Recommended Improvements (Non-breaking)
These are safe enhancements you can adopt incrementally:
1. Add <html lang dir> wrapping (accessibility + proper RTL flow).
2. Convert params: Promise<{ locale: string }> → { locale: string } to align with standard Next.js route param typing.
3. Add an optional namespaces param to I18nProviderClient if you start preloading more than 'common'.
4. Introduce a development warning when a key is missing in a non-fallback locale.

---
End of real code reference.
