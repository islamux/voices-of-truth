# Docs Index

Documentation for the Voices of Truth — Scholar Directory project.

## Guides

| File | Status | Description |
|------|--------|-------------|
| [01-build-from-scratch](01-build-from-scratch.md) | ✅ Current | Step-by-step rebuild guide covering architecture, layouts, context, and filtering. |
| [03-styling-guide](03-styling-guide.md) | ✅ Current | Tailwind, PostCSS, CSS variables, dark mode strategy. |
| [04-feature-translation](04-feature-translation.md) | ✅ Current | Multi-language i18n with middleware, server/client split, `react-i18next`. |
| [12-layout-system](12-layout-system.md) | ✅ Current | Three-layer layout architecture (root → locale → PageLayout). |
| [data-organization](data-organization.md) | ✅ Current | Scholar data model, file layout, category mapping, and data flow. |
| [component-catalog](component-catalog.md) | ✅ Current | Complete component inventory with hierarchy diagram. |
| [documentation-guide](documentation-guide.md) | ✅ Current | Best practices for project docs (README, CONTRIBUTING, CHANGELOG). |

## Proposals

| File | Status | Description |
|------|--------|-------------|
| [06-feature-favorites-proposal](06-feature-favorites-proposal.md) | 📋 Proposal | `localStorage`-based favorites system with `useFavorites` hook. Not implemented. |
| [07-feature-loading-state-proposal](07-feature-loading-state-proposal.md) | 📋 Stale | Skeleton loading proposal. References non-existent code paths. |
| [09-feature-reusable-button-component-proposal](09-feature-reusable-button-component-proposal.md) | ✅ Implemented | Reusable Button component. Now exists as `src/components/Button.tsx`. |

## Implemented Solutions

| File | Status | Description |
|------|--------|-------------|
| [fix-hydration-error](fix-hydration-error.md) | ✅ Implemented | Theme hydration error fix using `useHasMounted()` guard. Applied in `ThemeToggle.tsx`. |
| [prop-drilling-deep-dive](prop-drilling-deep-dive.md) | ✅ Implemented | Prop drilling refactored using `FilterContext`. `FilterContext.tsx` exists in codebase. |
| [theme-analysis](theme-analysis.md) | ⚡ Mostly | Identified ThemeProvider/OS-preference issues. `next-themes` now in use. |

## Reference

| File | Status | Description |
|------|--------|-------------|
| [18-core-concept-children-prop](18-core-concept-children-prop.md) | ✅ Current | React `children` prop explained with Next.js layout examples. |
| [19-normal-vs-arrow-functions-and-callback-vs-higher-order](19-normal-vs-arrow-functions-and-callback-vs-higher-order.md) | ✅ Current | Function syntax vs callbacks vs HOF + callback patterns. |
| [improvement-plan](improvement-plan.md) | ✅ Current | Strategic 6-priority improvement plan with architecture recommendations. |

## Analysis

| File | Status | Description |
|------|--------|-------------|
| [best-practice-analysis-update](best-practice-analysis-update.md) | ✅ Current | Code review with SRP suggestions including `SocialIcon` extraction. |
| [17-component-refactoring-suggestions](17-component-refactoring-suggestions.md) | ⚡ Partial | Suggests extracting `useLocalizedScholar` and `SocialIcon`. Hook exists, icon suggestion pending. |
| [domain-driven-architecture](domain-driven-architecture.md) | 💡 Speculative | DDD principles mapped to the project. Conceptual — no code changes made. |

## Blueprints

| File | Status | Description |
|------|--------|-------------|
| [command-center-blueprint-textual](archive/command-center-blueprint-textual.md) | 🔵 Blueprint (Archived) | Build spec for a Textual TUI command center with MCP server. External — not part of this project. |
| [command-center-blueprint-voices-of-truth](archive/command-center-blueprint-voices-of-truth.md) | 🔵 Blueprint (Archived) | Adapted command center blueprint for this project. References `scholars-db.json` which doesn't exist. |
| [setup-command-center](archive/setup-command-center.md) | 💡 Speculative (Archived) | Instructions to install command center from external project. References paths outside this repo. |

---

*Last updated: 2026-05-14*
