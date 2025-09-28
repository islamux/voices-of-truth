# Project Documentation Hub & Learning Path

Welcome, developer! This document is the central starting point for understanding the "Voices of Truth" project. It provides a structured path through our documentation to help you get up to speed quickly.

## Proposed File Structure

To make the documentation easier to navigate and maintain, it is proposed that all tutorial and guide-related markdown files be moved into a dedicated `/docs` directory. The `README.md` should remain at the root as the primary project entry point.

**Proposed Structure:**
```
/
├── docs/
│   ├── 01_BUILD_FROM_SCRATCH.md
│   ├── 02_CORE_ARCHITECTURE.md
│   ├── 03_STYLING_GUIDE.md
│   ├── 04_FEATURE_TRANSLATION.md
│   ├── 05_FEATURE_FILTERING.md
│   ├── 06_FEATURE_FAVORITES.md
│   ├── 07_FEATURE_LOADING_STATE.md
│   └── 08_DEV_CODE_ORGANIZATION.md
├── src/
├── ...
└── README.md
```

**Action Required:**
1.  Create a `docs/` directory in the project root.
2.  Rename and move the existing markdown files according to the naming convention above.

---

## Recommended Learning Path

Follow these tutorials in order to build a comprehensive understanding of the project, from its basic setup to its advanced features.

### Part 1: The Foundation

1.  **[Project Overview (`../README.md`)](\./../README.md)**
    *   **Purpose:** Understand the project's mission, goals, and tech stack at a high level.

2.  **[Building From Scratch (`01_BUILD_FROM_SCRATCH.md`)](\./01_BUILD_FROM_SCRATCH.md)**
    *   **Purpose:** A step-by-step guide to rebuilding the project, covering the initial data structures and server-side rendering setup.

### Part 2: Core Concepts

3.  **[Core Architecture: Server vs. Client Components (`02_CORE_ARCHITECTURE.md`)](\./02_CORE_ARCHITECTURE.md)**
    *   **Purpose:** Deepen your understanding of the fundamental architectural pattern in this Next.js project.

4.  **[Styling with Tailwind CSS (`03_STYLING_GUIDE.md`)](\./03_STYLING_GUIDE.md)**
    *   **Purpose:** Learn how Tailwind CSS and PostCSS are configured and used for styling components.

### Part 3: Feature Implementation Tutorials

5.  **[Feature: Internationalization (i18n) (`04_FEATURE_TRANSLATION.md`)](\./04_FEATURE_TRANSLATION.md)**
    *   **Purpose:** A detailed walkthrough of how the multi-language translation feature is implemented using `i18next`.

6.  **[Feature: Server-Side Filtering (`05_FEATURE_FILTERING.md`)](\./05_FEATURE_FILTERING.md)**
    *   **Purpose:** Understand how the powerful server-side filtering mechanism works with URL search parameters.

7.  **[Feature: Add to Favorites (`06_FEATURE_FAVORITES.md`)](\./06_FEATURE_FAVORITES.md)**
    *   **Purpose:** Learn how a client-side feature using `localStorage` is integrated with the server-centric architecture (Hybrid Model).

8.  **[Feature: Loading States (`07_FEATURE_LOADING_STATE.md`)](\./07_FEATURE_LOADING_STATE.md)**
    *   **Purpose:** A guide on implementing loading indicators to improve user experience during data fetching.

### Part 4: Development & Planning

9.  **[Code Organization & Future Suggestions (`08_DEV_CODE_ORGANIZATION.md`)](\./08_DEV_CODE_ORGANIZATION.md)**
    *   **Purpose:** Review completed refactoring tasks and understand potential future improvements and features.

