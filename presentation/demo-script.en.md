# Demo Script — Voices of Truth

> The live demo is part of an engineering review (60 minutes). Its share is **10 minutes**, separate from the explanations;
> under time pressure it compresses to **5 minutes** (the trimmed track below).

## Scenario overview

| # | Scenario | External evidence | Internal reference | Duration (on screen) |
|---|----------|-------------------|--------------------|----------------------|
| 0 | Pre-flight | `pnpm dev` runs with no errors | package.json:6 | 30 s |
| 1 | Locale redirect | from `/` you land on `/en` or `/ar` per accept-language | `src/proxy.ts:5-19` | 40 s |
| 2 | Filters + Arabic search | changing the menus rewrites `?query/...` in the address | `src/lib/searchParams.ts:1-12` | 2 min |
| 3 | URL is the state | reload / share / back keep the same result | `src/components/HomePageClient.tsx:38-45` | 1.5 min |
| 4 | Pagination | 26 scholars → 3 pages (the last holds 2) | `src/lib/pagination.ts` | 1 min |
| 5 | Language + theme switch | EN/AR toggle + flash-free themes, surviving reload | `src/components/LanguageSwitcher.tsx` + `ThemeToggle.tsx` | 2 min |
| 6 | Detail page + 404 | /ar/scholars/6 opens a scholar; /99999 → a custom 404 | `scholars/[id]/page.tsx:20-24,43` | 1.5 min |
| 7 | Tests and build | `pnpm test` (28 passing) then `pnpm lint` then `pnpm build` | `src/lib/pure-logic.test.ts` and others | 1 min |

## Approved commands (from package.json only)

| Command | Purpose |
|---------|---------|
| `pnpm install` | install if node_modules is absent (rare before a demo) |
| `pnpm dev` | dev server with Turbopack on :3000 |
| `pnpm test` | Vitest — expect **28 tests passing / 2 files** |
| `pnpm lint` | ESLint (next/core-web-vitals) |
| `pnpm build` | production build — **run sequentially after lint, not in parallel** |
| `pnpm start` | production server (optional check before the demo) |

External requirement: Node.js 20.9+ and pnpm 11+ — explained in the main README (lines 22-30).

---

## Full run (10-minute version)

### 0) Pre-flight — 30 seconds
- Make sure `pnpm dev` is running and the machine can sense language: print the redirect in the terminal with `curl -sI localhost:3000 | grep -i location` if you want proof, otherwise open the browser directly.
- Keep the page console clean: we don't want to show any module warning on screen.
- **What to say:** "We start from zero: just the address `localhost:3000`, and you'll see the language chosen according to the local settings."

### 1) Locale redirect — 40 seconds
- Open `http://localhost:3000`. You will most likely be redirected to `/en` (or `/ar` if the machine language is Arabic).
- **External evidence:** only the address bar changed, with no reload.
- **Internal proof:** `src/proxy.ts:5-19` (reads accept-language), then `:28-33` (redirect).
- Add quietly: the option of a missing language segment decides the language automatically — so every internal route stays under its segment.

### 2) Filters and Arabic search — 2 minutes
- From the "Country" menu choose **Egypt**. Notice **12 cards** (out of 26) — count them quickly on screen, or note that the filter relies on real data (`countries.ts:2-6` — Egypt is id 1).
- Reset, then choose a specialization: **Da'wah** → **4 cards** (the preaching specialization, id 3 in `specializations.ts:13-16`).
- Now type a fully diacritized name in search: «**مُحَمَّد**».
  - **External:** the "الشيخ محمد حسين يعقوب" card appears despite the diacritics.
  - **Internal:** `src/lib/search.ts:4-9` — strips diacritics (range `\u064B-\u0652`), then unifies hamzas and flips ى/ة.
- Then type «**احمد**» (no hamza):
  - **External:** "الكابتن أحمد لمقارنة الأديان" appears.
  - **Internal:** the same `normalizeArabic` — normalizing "أحمد" into "احمد".
- While typing, note: the request does not fire until 300ms of silence (debounced).
  - **Internal:** `src/components/filters/SearchInput.tsx:51-56`.

> Every scenario is described with pinable evidence: an external behavior, then an internal `path:line` reference.

### 3) URL is the state — 1.5 minutes
- The address now holds `?query=مُحَمَّد` (or whatever you typed). Press **F5** — the result stays.
- Paste a filtered link into a new tab: `http://localhost:3000/ar?country=1&category=3` — the same result opens.
- After a little filtering, press the back button: you return to the previous page (the state before filtering) — because every change used `router.replace`, not `push`.
  - **Internal:** `src/app/[locale]/HomePageClient.tsx:38-45` + `src/lib/searchParams.ts:10` (page removal on any filter change).

### 4) Pagination — 1 minute
- Reset everything. With 26 scholars and 12 per page → **3 pages** (the last page holds only 2 scholars).
- Navigate: start and end show the `getPages` window (first, last, current ±1, with an ellipsis).
  - **Internal:** `src/lib/pagination.ts:3-19` — the state lives in the URL (`page=2`).

### 5) Language and theme switch — 2 minutes
- Press **AR** in the top language bar: the whole page flips direction (RTL) and the text parts change.
  - **Internal:** `src/components/LanguageSwitcher.tsx:14-19` rewrites the root segment; `src/app/layout.tsx:54` derives lang/dir from `dir(locale)`.
- Press the theme button (sun/moon): the colors change.
- Now press F5: **no flash** — the page opens straight in the saved theme.
  - **Internal:** the inline pre-hydration script `src/app/layout.tsx:41-52` applies the class to `<html>`, with `suppressHydrationWarning` at `:54`, and the `useHasMounted` guard in `src/hooks/useHasMounted.ts:3-5`.
- One hint note: what you just saw — a flash-free theme button — is exactly what the safe pattern rescued from the Hydration problem that slides 27-28 document.

### 6) Detail page and 404 — 1.5 minutes
- Open `http://localhost:3000/ar/scholars/6` → the scholar's profile with a photo, bio, and social links.
- Go back to the directory and scroll, or open `http://localhost:3000/ar/scholars/99999` → a custom 404 page with the "Voices of Truth" mark and a "go back" button.
  - **Internal:** `generateStaticParams` in `scholars/[id]/page.tsx:20-24` (declared 52 paths at build time); the unknown id falls back to `notFound()` at `:43`.

### 7) Tests and build — 1 minute
- In a second terminal tab: `pnpm test` → expect the lines:
  - `Test Files  2 passed (2)`
  - `Tests  28 passed (28)`
- Then `pnpm lint` (no errors), then `pnpm build` only after lint finishes.
  - Note that Vitest exercises only the pure core: `data-integrity` and `pure-logic`.

---

## Compressed track (5 minutes) — when time is tight

Run only these items and refer to the others verbally:

1. (30 s) `/` → `/en` or `/ar` automatically — `proxy.ts`.
2. (1.5 min) Search «مُحَمَّد» and «احمد» with correct results + a debounce note — `search.ts:4-9` and `SearchInput.tsx:51-56`.
3. (45 s) A filtered URL that reloads with the result intact + a `replace` note — `searchParams.ts`.
4. (45 s) EN/AR toggle and a flash-free theme — `layout.tsx:41-54`.
5. (1 min) `pnpm test` → "2 passed / 28 passed", then `pnpm lint` and `pnpm build` at the end.
   Then point those interested to steps 4, 6, and 7 of the full run in this script.

## Backup plan when the infrastructure fails (DB/env/service)

- The project has no database and no mandatory env vars: `NEXT_PUBLIC_SITE_URL` is optional (it only affects the sitemap).
- If `pnpm dev` fails (port busy): `pnpm dev -p 3001`.
- If the install fails or the network is down: use the **production build** `pnpm start` after the ready `pnpm build`.
- If the live preview fails entirely: jump straight to the deck's **slide 1** and show the **screenshots** saved in this folder (recommended: capture one per screen in steps 0-6 beforehand), and close with "the behavior you are looking at here matches what you saw in the screenshots."

## Phrases to say and phrases to avoid

**Say:**
- "Filtering happens on the server before the page is sent; only the 12 scholars of the current page reach the client."
- "28 passing tests mean the *core* is safe — we haven't earned full component-level confidence yet."
- "We don't claim absolute speed: we cite measurable structural gains (pre-declaration — 52 paths declared at build time; server-side filtering so only one page reaches the client — but the build log shows them as dynamic ƒ because the root reads the header; we don't say 'served from a CDN')."
- "The only inline script is the pre-hydration theme script — the root reason 'unsafe-inline' exists in the CSP."
- "Reset returns to the bare pathname — and carries no further parameter."

**Avoid:**
- "No performance ceiling imposed — faster than any similar app." (no proof to back it)
- "The app supports offline mode / a full PWA." (there is no service worker — we only have a manifest, not a PWA)
- "Filtering is free at any size." (it is O(n) per request — fine at 26 records, suspicious at thousands)
- "Everything is tested." (28 tests don't touch components or hooks)
- The honest synonym: any scholar who doesn't appear on a correct search = a normalization bug to be locked in a test. — don't say "search always works"; say: "it is tested through specific examples from the dataset."