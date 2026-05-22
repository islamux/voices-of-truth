# Architecture Decision Records

> **Status:** ✅ Current — Records key architectural decisions made during development.

## ADR-001: ThemeProvider wraps I18nProviderClient

**Date:** 2026-05-22
**Context:** Theme state was lost when switching locales because I18nProviderClient remounted, destroying the theme context.
**Decision:** ThemeProvider wraps I18nProviderClient (outer → inner), not nested inside.
**Consequence:** Theme persists across locale switches. The locale layout renders `<ThemeProvider><I18nProviderClient><PageLayout>...</PageLayout></I18nProviderClient></ThemeProvider>`.

## ADR-002: URL query params as single source of truth for filters

**Date:** 2026-05-22
**Context:** Filter controls were uncontrolled from URL state — results could disagree with UI after sharing/reloading a filtered URL.
**Decision:** Every filter reads its current value from `useSearchParams`. Filter changes write to URL. FilterContext provides currentFilters derived from URL.
**Consequence:** Filters are bookmarkable, shareable, and server-compatible. Controls always reflect the actual result set.

## ADR-003: router.replace over router.push for filter updates

**Date:** 2026-05-22
**Context:** Every keystroke in search created a new history entry via router.push, polluting browser history.
**Decision:** Use router.replace for all filter changes.
**Consequence:** Cleaner browser history. Back button returns to previous page, not previous filter state.

## ADR-004: gap-* over space-x-* for RTL-safe layout

**Date:** 2026-05-22
**Context:** space-x-* applies left/right margins which break in RTL mode (Arabic).
**Decision:** Use gap-* on flex containers instead of space-x-* / mx-* for horizontal spacing.
**Consequence:** Layout works correctly in both LTR (English) and RTL (Arabic) without conditional styling.

## ADR-005: Absolute avatar fallback path

**Date:** 2026-05-22
**Context:** Relative fallback path (default-avatar.png) broke on nested routes.
**Decision:** Use absolute path `/avatars/default-avatar.png` for onError fallback. Use useState to manage fallback state.
**Consequence:** Fallback renders correctly regardless of current route depth.

## ADR-006: Suspense boundary for useSearchParams

**Date:** 2026-05-22
**Context:** Next.js requires useSearchParams to be wrapped in a Suspense boundary (throws error otherwise).
**Decision:** Wrap HomePageClient in `<Suspense>` in page.tsx server component.
**Consequence:** No build/rendering errors. Loading fallback shown during search param resolution.

## ADR-007: CSS variable theme tokens over hardcoded colors

**Date:** 2026-05-22
**Context:** Components used hardcoded gray/slate colors and undocumented CSS variables (--card-bg-rgb, --foreground-rgb).
**Decision:** Replace with Tailwind theme tokens (bg-card, text-foreground, border-border, bg-background) defined in tailwind.config.ts.
**Consequence:** Single source of truth for colors. Dark/light mode works consistently. No undefined CSS variables.

## ADR-008: invalid filter params silently fall through

**Date:** 2026-05-22
**Context:** parseInt on invalid country/category params produced NaN which silently returned no results.
**Decision:** Precompute validCountryIds/validCategoryIds sets. Invalid values are ignored (treated as unset, show all).
**Consequence:** Bad URLs show all results instead of empty state. Graceful degradation.

## ADR-009: Custom ThemeProvider over next-themes for Next.js 16

**Date:** 2026-05-22
**Context:** next-themes 0.4.6 renders `<script>` tags for flash prevention. React 19 / Next.js 16 rejects inline script tags inside React components with a console error. next-themes is unmaintained (no update since 2024).
**Decision:** Replace next-themes with a custom ThemeProvider + useTheme in `src/lib/theme.tsx`. The flash-prevention script is moved to the root layout's `<head>` using `dangerouslySetInnerHTML` (before hydration, not inside React component tree).
**Consequence:** No script-tag console errors. Zero external theme dependency. Flash prevention still works. Custom provider is ~70 lines vs next-themes' bundled dependency.

---

> **See also:** [Improvement Plan](improvement-plan.md) — strategic priorities
