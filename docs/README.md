# Docs Index

Documentation for the Voices of Truth — Scholar Directory project.

## Guides

| File | Status | Description |
|------|--------|-------------|
| [01-build-from-scratch](01-build-from-scratch.md) | ✅ Updated | Step-by-step rebuild guide. Custom `ThemeProvider`, `useSyncExternalStore`, Tailwind v4. |
| [03-styling-guide](03-styling-guide.md) | ✅ Current | Tailwind v4 CSS config, custom `ThemeProvider`, flash-prevention script. |
| [04-feature-translation](04-feature-translation.md) | ✅ Updated | Multi-language i18n via `[locale]` dynamic route (no middleware). |
| [12-layout-system](12-layout-system.md) | ✅ Current | Three-layer layout architecture (root → locale → PageLayout). |
| [data-organization](data-organization.md) | ✅ Current | Scholar data model, file layout, category mapping, and data flow. |
| [component-catalog](component-catalog.md) | ✅ Current | Component inventory. `ThemeToggle` uses custom `useTheme` hook. |
| [documentation-guide](documentation-guide.md) | ✅ Current | Best practices for project docs (README, CONTRIBUTING, CHANGELOG). |

## Proposals

| File | Status | Description |
|------|--------|-------------|
| [06-feature-favorites-proposal](06-feature-favorites-proposal.md) | 📋 Proposal | `localStorage`-based favorites system with `useFavorites` hook. Not implemented. |
| [07-feature-loading-state-proposal](archive/07-feature-loading-state-proposal.md) | 🗄️ Archived | Superseded by Suspense boundary in page.tsx (ms1_029). |
| [09-feature-reusable-button-component-proposal](09-feature-reusable-button-component-proposal.md) | ✅ Implemented | Reusable Button component. Now exists as `src/components/Button.tsx`. |

## Implemented Solutions

| File | Status | Description |
|------|--------|-------------|
| [fix-hydration-error](fix-hydration-error.md) | ✅ Implemented | Theme hydration error fix using `useHasMounted()` guard. Applied in `ThemeToggle.tsx`. |
| [prop-drilling-deep-dive](prop-drilling-deep-dive.md) | ✅ Implemented | Prop drilling refactored using `FilterContext`. `FilterContext.tsx` exists in codebase. |
| [theme-analysis](theme-analysis.md) | ✅ Implemented | Theme migration guide. Custom `ThemeProvider` in `src/lib/theme.tsx`, semantic tokens deployed. |
| | | |
| **New (post-upgrade)** | | |
| [ErrorBoundary](../src/components/ErrorBoundary.tsx) | ✅ Implemented | Class-based error boundary wrapping `PageLayout` |
| [Pagination](../src/components/Pagination.tsx) | ✅ Implemented | Server-side pagination (12 per page) with `?page=` search param |
| [search.ts](../src/lib/search.ts) | ✅ Implemented | `normalizeArabic()` diacritics-stripping utility for Arabic search |
| [sitemap.ts](../src/app/sitemap.ts) | ✅ Implemented | Dynamic sitemap with `/en` and `/ar` URLs, env-aware base |
| [not-found.tsx](../src/app/%5Blocale%5D/not-found.tsx) | ✅ Implemented | Custom 404 page with "Go home" link |

## Reference

| File | Status | Description |
|------|--------|-------------|
| [adr](adr.md) | ✅ Current | Architecture Decision Records for key design choices. |
| [18-core-concept-children-prop](18-core-concept-children-prop.md) | ✅ Current | React `children` prop explained with Next.js layout examples. |
| [19-normal-vs-arrow-functions-and-callback-vs-higher-order](19-normal-vs-arrow-functions-and-callback-vs-higher-order.md) | ✅ Current | Function syntax vs callbacks vs HOF + callback patterns. |
| [improvement-plan](improvement-plan.md) | ✅ Current | Strategic 6-priority improvement plan with architecture recommendations. |

## Analysis

| File | Status | Description |
|------|--------|-------------|
| [best-practice-analysis-update](best-practice-analysis-update.md) | ✅ Current | Code review with SRP suggestions including `SocialIcon` extraction. |
| [senior-project-analysis](senior-project-analysis.md) | ✅ Current | Senior-level analysis of architecture, code quality, and improvements. |
| [17-component-refactoring-suggestions](17-component-refactoring-suggestions.md) | ⚡ Partial | Suggests extracting `useLocalizedScholar` and `SocialIcon`. Hook exists, icon suggestion pending. |
| [domain-driven-architecture](domain-driven-architecture.md) | 💡 Speculative | DDD principles mapped to the project. Conceptual — no code changes made. |

---

*Last updated: 2026-06-30*
