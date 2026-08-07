# Scholar Detail Pages — Design

**Date:** 2026-08-07
**Status:** Approved
**Branch:** `feat/scholar-detail-pages`

## Goal

Make each scholar card link to a dedicated, SEO-friendly profile page that shows the full detail of one scholar. Reuses the existing locale chrome (theme, i18n, header/footer).

## Routing

- New route: `src/app/[locale]/scholars/[id]/page.tsx` — server component.
- URL shape: `/en/scholars/25`, `/ar/scholars/25` (`id` is the scholar's numeric id).
- Params: `locale`, `id`. Validate `id` (integer); look up the scholar in `scholars` from `src/data/scholars.ts`.
- Not found: if `id` is invalid or no scholar matches, call `notFound()` → renders the locale `not-found.tsx`.
- Reuses `src/app/[locale]/layout.tsx` (ThemeProvider + I18nProviderClient + PageLayout + ErrorBoundary). No new layout.

## Card → detail navigation (stretched-link)

- `ScholarCard`'s `<article>` gets `position: relative`.
- An absolutely-positioned `<Link>` overlay (`absolute inset-0`, default z-order) makes the whole card clickable and a single keyboard tab-stop. It carries an `aria-label` of the scholar's name.
- The social `<a>` elements gain `relative z-10` so they sit above the overlay and remain real anchors (valid HTML — no nested anchors; open-in-new-tab semantics preserved).
- Card builds its href from `i18n.language` + `scholar.id`.
- Existing card hover (border/shadow) provides affordance; the link adds `cursor-pointer` automatically.

## Detail page content (profile only)

- Large avatar via `next/image` (~192px), with the same fallback as `ScholarAvatar`.
- Name (display font), localized.
- Country — resolved from `countries` by `countryId`, localized.
- Specialization — resolved from `specializations` by `categoryId`, localized.
- Full bio, localized, unclamped.
- Language pills, localized via `languageLabel` (`src/lib/languages.ts`).
- Social links (reuses `SocialMediaLinks`).
- Back link to the directory home (`/[locale]`), labeled via new i18n key `backToDirectory`.

## SEO

- `generateStaticParams`: every scholar × every locale → `{ locale, id }`.
- `generateMetadata`: title = localized scholar name (uses root `%s · Voices of Truth` template); description = localized bio (fallback to a generic string if no bio).
- `sitemap.ts`: add one URL per scholar per locale (`/[locale]/scholars/[id]`).

## i18n

New key added to `public/locales/{en,ar}/common.json`:
- `backToDirectory` — EN: "Back to directory", AR: "العودة إلى الدليل".

All other strings reuse existing keys or come from data (names/bios are already bilingual).

## Out of scope (YAGNI / future)

- No "related scholars" row.
- No comments, ratings, or user content.
- No URL slug (id-based; slug is a future P3 enhancement).
- No new client interactivity beyond reused components (the page itself is a server component).

## Files

| Action | Path |
|--------|------|
| new | `src/app/[locale]/scholars/[id]/page.tsx` |
| edit | `src/components/ScholarCard.tsx` (stretched link) |
| edit | `src/components/SocialMediaLinks.tsx` (`relative z-10` on anchors) |
| edit | `src/app/sitemap.ts` (detail URLs) |
| edit | `public/locales/en/common.json`, `public/locales/ar/common.json` (`backToDirectory`) |

## Error handling

- Invalid/missing `id` → `notFound()` (graceful 404 via locale not-found page).
- Missing avatar → existing `next/image` onError fallback to `/avatars/default-avatar.png`.
- Missing bio → omit the bio block; metadata description falls back to a generic string.

## Testing

The project has no test framework. Verification: `pnpm lint` clean, `pnpm build` passes (static generation of all detail pages), and runtime checks that `/en/scholars/<id>` and `/ar/scholars/<id>` render (200) and an invalid id 404s.
