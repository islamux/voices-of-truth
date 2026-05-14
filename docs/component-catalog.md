# Component Catalog

> **Status:** ✅ Current — Accurately lists all components in the codebase.

This document catalogs every component in `src/components/`, organized by role.

## Layout & Shell

| Component | File | Role |
|-----------|------|------|
| `PageLayout` | `src/components/PageLayout.tsx` | Main UI shell — wraps Header + page content + Footer |
| `Header` | `src/components/Header.tsx` | Top navigation bar |
| `Footer` | `src/components/Footer.tsx` | Site footer |

## Scholar Display

| Component | File | Role |
|-----------|------|------|
| `ScholarCard` | `src/components/ScholarCard.tsx` | Card displaying a single scholar's avatar, name, info, and social links |
| `ScholarAvatar` | `src/components/ScholarAvatar.tsx` | Avatar image with fallback |
| `ScholarInfo` | `src/components/ScholarInfo.tsx` | Scholar name, country, and specialization labels |
| `SocialMediaLinks` | `src/components/SocialMediaLinks.tsx` | Social media icon links |
| `ScholarList` | `src/components/ScholarList.tsx` | Maps over filtered scholars rendering `ScholarCard` |

## Filters

| Component | File | Role |
|-----------|------|------|
| `FilterBar` | `src/components/FilterBar.tsx` | Layout container for all filter controls |
| `CountryFilter` | `src/components/filters/CountryFilter.tsx` | Dropdown to filter by country |
| `LanguageFilter` | `src/components/filters/LanguageFilter.tsx` | Dropdown to filter by language |
| `CategoryFilter` | `src/components/filters/CategoryFilter.tsx` | Dropdown to filter by specialization |
| `SearchInput` | `src/components/filters/SearchInput.tsx` | Text input for name search |
| `FilterDropdown` | `src/components/filters/FilterDropdown.tsx` | Reusable dropdown used by country/language/category filters |

## UI Primitives

| Component | File | Role |
|-----------|------|------|
| `Button` | `src/components/Button.tsx` | Reusable styled button |

## Theme & i18n

| Component | File | Role |
|-----------|------|------|
| `ThemeToggle` | `src/components/ThemeToggle.tsx` | Dark/light mode toggle using `next-themes` |
| `LanguageSwitcher` | `src/components/LanguageSwitcher.tsx` | Arabic/English locale switcher |
| `I18nProviderClient` | `src/components/I18nProviderClient.tsx` | Client-side i18next provider wrapper |

## Component Hierarchy

```
PageLayout
├── Header
│   ├── LanguageSwitcher
│   └── ThemeToggle
├── Page Content (children prop)
│   ├── FilterBar
│   │   ├── SearchInput
│   │   ├── CountryFilter
│   │   ├── LanguageFilter
│   │   └── CategoryFilter
│   └── ScholarList
│       └── ScholarCard (×N)
│           ├── ScholarAvatar
│           ├── ScholarInfo
│           └── SocialMediaLinks
└── Footer
```

---

> **See also:**
> - [Build From Scratch](01-build-from-scratch.md) — how components connect in the full architecture
> - [FilterContext & Prop Drilling](prop-drilling-deep-dive.md) — how filters interact with shared state
