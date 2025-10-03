# Documentation Analysis (Voices of Truth)

Following protocol in `Rules-hance-p.en.md` (senior-to-junior, simple, accurate, only markdown). Updated AFTER comparing docs with real code in `src/`.

---
## 1. High-Level Summary
The documentation foundation is solid: clear learning path, feature-by-feature explanations, and architectural intent (server-side filtering + client interaction).  
However, several feature docs are proposals (favorites, loading state, API migration) and not implemented. Filtering docs mostly match reality but contain a key mismatch (language param). i18n docs align with actual setup.

---
## 2. Implemented vs Proposed (Reality Check)

| Topic / Feature | In Code | In Docs | Status Suggestion |
|-----------------|---------|---------|-------------------|
| Server-side filtering via URL params | Yes (`page.tsx`) | Yes (05) | Implemented |
| Component decomposition (filters, list, card) | Yes | Yes | Implemented |
| i18n (middleware + dynamic backend + provider) | Yes | Yes | Implemented |
| Theme / dark mode (ThemeProvider + variables) | Yes | Light mention only | Needs doc expansion |
| Favorites (localStorage, toggle) | No | 06 | Proposed |
| Loading skeleton / `useScholars` hook | No | 07 | Deprecated / Superseded |
| API + SWR migration | No | 09 | Proposed |
| Data reference (types meaning) | Yes (types file) | Missing | Should add |
| Testing strategy | No | Missing | Should plan |

---
## 3. Concrete Discrepancies Found
1. Language filter param mismatch:  
   - Component: `LanguageFilter` uses `filterKey="language"`  
   - Server expects query param `lang` (code uses `const { query, country, lang, category } = ...`)  
   - Result: Language filter will not work. (Bug to fix later—doc should call it out.)
2. Country & category lookup shape:  
   - Code uses `country.name.en` and `specialization.name.en`, but some doc examples use `c.en` or `s.en`.
3. `await searchParams` usage:  
   - Code: `const { query, country, lang, category } = await searchParams;`  
   - In current Next.js stable, `searchParams` is already a plain object (no need to await). Docs should clarify or simplify.
4. Proposed files (favorites, loading, API migration) have no code backing—must label clearly to avoid confusion.
5. Loading feature doc references a hook (`useScholars`) and skeleton components—these are absent.
6. No `/api/scholars` route despite migration guide describing it.
7. i18n doc could mention `fallbackNS` (present in code config).
8. Theme strategy (ThemeProvider, CSS custom properties) not documented in styling guide.
9. Rules file has typos + blank points (doesn't block functionality, but harms polish).

---
## 4. Updated Per-Document Feedback (Delta-Focused)
| File | Keep | Update |
|------|------|--------|
| 01_BUILD_FROM_SCRATCH | Setup steps & rationale | Add Node / pnpm versions; mention no API layer yet |
| 02_CORE_ARCHITECTURE | Server vs Client explanation | Clarify `searchParams` sync vs async; remove or explain `await` |
| 03_STYLING_GUIDE | Tailwind + PostCSS clarity | Add ThemeProvider / CSS vars + dark mode note |
| 04_FEATURE_TRANSLATION | Flow matches code | Mention `fallbackNS`; provider layering order |
| 05_FEATURE_FILTERING | URL-as-state concept | Fix language param to `lang`; adjust data access (`country.name.en`) |
| 06_FEATURE_FAVORITES | Concept is good | Tag STATUS: Proposed; emphasize no implementation yet |
| 07_FEATURE_LOADING_STATE | Educational skeleton concept | Tag STATUS: Deprecated (superseded by server filtering) |
| 08_DEV_CODE_ORGANIZATION | Refactor list accurate | Add Theme components to architecture section |
| 09_MIGRATE_TO_API_SERVER | Forward-looking | Tag STATUS: Proposed; confirm no `/api` exists yet |
| docs/README | Learning path | Add status labels next to feature docs |

---
## 5. Priority Documentation Fixes (No Code Changes Yet)
1. Add STATUS badges at top of 06 (Proposed), 07 (Deprecated), 09 (Proposed).  
2. Add a warning note in 05 about current language filter bug (param mismatch).  
3. Correct property references (`country.name.en`, etc.) in examples.  
4. Add a short “Theme / Dark Mode” subsection to styling guide (or a new mini doc).  
5. Add a small note clarifying `searchParams` usage (remove `await` in examples or explain experimental context).  
6. Create `DATA_REFERENCE.md` summarizing `Scholar`, `Country`, `Specialization` fields.

---
## 6. Suggested New Docs (Lightweight)
- DATA_REFERENCE.md  
- THEME_GUIDE.md (or a section in styling guide)  
- CONTRIBUTING.md (install, dev script, style consistency)  
- DECISIONS.md (e.g., “Chose server-side filtering for shareable URLs and smaller bundles”)  
- STATUS badges (Implemented / Proposed / Deprecated) at top of feature docs

Keep each very short (1–2 screens).

---
## 7. Risks (After Code Review)
| Risk | Impact | Mitigation |
|------|--------|------------|
| Language filter non-functional | User confusion | Fix param key + doc note |
| Proposal vs reality unclear | Onboarding friction | STATUS tags |
| Filtering logic examples drift | Misuse in future edits | Sync examples to actual code snippet |
| Deprecated loading doc remains | Wasted effort implementing old pattern | Mark Deprecated & link to migration plan |
| Undocumented theme system | Duplicate styling approaches | Add concise Theme section |

---
## 8. Mentorship Notes (Refined)
- Always verify parameter names in code before documenting.  
- Tag speculative features clearly—never let “Proposed” read like “Implemented”.  
- Fix correctness (bugs) before expanding scope (favorites/API).  
- When adding reference docs, link instead of duplicating code blocks everywhere.  
- Start with a minimal `DATA_REFERENCE.md`; it unlocks cleaner explanations elsewhere.

---
## 9. Immediate Quick Wins
- [ ] Add STATUS lines to 06 / 07 / 09.  
- [ ] Add note in 05 about `lang` vs `language`.  
- [ ] Adjust examples for `country.name.en` / `specialization.name.en`.  
- [ ] Add Theme / Dark Mode note (one paragraph).  
- [ ] Plan simple bug fix PR for language filter (later, not in this doc).  

---
## 10. Conclusion (Post-Code Comparison)
Docs foundation is still solid, but now we have a concrete inconsistency (language filter key) and several proposal vs implementation mismatches. Addressing these small fixes will immediately boost reliability and onboarding clarity. After that, proceed with reference expansion and optional API migration planning.

Let me know if you want me to: (a) apply the language filter fix, (b) add status tags, (c) generate DATA_REFERENCE.md, or (d) all of the above in minimal commits.
