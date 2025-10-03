# Fix Report: ReferenceError `locale is not defined` in `src/app/[locale]/page.tsx`

## 1. Issue Summary
A runtime error occurred:
```
ReferenceError: locale is not defined
at src/app/[locale]/page.tsx:61:28
```
It happened when building localized country and category labels:
```ts
label: country.name[locale] || country.name.en
```
But `locale` had never been defined in the component scope.

---

## 2. Root Cause
In the page component:
```ts
export default async function HomePage({ params, searchParams }: HomePageProps) {
  // locale was NOT extracted
  const { query, country, lang, category } = searchParams;
  ...
  country.name[locale];
}
```
The `params` object (which contains `locale` from the dynamic segment `[locale]`) was passed in, but its `locale` field was never destructured.

---

## 3. Resolution
Add:
```ts
const { locale } = params;
```
near the top of the component.

### Fixed Code Excerpt
```ts
export default async function HomePage({ params, searchParams }: HomePageProps) {
  // 1. Extract locale from dynamic route params and filter values from URL search parameters.
  //    (Bug fix: previously locale wasn't extracted, causing ReferenceError when used below.)
  const { locale } = params;
  const { query, country, lang, category } = searchParams;

  const searchQuery = (query || '').toString().toLowerCase();

  // Filtering logic ...
  const uniqueCountries = [...new Set(scholars.map(s => s.countryId))]
    .map(id => countries.find(c => c.id === id))
    .filter((country): country is Country => country !== undefined)
    .map(country => ({
      value: country.name.en,
      label: country.name[locale] || country.name.en,
    }));

  const uniqueCategories = [...new Set(scholars.map(s => s.categoryId))]
    .map(id => specializations.find(s => s.id === id))
    .filter((specialization): specialization is Specialization => specialization !== undefined)
    .map(specialization => ({
      value: specialization.name.en,
      label: specialization.name[locale] || specialization.name.en,
    }));
}
```

---

## 4. Why This Works
- `params` is provided automatically by Next.js for dynamic route segments (like `[locale]`).
- Destructuring ensures `locale` is available before using it to access language-specific name fields.
- No extra imports or architectural changes required.

---

## 5. Optional Hardening (Future Improvement)
| Idea | Benefit | Example |
|------|---------|---------|
| Default fallback | Prevents accidental undefined | `const { locale = 'en' } = params;` |
| Validate locale | Avoid unsupported locale errors | `if (!supportedLngs.includes(locale)) ...` |
| Extract mappers | Reuse + testability | `buildLocalizedOptions(scholars, countries, locale)` |

---

## 6. Quick Checklist After Fix
| Check | Status |
|-------|--------|
| Page renders at `/en` | ✅ |
| Page renders at `/ar` | ✅ |
| No 500 error | ✅ |
| Localized labels display | ✅ |

---

## 7. Summary
The error was caused by a missing destructure of the `locale` param. Adding `const { locale } = params;` resolved the issue cleanly with minimal code change.

If you want this integrated into a changelog or PR description, you can copy this file.
