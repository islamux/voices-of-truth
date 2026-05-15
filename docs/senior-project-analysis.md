# Senior Project Analysis

Last reviewed: 2026-05-15

## Executive Summary

Voices of Truth is a focused Next.js 15 scholar directory with a clear product surface: localized browsing, URL-driven filters, server-side filtering, theme switching, and a static TypeScript data source. The current codebase is small enough to move quickly, but it already has the main architectural ingredients of a maintainable application: typed domain models, category-split data files, locale-based routing, reusable UI components, and a docs hub.

The most important technical theme is consistency. The app uses good patterns in several places, but some older decisions remain beside newer ones: Tailwind theme tokens coexist with undefined raw CSS variables, server/client boundaries are mostly clean but not fully intentional, and some documentation reflects earlier implementation stages. The next senior move is not a large rewrite. It is to stabilize the foundations before the planned Supabase migration.

## Current Product Shape

- **Framework:** Next.js 15 App Router with React 19.
- **Styling:** Tailwind CSS with class-based dark mode through `next-themes`.
- **Localization:** `react-i18next`, `i18next`, dynamic `/[locale]` routes, and middleware-based locale redirection.
- **Data source:** Static TypeScript arrays under `src/data/`, split by scholar specialization.
- **Domain size today:** 26 scholars, 10 countries, and 11 specializations.
- **Filtering:** Server-side filtering in `src/app/[locale]/page.tsx`, driven by URL search params.
- **Client interactivity:** Filter controls, language switching, theme toggling, and animated cards.
- **Project process:** Command Center metadata exists in `project-tracker.json`; the active focus is bug fixes/code quality with Supabase migration queued as the next major priority.

## Architecture Map

### Routing and Layout

The app uses a three-layer layout model:

1. `src/app/layout.tsx` defines document-level metadata, global styles, `<html>`, and `<body>`.
2. `src/app/[locale]/layout.tsx` loads locale resources and wraps the route with `I18nProviderClient`, `ThemeProvider`, and `PageLayout`.
3. `src/components/PageLayout.tsx` renders the persistent header, main content container, and footer.

This separation is healthy because it keeps global document concerns away from application chrome. The main caution is that locale ownership should stay in the `[locale]` segment. The root layout currently awaits `params.locale`, but the root layout sits above the dynamic segment and should not be the main source of locale behavior. Locale-aware behavior belongs in `src/app/[locale]/layout.tsx` and route-level code.

### Data Flow

The main page follows a server-first flow:

1. Import static datasets from `src/data/scholars.ts`, `src/data/countries.ts`, and `src/data/specializations.ts`.
2. Read `query`, `country`, `lang`, and `category` from `searchParams`.
3. Filter scholars on the server.
4. Derive filter option lists.
5. Pass filtered data and option lists into `HomePageClient`.

That is a good fit for the current data scale. It also gives the app a clean migration path to Supabase: replace static imports with a repository/query layer while preserving the URL contract and component props.

### Component System

The component structure is understandable and mostly cohesive:

- `FilterBar` is a composition container.
- `FilterContext` removes prop drilling across filter controls.
- `ScholarList` resolves country names and renders cards.
- `ScholarCard` delegates image, text, and social links to child components.
- `useLocalizedScholar` centralizes scholar localization.

The main issue is not component count; it is uneven maturity. Some files are nicely extracted, while others contain stale comments, inconsistent formatting, or styling conventions from an earlier theme implementation.

## Strengths

- **URL as state:** Filters are shareable, bookmarkable, and server-compatible.
- **Server-side filtering:** The first render already contains the correct result set.
- **Typed domain model:** `Scholar`, `Country`, and `Specialization` give the data model a clear shape.
- **Good data organization:** Category-specific scholar files make the dataset easier to grow than one large file.
- **i18n foundation is real:** Arabic/English support is not just text replacement; routing and RTL direction are considered.
- **Hydration awareness:** `ThemeToggle` uses `useHasMounted`, which shows the project already hit and addressed common theme hydration issues.
- **Docs culture:** The `docs/` directory is unusually rich for a small project, which will help future refactors.

## Key Risks and Findings

### P1: Theme Variables Are Inconsistent

Several components use raw CSS variables such as `--card-bg-rgb`, `--card-border-rgb`, `--muted-text-rgb`, `--foreground-rgb`, and `--shadow-color-rgba`. The active theme tokens in `globals.css` are HSL variables such as `--card`, `--border`, `--muted-foreground`, and `--foreground`.

Impact:

- Card and social link colors may fail or render unexpectedly.
- Light mode defects in the tracker are likely connected to this split theme strategy.
- Future styling work will remain fragile until one token system wins.

Recommendation:

- Convert components to Tailwind token classes such as `bg-card`, `text-card-foreground`, `border-border`, `text-muted-foreground`, and `hover:text-foreground`.
- Remove or avoid undocumented raw RGB variables unless they are reintroduced deliberately in `globals.css`.

### P1: Root Layout Locale Handling Should Be Rechecked

`src/app/layout.tsx` awaits `params.locale` and applies `lang`/`dir` at the root document level. Since the dynamic segment is under `[locale]`, locale data is more naturally owned by `src/app/[locale]/layout.tsx`.

Impact:

- This can become brittle during Next.js upgrades or static generation changes.
- Document language and direction may not behave as expected if the root layout does not receive the segment params.

Recommendation:

- Keep root layout minimal and move locale-derived document behavior into the locale layout where possible.
- If `<html lang>` must be controlled per locale, verify the exact Next.js behavior with a production build before relying on it.

### P1: Filter Controls Do Not Reflect Current URL State

Filters write to the URL but the controls do not currently read their selected values from `useSearchParams`. Search input and selects are effectively uncontrolled from the current URL.

Impact:

- Reloading or opening a shared filtered URL can show filtered results while controls appear reset.
- Users may lose confidence because UI state and result state disagree.

Recommendation:

- Pass current filter values through `FilterContext` or let each filter read `useSearchParams`.
- Set `value` on `SearchInput` and each `FilterDropdown`.

### P2: Search Updates Route on Every Keypress

`SearchInput` calls `router.push` through context on every `onChange`.

Impact:

- Every keystroke creates navigation work.
- Browser history can become noisy.
- The behavior will become more expensive after moving filtering to Supabase.

Recommendation:

- Use `router.replace` for filter changes, especially search.
- Debounce search input or submit search explicitly after a short delay.

### P2: Query Parsing Needs Guardrails

`country` and `category` are parsed with `parseInt` directly. Invalid values become `NaN`, which safely returns no matches, but this is accidental rather than explicit.

Impact:

- Bad URLs can produce confusing empty states.
- Supabase migration will need stricter query validation anyway.

Recommendation:

- Add a small parser for filter params.
- Treat invalid numeric filters as absent or redirect to a normalized URL.

### P2: Client Boundary Is Wider Than Necessary

`PageLayout` is a client component because it contains `Header` and `Footer`. This makes the full layout subtree client-owned even though much of it is static structure.

Impact:

- More JavaScript is shipped than necessary.
- Server component benefits are reduced around the shell.

Recommendation:

- Consider keeping `PageLayout` as a server component and moving client behavior into leaf components such as `ThemeToggle` and `LanguageSwitcher`.

### P2: Social Icon Mapping Is String-Based

Scholar data stores icon names such as `FaYoutube`, and `SocialMediaLinks` switches on those strings.

Impact:

- Data is coupled to a specific icon library.
- Typos silently fall back to a generic link icon.

Recommendation:

- Store platform identifiers like `youtube`, `facebook`, or `telegram`.
- Map platforms to icons in one UI-only utility.

### P3: Comments and Formatting Need Cleanup

Some files include tutorial-style comments, stale notes, inconsistent spacing, and minor typos such as `LanguageSwicher`.

Impact:

- The app still reads partly like a learning branch instead of a production branch.
- Future contributors may copy inconsistent patterns.

Recommendation:

- Remove comments that only narrate obvious code.
- Keep comments that explain architecture or non-obvious behavior.
- Rename misspelled imports/components when the blast radius is low.

## Supabase Migration Readiness

The project is close to ready for a database-backed version, but it should introduce a data access boundary before wiring Supabase directly into page components.

Recommended migration shape:

1. Create a `src/lib/scholars` or `src/services/scholars` module that exposes query functions.
2. Keep the current static arrays behind that API first.
3. Define a filter input type that mirrors the URL query contract.
4. Add Supabase implementation behind the same API.
5. Preserve component props until database behavior is stable.

Suggested relational model:

- `scholars`: id, slug, country_id, primary_category_id, avatar_url, created_at, updated_at.
- `scholar_translations`: scholar_id, locale, name, bio.
- `countries`: id, code or slug.
- `country_translations`: country_id, locale, name.
- `specializations`: id, slug.
- `specialization_translations`: specialization_id, locale, name.
- `scholar_languages`: scholar_id, language_code.
- `scholar_social_links`: scholar_id, platform, url, sort_order.

Indexes to plan early:

- `scholars.country_id`
- `scholars.primary_category_id`
- `scholar_languages.language_code`
- `scholar_translations.locale`
- Search index for translated names if search must scale.

## Recommended Execution Plan

### Phase 1: Stabilize Foundation

- Unify theme tokens and remove undefined CSS variable usage.
- Verify root/locale layout behavior with a production build.
- Make filter controls controlled by URL state.
- Replace search `router.push` with debounced `router.replace`.

### Phase 2: Clarify Data Contracts

- Add query parsing helpers for URL filter params.
- Add a scholar repository layer that initially wraps static data.
- Move platform-to-icon mapping out of data assumptions.
- Add basic validation for duplicate scholar ids and missing country/category references.

### Phase 3: Prepare Database Migration

- Design Supabase schema from the existing types.
- Write seed transformation from TypeScript data to relational tables.
- Keep public read-only policies simple at first.
- Switch the repository layer from static data to Supabase queries.

### Phase 4: Improve Product Polish

- Add empty states for no filter results.
- Add loading or pending states for route updates.
- Improve accessibility labels and focus states.
- Add tests around query parsing, localization fallback, and filtering.

## Suggested Senior Priorities

1. Fix theme consistency first because it directly affects visible correctness and matches the active tracker focus.
2. Normalize filter URL/control behavior before any backend migration.
3. Introduce a data access boundary before adding Supabase.
4. Clean production-facing comments and naming after functional risks are handled.
5. Keep documentation current by retiring stale docs or marking them clearly in `docs/README.md`.

## Verification Notes

- Command Center CLI could not be run in this shell because `pnpm` is not installed.
- Tracker status was reviewed directly from `project-tracker.json`.
- Analysis was based on current files under `src/app`, `src/components`, `src/context`, `src/data`, `src/lib`, project configuration, and existing documentation.
