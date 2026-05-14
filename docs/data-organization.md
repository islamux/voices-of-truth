# Data Organization

> **Status:** ✅ Current — Accurately describes the data layer structure.

This document explains how scholar data is organized across the project files.

## Types

All data types are defined in `src/types/index.ts`:

- **`Scholar`** — id, name (Record<locale, string>), socialMedia[], countryId, categoryId, language[], avatarUrl, bio?
- **`Country`** — id, en, ar
- **`Specialization`** — id, en, ar

## Data Files

| File | Contents |
|------|----------|
| `src/data/countries.ts` | Array of 10 countries (id + en/ar labels) |
| `src/data/specializations.ts` | Array of 11 specializations mapped to categoryId |
| `src/data/scholars/` | 11 category-specific scholar files |
| `src/data/scholars.ts` | Barrel file that aggregates all category arrays |

### Scholars Directory (`src/data/scholars/`)

Each file exports a camelCase array of `Scholar[]` objects:

| File | Export | categoryId |
|------|--------|------------|
| `comparative-religion.ts` | `comparativeReligionScholars` | 1 |
| `contemporary-islamic-thought.ts` | `contemporaryIslamicThoughtScholars` | 2 |
| `dawah.ts` | `dawahScholars` | 3 |
| `hadith-studies.ts` | `hadithStudiesScholars` | 4 |
| `interfaith-dialogue.ts` | `interfaithDialogueScholars` | 5 |
| `islamic-history.ts` | `islamicHistoryScholars` | 6 |
| `islamic-jurisprudence.ts` | `islamicJurisprudenceScholars` | 7 |
| `islamic-thought.ts` | `islamicThoughtScholars` | 8 |
| `quran-interpretation.ts` | `quranInterpretationScholars` | 9 |
| `quran-studies.ts` | `quranStudiesScholars` | 10 |
| `spirituality-ethics.ts` | `spiritualityEthicsScholars` | 11 |

### Barrel File (`src/data/scholars.ts`)

Imports all 11 category arrays and re-exports a single flat `scholars: Scholar[]` array via spread. This is the sole entry point for consuming components.

## Data Flow

1. `src/data/scholars.ts` exports the full `scholars` array
2. `src/app/[locale]/page.tsx` (server component) imports and filters it based on `searchParams`
3. Filtering yields `filteredScholars`, `uniqueCountries`, `uniqueLanguages`, `uniqueCategories`
4. These are passed as props to `HomePageClient`
5. `FilterContext` manages client-side state (selected filters, search query) derived from URL params

## Adding a New Scholar

1. Open the appropriate category file in `src/data/scholars/`
2. Add a new object matching the `Scholar` interface to the array
3. Ensure `categoryId` matches the file's category

---

> **See also:**
> - [Build From Scratch](01-build-from-scratch.md) — step-by-step guide covering the full data pipeline
