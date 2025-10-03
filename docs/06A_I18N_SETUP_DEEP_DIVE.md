# Internationalization Setup Deep Dive (Section 6 Expanded)

> STATUS: Implemented / Detailed
> SCOPE: This document elaborates on Section 6 of `01_BUILD_FROM_SCRATCH.md` and bridges into `I18N_ADVANCED.md` without repeating its scaling topics. Use this when (a) first wiring i18n or (b) onboarding a new contributor who must understand exactly how locale data flows from disk → server → client.

---
## 1. Goals of the i18n Layer
- Provide localized UI strings for English (en) and Arabic (ar)
- Minimize network requests (no duplicate client fetches)
- Support server-side rendering (SSR) with hydration safety
- Enable Right-To-Left (RTL) for Arabic cleanly
- Keep baseline simple so later features (more locales, namespaces) can layer on

If you need scaling topics (pluralization strategy, namespace splitting, external services), jump to: `docs/I18N_ADVANCED.md`.

---
## 2. Directory & File Anatomy
```
public/
  locales/
    en/
      common.json
    ar/
      common.json
src/
  lib/
    i18n.ts            # i18next configuration + helper exports
  app/
    [locale]/
      layout.tsx       # Fetches & injects translations (server)
      page.tsx         # Uses data + passes through to client
components/
  I18nProviderClient.tsx  # Wraps react-i18next on the client
middleware.ts             # Locale detection + routing
```
Key principle: Only the server (layout) loads translation JSON. The client receives already-hydrated resources.

---
## 3. Translation Resource Shape
Example `public/locales/en/common.json`:
```json
{
  "app": {
    "title": "Voices of Truth"
  },
  "filters": {
    "searchPlaceholder": "Search scholars...",
    "country": "Country",
    "language": "Language",
    "category": "Category"
  },
  "labels": {
    "noResults": "No scholars match your filters"
  }
}
```
Arabic mirrors the same nested keys so fallback rarely triggers:
```json
{
  "app": { "title": "أصوات الحق" },
  "filters": {
    "searchPlaceholder": "ابحث عن علماء...",
    "country": "الدولة",
    "language": "اللغة",
    "category": "التخصص"
  },
  "labels": { "noResults": "لا توجد نتائج مطابقة" }
}
```
Rules:
- Keep consistent key hierarchy across locales.
- Avoid embedding formatting syntax (like raw HTML) inside translation values—keep values plain text.

---
## 4. i18n Initialization (src/lib/i18n.ts)
Typical contents (abridged illustrative pattern):
```ts
import i18next, { Resource } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

export const supportedLngs = ['en', 'ar'] as const;
export const fallbackLng = 'en';

let initialized: Promise<typeof i18next> | null = null;

function initI18n(lng: string, ns: string[] = ['common']) {
  if (!initialized) {
    initialized = i18next
      .use(initReactI18next)
      .use(
        resourcesToBackend((language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
        )
      )
      .init({
        lng,
        fallbackLng,
        supportedLngs: [...supportedLngs],
        defaultNS: 'common',
        ns,
        fallbackNS: 'common',
        interpolation: { escapeValue: false },
        react: { useSuspense: false }
      });
  } else {
    // If already initialized, just change language / namespaces if needed
    if (i18next.language !== lng) i18next.changeLanguage(lng);
  }
  return initialized;
}

export async function getTranslation(lng: string, ns: string[] = ['common']) {
  await initI18n(lng, ns);
  const resources: Resource = {} as any;
  // Extract only loaded namespaces for hydration
  ns.forEach(n => {
    resources[lng] = resources[lng] || {};
    resources[lng][n] = i18next.getResourceBundle(lng, n);
  });
  return { i18n: i18next, resources };
}
```
Important details:
- `resourcesToBackend` defers JSON loading to dynamic import → tree-shake friendly.
- A singleton init ensures we don't re-initialize for every request in dev hot reload scenarios.
- We manually construct a minimal `resources` object for client hydration (only current locale + namespaces).

---
## 5. Locale Detection (middleware.ts)
Purpose: Redirect bare paths to a locale-prefixed one (e.g. `/` → `/en`).
High-level logic (conceptual):
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supportedLngs, fallbackLng } from './src/lib/i18n';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Skip if path already has locale segment
  if (supportedLngs.some(l => pathname.startsWith(`/${l}`))) {
    return NextResponse.next();
  }
  // Basic Accept-Language sniff
  const header = req.headers.get('accept-language') || '';
  const preferred = header.split(',')[0]?.split('-')[0];
  const match = supportedLngs.includes(preferred as any) ? preferred : fallbackLng;
  const url = req.nextUrl.clone();
  url.pathname = `/${match}${pathname}`;
  return NextResponse.redirect(url);
}
```
Edge Cases:
- Static assets (`/favicon.ico`, etc.) should usually be excluded via `matcher` config if needed.
- If you later add API routes, ensure you don't redirect those unexpectedly.

---
## 6. Server Layout Wiring ([locale]/layout.tsx)
Responsibilities:
1. Receive the dynamic `locale` param.
2. Load translations ON THE SERVER using `getTranslation(locale)`.
3. Supply i18n resources to a client provider wrapper.
4. Set `<html lang>` and `dir` attributes.

Pattern:
```tsx
// src/app/[locale]/layout.tsx
import I18nProviderClient from '@/components/I18nProviderClient';
import { getTranslation, fallbackLng } from '@/lib/i18n';
import type { ReactNode } from 'react';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default async function LocaleLayout({ params, children }: { params: { locale: string }, children: ReactNode }) {
  const locale = params.locale || fallbackLng;
  const { resources } = await getTranslation(locale, ['common']);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir}>
      <body>
        <I18nProviderClient locale={locale} resources={resources}>
          {children}
        </I18nProviderClient>
      </body>
    </html>
  );
}
```
Notes:
- `generateStaticParams` enables static generation for each locale path.
- No client fetch for translation JSON is needed post-hydration.

---
## 7. Client Provider (I18nProviderClient)
Wraps `I18nextProvider` (or the react-i18next hook layer). Minimal example:
```tsx
'use client';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useRef } from 'react';

type Props = { locale: string; resources: any; children: React.ReactNode };

export default function I18nProviderClient({ locale, resources, children }: Props) {
  const initialized = useRef(false);
  if (!initialized.current) {
    // Inject preloaded resources (idempotent in practice)
    Object.keys(resources[locale]).forEach(ns => {
      if (!i18next.hasResourceBundle(locale, ns)) {
        i18next.addResourceBundle(locale, ns, resources[locale][ns], true, true);
      }
    });
    i18next.changeLanguage(locale);
    initialized.current = true;
  }
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
```
Rationale:
- Uses a ref to prevent re-adding bundles on every re-render.
- Relies on server-hydrated `resources` to avoid network waterfalls.

---
## 8. Consuming Translations (Component Level)
Usage inside a client or server component (server components require careful hook avoidance—prefer client):
```tsx
'use client';
import { useTranslation } from 'react-i18next';

export function FilterBarTitle() {
  const { t, i18n } = useTranslation('common');
  return <h2 className="text-xl font-semibold">{t('app.title')}</h2>;
}
```
If you need dynamic field selection from a multilingual record:
```ts
const localizedName = scholar.name[i18n.language] || scholar.name.en;
```

---
## 9. Data vs. Translation Boundary
What goes in translation JSON vs. static data?
Put in translations:
- UI labels
- Placeholder text
- Status / error messages
Keep in static domain data (TypeScript `data/*.ts`):
- Scholar names, countries, categories (already bilingual via `Record<string,string>`)
Reason: Domain data may later move to a database; UI strings remain editorial.

---
## 10. RTL Considerations (Baseline)
Already implemented basics:
- `<html dir="rtl">` when locale = `ar`
- Tailwind handles direction-aware utilities (for margin/padding you can still use logical utilities if needed)
Avoid embedding directional assumptions (like left/right icons) directly in translation values.

---
## 11. Common Failure Modes (Setup Stage)
| Symptom | Cause | Fix |
|---------|-------|-----|
| Keys render literally | Namespace not loaded | Ensure `['common']` passed to `getTranslation` & `useTranslation('common')` |
| Always English | `changeLanguage` never invoked client-side | Confirm `I18nProviderClient` sets language |
| 404 on locale route | Missing in `generateStaticParams` | Add the locale there |
| Flash of untranslated content | Client fetching again | Remove client-side manual init duplication |
| Arabic still LTR | Missing `dir` attribute | Add `dir` in layout |

---
## 12. Extending From Here
When base works and you need more:
- Add new locales: replicate folder + add to `supportedLngs` (see Advanced doc Section 2).
- Add namespaces when common.json grows large.
- Introduce pluralization keys once you show counts.
See: `docs/I18N_ADVANCED.md` for the scaling path.

---
## 13. Minimal Validation Checklist
Tick these after wiring:
- [ ] Visiting `/` redirects to `/en`
- [ ] Visiting `/ar` shows Arabic strings + `dir="rtl"`
- [ ] No extra network requests for `common.json` after initial HTML
- [ ] Changing locale path manually updates all labels
- [ ] Fallback works if you temporarily delete an Arabic key (shows English)

---
## 14. Summary
The Section 6 setup establishes a lean, SSR-friendly i18n pipeline:
Disk JSON → Server load (once) → Hydrated client provider → Hook consumption.
That keeps performance high, complexity low, and leaves a clean seam for future expansion.

If you now need scaling strategy, jump to `I18N_ADVANCED.md`.
