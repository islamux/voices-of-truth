# Post-Upgrade Improvements

Branch: `improvements/post-upgrade`

## Tasks

### Task 1: RTL/LTR direction in Header
**Files:** `src/components/Header.tsx`
**Spec:** Header layout (flex row, spacing) must flip when switching between Arabic (RTL) and English (LTR). Use `useTranslation` to detect current language and apply `dir` attribute or conditional classes.
**Commit:** `feat: add RTL/LTR direction support to Header`

### Task 2: Empty state for no filter results
**Files:** `src/components/ScholarList.tsx`
**Spec:** When `scholars` array is empty, render a centered message "(t('noResults')" instead of an empty grid. Use `useTranslation('common')` for the translation key.
**Commit:** `feat: add empty state when no scholars match filters`

### Task 3: Error boundary
**Files:** `src/components/ErrorBoundary.tsx`
**Spec:** Create a client component error boundary that catches render errors and shows a fallback UI. Optional: wrap `ScholarCard` instances or the main content area.
**Commit:** `feat: add ErrorBoundary component for graceful crash handling`

### Task 4: Arabic diacritics search
**Files:** `src/app/[locale]/page.tsx`
**Spec:** Normalize search query and scholar names by removing Arabic diacritics (tashkeel: fat-ha, damma, kasra, sukun, shadda, etc.) before comparison. Implement a `normalizeArabic(text: string): string` helper in `src/lib/search.ts`.
**Commit:** `feat: normalize Arabic diacritics in search`

### Task 5: Remove duplicate interface
**Files:** `src/app/[locale]/layout.tsx`
**Spec:** The `LocaleLayoutProps` interface is defined twice (lines 7-10 and 21-25). Remove the duplicate.
**Commit:** `fix: remove duplicate LocaleLayoutProps interface`

### Task 6: SEO
**Files:** `src/app/[locale]/page.tsx`, new `src/app/sitemap.ts`
**Spec:** Add `generateMetadata` to the home page with locale-aware title/description. Add a simple `sitemap.ts` that lists `/en` and `/ar` routes.
**Commit:** `feat: add generateMetadata and sitemap`

### Task 7: Pagination
**Files:** `src/components/Pagination.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/HomePageClient.tsx`
**Spec:** Add a page query param (`?page=1`). Slice scholars array server-side to 12 per page. Create a simple `Pagination` component that renders prev/next buttons and page numbers. Pass paginated scholars to client.
**Commit:** `feat: add pagination with page query param`

### Task 8: Cleanup stale comments
**Files:** Various `src/components/*.tsx`, `src/app/**/*.tsx`
**Spec:** Remove tutorial-style comments (e.g., "// The useHasMounted hook ensures...", "// The background is now handled by...", etc.). Keep architecture comments.
**Commit:** `chore: remove stale tutorial-style comments from components`
