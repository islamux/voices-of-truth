# Senior Engineering Interview: Voices of Truth

> **Format:** 4 rounds × 25 questions = 100 + 5 bonus = 105 total
> **Target:** Mid→Senior candidate
> **Style:** FAANG/Big Tech — behavioral, architectural depth, system design, debugging, and coding
> **Project:** Bilingual (EN/AR, RTL) Next.js 16 / React 19 App Router directory of Islamic scholars — i18next + framer-motion + Tailwind v4, server-side filtering, URL-as-state, custom ThemeProvider

---

## Round 1: Architecture & System Design (25 questions)

*Tests: system thinking, trade-off awareness, big-picture understanding*

### Q1. Why i18next + react-i18next instead of next-intl for this bilingual app?

**A:** i18next is framework-agnostic and was already familiar from the migration; `i18next-resources-to-backend` (`src/lib/i18n.ts:17-21`) lazy-loads locale JSON from `public/locales/{lng}/{ns}.json` via dynamic `import()`, code-splitting each namespace. next-intl would have given tighter Next.js App Router integration (`[locale]` middleware + `setRequestLocale`), but i18next's per-request `createInstance` (`src/lib/i18n.ts:13`) gives explicit SSR isolation with no hidden middleware. The trade-off is more manual wiring (a client provider `I18nProviderClient.tsx`, manual resource passing) in exchange for portability and a mature ecosystem.

### Q2. The repo ships an empty `scholars-db.json` at the root, yet the app renders 26 scholars. Where does the real data live, and what does that discrepancy signal?

**A:** `scholars-db.json:1-10` is an empty skeleton (`countries:[]`, `scholars:[]`, …) that **nothing imports** — verified by grep. The real data is typed TypeScript modules: `src/data/scholars.ts:14-26` spreads 11 category arrays (`src/data/scholars/dawah.ts`, etc.) into one `scholars: Scholar[]`. The JSON file is a legacy stub from an abandoned JSON-DB approach and a migration target shape for the planned Supabase move (`docs/domain-driven-architecture.md:59-65`). It signals documentation/architecture drift: a contributor reading the root file would assume it's the source of truth and be misled.

### Q3. Walk through the full request path from a user filtering by country to rendered HTML.

**A:** The browser navigates to `/?country=5&lang=ar`. The Next.js 16 "proxy" (`src/proxy.ts:23`) detects `Accept-Language` and ensures a locale prefix. `HomePage` (`src/app/[locale]/page.tsx:18`, a server component) awaits `searchParams`, precomputes `validCountryIds`/`validCategoryIds` Sets at module scope (`:9-10`), then filters the in-memory `scholars` array server-side via `.filter().slice()` (`:34-57`) using `normalizeArabic()` (`src/lib/search.ts:3`). The already-paginated slice (12 per page) is passed as props to `HomePageClient` (`src/app/[locale]/HomePageClient.tsx:20`), which owns the interactive `FilterProvider` and `useSearchParams`. The server ships filtered HTML; the client only re-writes the URL on change via `router.replace` (`:42`).

### Q4. Why does the app keep all filter state in the URL instead of React state or a store?

**A:** ADR-002 (`docs/adr.md:12-17`): the URL is the single source of truth. Benefits: filters are shareable/bookmarkable, server-renderable (the server component reads `searchParams`), and survive full page navigations without persistence logic. The cost is a required `<Suspense>` boundary around `useSearchParams` (ADR-006) and `router.replace` churn on every keystroke. A store would have hidden state from the server and broken shareable links. This is the classic "URL-as-state" pattern appropriate for a filterable directory.

### Q5. `router.replace` is used for filter changes instead of `router.push`. What's the trade-off?

**A:** ADR-003 (`docs/adr.md:19-24`). `replace` avoids polluting browser history — pressing Back goes to the *previous page*, not the previous filter state (which would be disorienting: Back → "now country=4?", Back → "now country=5?"). The trade-off is losing per-filter-step navigation: a user can't undo a single filter change with Back. Given filters are ephemeral refinements, `replace` is the right call. (`HomePageClient.tsx:42`, `Pagination.tsx:24`.)

### Q6. Invalid filter params (e.g. `?country=999`) silently fall through to "show all" instead of erroring. Why, and what would you change for a production migration?

**A:** ADR-008 (`docs/adr.md:54-59`): `validCountryIds`/`validCategoryIds` are module-scope `Set`s; an unknown id simply matches nothing, so the filter is a no-op. This is graceful but silent — a malformed or tampered URL looks like "no results of that filter" rather than an error. For the Supabase migration, `docs/senior-project-analysis.md:136-151` recommends stricter validation: redirect to a canonical URL (strip invalid params) or return 400, and log unexpected params so you can detect scraping/abuse.

### Q7. There is no `middleware.ts`, yet locale redirects happen. How?

**A:** Next.js 16 renamed middleware to "proxy." The file is `src/proxy.ts:23` (default export `proxy` with `config.matcher` at `:38`). It parses `Accept-Language`, takes the first 2-char prefix, defaults to `en`, and redirects locale-less paths (`:7-21,30-35`). The matcher excludes `avatars|locales|_next/*|api|favicon`. **Docs drift:** `senior-project-analysis.md:17` and `docs/README.md:11` claim "no middleware" — they predate/confuse the rename. A senior candidate should recognize `proxy.ts` as the Next 16 convention.

### Q8. The codebase has a custom `ThemeProvider` instead of `next-themes`. Why was the battle-tested library rejected?

**A:** ADR-009 (`docs/adr.md:61-66`). next-themes 0.4.6 emits `<script>` tags *inside the React tree*, which React 19 / Next.js 16 rejects with a console error, and next-themes was unmaintained at the time. The custom `src/lib/theme.tsx:40` provider is ~70 lines, zero deps, supports 3 states (`light|dark|system`), subscribes to `matchMedia('(prefers-color-scheme: dark)')` live (`:43-52`), and persists to `localStorage`. The FOUC-prevention script was moved out of React into `<head>` via `dangerouslySetInnerHTML` (`src/app/layout.tsx:35`). Trade-off: you own every edge case next-themes would have handled.

### Q9. How does the app avoid a flash of the wrong theme (FOUC) on first paint?

**A:** An inline script in `<head>` (`src/app/layout.tsx:20-31`, rendered via `:35`) runs *before* React hydration: it reads `localStorage('theme')` synchronously, applies `prefers-color-scheme` if theme is `'system'`, and toggles `.light`/`.dark` on `document.documentElement`. Because this runs before paint, the correct background is shown immediately. `<html suppressHydrationWarning>` (`:33`) tolerates the class mismatch between server HTML (no class) and client (class added). The client `ThemeProvider` later reconciles its state with the DOM the script produced.

### Q10. Why is `ThemeProvider` the *outermost* provider, wrapping `I18nProviderClient`?

**A:** ADR-001 (`docs/adr.md:5-10`). If i18n were outermost, a locale switch would remount the theme provider and lose the in-memory theme state (forcing a re-read of localStorage and a potential flash). With theme outermost (`src/app/[locale]/layout.tsx:28-32`), theme survives locale changes. Ordering of providers is a real concern whenever a remount boundary sits between stateful providers.

### Q11. The `scholar` i18n namespace is used by `ScholarCard`, `ScholarList`, and `CategoryFilter`, but the layout only preloads `['common','header']`. What happens?

**A:** `src/app/[locale]/layout.tsx:25` passes only `common` + `header` to the client provider. Components calling `useTranslation('scholar')` (`ScholarCard.tsx:19`, `CategoryFilter.tsx:14`) rely on react-i18next's lazy fallback — on first paint the keys may render as raw key strings until the namespace loads. This is a latent correctness/perf issue: either preload `scholar` in the layout, or accept a brief untranslated flash. A senior fix is to add `'scholar'` to the layout's namespace list so it's fetched server-side alongside the others.

### Q12. Data integrity: scholar IDs are non-contiguous (1 and 2 are missing; id 99 exists). What bugs could this cause, and why doesn't pagination break?

**A:** IDs present: {3,4,…27,99}. Pagination uses `.length` and `.slice()` on the array (`src/app/[locale]/page.tsx:55-57`), not the `id` field, so gaps don't break paging. Risks if someone *did* key by id: a `scholars[id]` lookup would be wrong; a "max id + 1" next-id generator would collide with 99; a URL like `/scholar/2` would 404 confusingly. The lesson: don't assume sequential IDs from data — use length-based or Map-based access.

### Q13. The app has no repository/data-access layer — pages import the `scholars` array directly. What does that block, and how would you refactor?

**A:** `src/app/[locale]/page.tsx` imports `scholars` straight from `src/data/scholars.ts`. `docs/domain-driven-architecture.md:59-65` flags this: it blocks a clean swap to Supabase (every consumer is coupled to the array shape) and prevents adding caching/logging at a single seam. The recommended refactor is a `src/lib/scholars` module exposing `getAllScholars()`, `getScholarById()`, `filterScholars()` — then only that module changes when the data source moves to a DB.

### Q14. Why is `normalizeArabic()` insufficient for robust Arabic search, and what does it miss?

**A:** `src/lib/search.ts:3-5` strips only harakat (U+064B–0652) and superscript alef (U+0670). It does **not** unify alef variants (ا/أ/إ/آ), ya/alif-maqsura (ي/ى), ta-marbuta (ة/ه), or remove tatweel (ـ). So searching "علي" won't match "على", and "كي" won't match "كى". `docs/improvement-plan.md:333-351` proposes `arabic-persian-search` for deeper normalization. A robust search would canonicalize all these forms before comparison.

### Q15. How is the app pre-rendered, and what does `generateStaticParams` emit?

**A:** `src/app/[locale]/layout.tsx:36-40` returns `supportedLngs` (`['en','ar']`) as `[{locale:'en'},{locale:'ar'}]`, so `next build` pre-renders `/en` and `/ar` as static HTML. There are no deeper dynamic routes (no `/scholar/[id]`). Filtering happens server-side *at request time* via `searchParams` (the page is dynamic w.r.t. query strings), so the static HTML is the unfiltered grid; filtered views are produced on each request. A candidate should note this is ISR-ish/SSR for filtered queries, pure SSG for the bare locale.

### Q16. The `<html>` element sets `lang` and `dir` from the locale at the root layout, but the locale "belongs" to the `[locale]` segment. Why is that a smell?

**A:** `src/app/layout.tsx:19,33` awaits `params.locale` at the *root* layout to set `lang`/`dir`. `docs/senior-project-analysis.md:89-101` (P1) flags this as brittle: the root layout reaching into a child segment's params couples layers and may break on Next upgrades. The idiomatic location is the `[locale]/layout.tsx`, but `<html>` only exists in the root layout. Workarounds include reading locale from the pathname or from the proxy/headers. This is a known App Router ergonomic tension.

### Q17. Why does `ScholarList` resolve country names via a `Map` instead of `countries.find()`?

**A:** `src/components/ScholarList.tsx:15` builds `Map(countries.map(c => [c.id, c]))` once, then O(1) lookups per card (`:31-33`). `find()` would be O(n) per scholar → O(n×m) total. This is the optimization `docs/improvement-plan.md:233-251` prescribed, now applied. At 26 scholars × 10 countries the absolute cost is trivial, but the pattern scales and is the right reflex.

### Q18. The data barrel (`src/data/scholars.ts`) imports categories alphabetically by name, not by `categoryId`. What's the risk?

**A:** The spread order in `scholars.ts:14-26` is alphabetical category import, not numeric `categoryId`. If a scholar is added to the wrong file, the `categoryId` mismatch is **silent** — no validation exists (`docs/senior-project-analysis.md:239`). A `categoryId === file's declared id` assertion in dev would catch misfiled scholars. The display order also becomes "alphabetical category" rather than a meaningful taxonomy order.

### Q19. Dev uses Turbopack but build doesn't. What does that imply?

**A:** `package.json:6` `dev: "next dev --turbopack"`; `:7` `build: "next build"` (no turbopack flag). Dev gets faster startup/incremental builds; production uses the stable Webpack-based builder for safety. The codebase must therefore avoid Webpack-specific or Turbopack-specific assumptions — it relies on Tailwind v4 PostCSS (works in both), dynamic `import()` for locales (works in both), and an edge-runtime proxy. A senior note: Turbopack production builds became stable in later Next 16.x, so this could flip.

### Q20. `AGENTS.md` says ESLint extends `core-web-vitals` **and** `typescript`, but only `core-web-vitals` is applied. Why does this matter?

**A:** `eslint.config.mjs:3` is `const eslintConfig = [...nextConfig]` from `eslint-config-next/core-web-vitals` only — `next/typescript` is **not** loaded. So TypeScript-specific lint rules (no-explicit-any, no-unused-vars variants) don't run; `pnpm lint` gives a false sense of type-safety. `tsc --noEmit` (via `tsconfig strict:true`) still type-checks, but the lint gap is a real docs-vs-code drift (`AGENTS.md:14,91-92`).

### Q21. How would you add per-scholar pages (`/en/scholars/99`) to this app?

**A:** Create `src/app/[locale]/scholars/[id]/page.tsx` with `generateStaticParams` mapping `scholars.map(s => ({ id: String(s.id) }))` (or keep it dynamic), `generateMetadata` for SEO, and `getNameById()` in the data layer. Note the non-contiguous IDs mean slugs-by-id are fine but "the Nth scholar" ≠ "scholar id N". Also add the route to `sitemap.ts` and the proxy matcher if needed. This is also the moment to introduce the repository layer (Q13) so the page doesn't import the array directly.

### Q22. There are 28 avatar files for 26 scholars, plus a typo `voice-of-ture.png`. What process failure does this reveal, and how would you prevent it?

**A:** Renamed/duplicate avatars (`zain.jpg` and `zain_khairallah.png` both present) and a typo'd asset indicate manual file management without validation. Prevent: (1) a prebuild script asserting every `scholar.avatar` path resolves and no orphan files exist; (2) reference assets by scholar id (`/avatars/3.jpg`) not name; (3) lint the `public/` tree against the data. This is a data-hygiene discipline gap.

### Q23. Why is `framer-motion` only used in `ScholarCard`, and what's the cost?

**A:** `ScholarCard.tsx:29-35` uses `<motion.div>` for entrance (`opacity/y`) + `whileHover` scale. Framer Motion is a client-only lib, so it correctly lives in a client component — but it's pulled into the bundle wherever a card renders. `docs/improvement-plan.md:115-138` proposes extracting a reusable `<Card>` so the motion config is DRY. The cost is bundle size (~30KB gz) for a cosmetic effect; a CSS-only alternative (`@keyframes` + `transition`) would avoid the dependency entirely.

### Q24. The `<Trans>` component is never used; all interpolation is `t('key')`. When would `<Trans>` be necessary?

**A:** `<Trans>` is needed when translation strings contain **embedded markup** or component interpolation — e.g. `"Read <bold>{{count}}</bold> scholars"` where `<bold>` must render as `<strong>`. This app's strings are plain (`appTitle`, `searchPlaceholder`), so `t()` suffices. Verified: zero `<Trans>` usage (`SocialMediaLinks.tsx:39` builds dynamic `aria-label` via template literal instead). Choosing `<Trans>` only when needed keeps message files simple.

### Q25. If this app needed to scale to 10,000 scholars, what are the first three things you'd change?

**A:** (1) Move data to Supabase (the documented migration target) with the repository layer (Q13) as the seam; replace in-memory `.filter()` with parameterized SQL + indexes on name/country/category. (2) Paginate at the DB (`LIMIT/OFFSET` or cursor) instead of slicing a 10k array. (3) Replace client-side `router.replace`-per-keystroke with a debounced search + server search endpoint (or keep server filtering but debounce the URL write). Beyond that: virtualize the grid, add full-text search (Postgres `tsvector` with Arabic config), and cache filter aggregations.

---

## Round 2: React & Next.js Deep Dive (25 questions)

*Tests: component model, hooks, rendering, Next.js specifics*

### Q26. Explain the Server/Client component boundary in this codebase. Give examples and judge whether each is correct.

**A:** Server: `HomePage` (`page.tsx:18`) does all filtering/pagination server-side. Client: `HomePageClient` (`'use client'`), `ThemeToggle`, `LanguageSwitcher`, filters, `ScholarCard` (framer-motion), `ScholarAvatar` (onError state). **Arguably wrong:** `Footer` (`'use client'`) only calls `useTranslation('common')` — it could be server if resources were passed as props; `PageLayout`/`Header` are client only because they compose client children — they could be server wrappers (`docs/senior-project-analysis.md:152-163`, P2). `ScholarList` has no `'use client'` directive but becomes client transitively via imports.

### Q27. `HomePageClient` is wrapped in `<Suspense>`. Why is that mandatory?

**A:** ADR-006 (`docs/adr.md:40-45`). `HomePageClient` calls `useSearchParams()` (`HomePageClient.tsx:31`), which is a Client Hook that opts the route into dynamic rendering. In Next.js 16, any component using `useSearchParams` must be inside a `<Suspense>` boundary or the build throws. The boundary (`page.tsx:60`) lets Next render a fallback during the dynamic portion while keeping the rest of the tree static.

### Q28. `ThemeToggle` uses a `useHasMounted()` guard. Trace why it's needed and how the hook works.

**A:** The server can't read `localStorage`, so it renders the default (light) icon; if the user's stored theme is dark, the client would hydrate showing a different icon → hydration mismatch. `useHasMounted` (`src/hooks/useHasMounted.ts:3`) uses `useSyncExternalStore(emptySubscribe, () => true, () => false)` — `getServerSnapshot` returns `false`, so SSR and first client render agree (render placeholder), then after hydration it flips to `true` and shows the real icon. `ThemeToggle.tsx:11,17` gates on this. This is the canonical React 18+ SSR-safe mounted guard.

### Q29. Why is `params` a `Promise` in the locale layout, and what breaks if you forget to `await` it?

**A:** Next.js 16 (React 19) made route params async to support streaming/concurrent rendering. `src/app/[locale]/layout.tsx:22` is `async` and `await`s `params` before reading `params.locale` (`:25`). Forgetting `await` reads a Promise object → `locale` is undefined → `getTranslation(undefined,…)` misbehaves or throws. This is a breaking change from Next 14/15 where params was a plain object.

### Q30. `HomePage` does filtering in a server component, then passes props to `HomePageClient`. Why not filter on the client?

**A:** Server filtering (`page.tsx:34-49`) ships correct HTML on first paint (better FCP/LCP, SEO-friendly content), keeps the 26-scholar dataset out of the client JS bundle, and works without JavaScript. Client filtering would ship all data to the browser and show an empty grid until hydration. The trade-off: every filter change is a round-trip (URL change → server re-render), but for 26 items the latency is negligible and the shareable-URL benefit dominates.

### Q31. `FilterProvider` takes its `value` as a prop rather than holding state internally. Explain this "controlled context" pattern.

**A:** `src/context/FilterContext.tsx:36-39` — `FilterProvider({value, children})` just feeds `value` to the context, where `value` is assembled in `HomePageClient.tsx:50-64` from `useSearchParams` + `handleFilterChange`. This keeps the **URL as the single source of truth** (ADR-002) — the context is a prop-drilling-avoider, not a state owner. If the context held its own state, it would diverge from the URL on navigation. This is a subtle but important distinction: context for *distribution*, URL for *state*.

### Q32. `useFilters()` throws if used outside `FilterProvider`. Why throw rather than return a default?

**A:** `src/context/FilterContext.tsx:23-29` throws `'useFilters must be used within a FilterProvider'`. Throwing fails fast and loudly — a developer who forgets the provider sees an immediate, locatable error instead of silent `undefined`-driven bugs downstream. Returning a default would mask the wiring mistake. This is the defensive-hook pattern; TypeScript's `createContext(null)` + non-null assertion at `:27` encodes "this is never null in correct usage."

### Q33. `ScholarAvatar` uses `next/image` with an `onError` fallback to a default avatar. Walk through the ADR.

**A:** ADR-005 (`docs/adr.md:34-38`). `ScholarAvatar.tsx:12` keeps `useState<boolean>` for error; on `<img>` error it swaps `src` to `/avatars/default-avatar.png` (`:16`). The fallback path is **absolute** (`/avatars/…`) so it works on nested routes (when per-scholar pages exist). Trade-off: an extra state variable per card and a flash if the original 404s. The alternative — pre-validating all avatars at build — shifts the cost to the build pipeline.

### Q34. `SearchInput` is a controlled component reading `currentFilters.query`. Why not uncontrolled with a debounce?

**A:** `src/components/filters/SearchInput.tsx:17` binds `value={currentFilters.query}` from context, so the input reflects the URL state exactly (shareable, back-button-friendly). Every keystroke calls `handleFilterChange` → `router.replace` (ADR-003). The missing piece: **no debounce** — `docs/senior-project-analysis.md:119-134` notes this fires a server round-trip per keystroke. A senior fix debounces the URL write (200ms) while keeping the input responsive via local state.

### Q35. `I18nProviderClient` builds the i18next instance in `useMemo([locale, resources])`. Why memoize, and what's the dependency subtlety?

**A:** `src/components/I18nProviderClient.tsx:18` — recreating the instance every render would re-trigger `useTranslation` subscribers app-wide. The deps are `[locale, resources]`. `resources` is a **new object each server render** (passed as a prop from the async layout), so on navigation the instance is recreated — acceptable at this scale (a handful of components), but at scale you'd stabilize `resources` identity (e.g., cache by locale) to avoid needless re-inits.

### Q36. `getTranslation()` creates a fresh i18next instance per request. Why is that important for SSR?

**A:** `src/lib/i18n.ts:33-43` calls `createInstance()` (`:13`) inside `getTranslation`, not at module scope. A shared module-level instance would leak language/namespace state across concurrent requests (request A in `ar` could bleed into request B in `en`). Per-request isolation makes the function safe under SSR concurrency. The instance is awaited, used to extract `resourceStore.data` as serializable `resources` (`:41`), then discarded.

### Q37. `ErrorBoundary` is a class component. Why can't it be a function component?

**A:** React requires error boundaries to be class components — there is no function-component equivalent for `getDerivedStateFromError` / `componentDidCatch`. `src/components/ErrorBoundary.tsx:14` is a class with both lifecycle methods (`:20,24`). A "try again" button resets state (`:37`), but note: resetting state does **not** remount the child tree, so a child that errors during render will error again unless its inputs change. This is a known limitation of the reset pattern.

### Q38. `LanguageSwitcher` mutates `segments[1]` to swap the locale. What assumption does that make?

**A:** `src/components/LanguageSwitcher.tsx:14-17` splits the pathname, sets `segments[1] = newLang`, rejoins. This assumes the URL shape is always `/{locale}/...` — guaranteed by the proxy redirect, but brittle if the app ever adds locale-less routes or a root redirect changes. It also only handles the first segment (no nested locale params). A safer approach uses next-intl-style `useRouter`/`usePathname` that understand locale prefixes natively, but this app uses raw `next/navigation`.

### Q39. `Button` uses `React.forwardRef` with the named-function form. Why does that matter?

**A:** `src/components/Button.tsx:7` — `const Button = React.forwardRef<HTMLButtonElement, Props>(function Button(props, ref) {...})`. The named inner function preserves `displayName` in React DevTools (an anonymous arrow would show as `ForwardRef(Anonymous)`), aiding debugging. `twMerge(base, className)` (`:10`) lets callers override base classes intelligently rather than concatenating. A senior note: React 19 allows `ref` as a normal prop, deprecating `forwardRef` — this could be simplified.

### Q40. `ScholarCard` logs an error and returns `null` if the name is missing. Is that the right behavior in production?

**A:** `src/components/ScholarCard.tsx:21-26` does `if (!name) { console.error(...); return null }`. Returning `null` prevents a crash, but silently dropping a card hides data corruption — the user sees a grid with a "missing" scholar and no explanation. Better: render a fallback card ("data unavailable") in production, or fail the build if a scholar lacks a name (data validation). The `console.error` is also gated on `NODE_ENV` (`:22`) but logs are easy to miss.

### Q41. The `renderSocialIcon` switch maps strings like `'FaYoutube'` to components. What's the coupling problem?

**A:** `src/components/SocialMediaLinks.tsx:14-46` is a 14-case switch from icon *name strings* (stored in data) to react-icons components. This couples the **data layer** to a specific icon library — a typo in data (`'FaYouTub'`) silently falls back to `<FaLink>`, and changing icon libraries means editing data. `docs/best-practice-analysis-update.md:69-87` proposes a config map or a `SocialIcon` component keyed by platform. Also: `key={link}` (`:40`) collides if a scholar lists the same platform twice (Waleed Ismail's duplicate TikTok).

### Q42. `Header` sets `dir` redundantly with `<html dir>`. Harmless or harmful?

**A:** `src/components/Header.tsx:9,12` reads `i18n.dir()` and sets `dir` on the `<header>`. Since `<html dir>` already cascades, this is redundant — but defensive (survives if the header is ever rendered outside the rtl root). Harmless in practice, though it adds a tiny re-render dependency on locale. A code-review would flag it as noise unless there's a documented reason.

### Q43. Why does the root layout own the FOUC script via `dangerouslySetInnerHTML` instead of a `<Script>` component?

**A:** `src/app/layout.tsx:35` injects the theme script with `dangerouslySetInnerHTML` in `<head>`. `next/script` with `strategy="beforeInteractive"` would be the "Next.js way," but it has edge cases with ordering and SSR. A raw inline script in `<head>` guarantees it runs before any paint, synchronously, with no framework abstraction — the most reliable FOUC prevention. The content is a hardcoded string (no user input), so `dangerouslySetInnerHTML` is safe here.

### Q44. `Pagination` deletes the `page` param for page 1. Why?

**A:** `src/components/Pagination.tsx:16-19` — `goToPage(1)` removes the `page` key from `URLSearchParams`, producing `/?country=5` instead of `/?country=5&page=1`. This keeps URLs canonical (page 1 = no page param), avoiding duplicate-content SEO issues and making the "first page" URL clean. It's the same hygiene as omitting default values. `goToPage` also returns `null` if `totalPages <= 1` (`:27`) — no pager for a single page.

### Q45. The app uses `useTranslation('scholar')` in components under a client provider, but `<Trans>` is never used. Could any string need it?

**A:** Only if a translation contained embedded markup or component interpolation. Current strings (`scholar.json`: `languages`, `filterByCategory`, `noScholarsFound`) are plain text, so `t()` is correct. If a future string were `"Showing <b>{{count}}</b> scholars"`, you'd need `<Trans components={{b:<b/>}}>`. Overusing `<Trans>` for plain strings adds noise to message files; the app's restraint is right.

### Q46. How would you test the `FilterContext` + URL interaction without a browser?

**A:** The challenge: `useSearchParams` and `useRouter` are Next hooks needing a router context. Use `@testing-library/react` with a mock router (e.g., `createDynamicRouteParser` from `next-router-mock`), render `HomePageClient` inside `FilterProvider`, simulate a filter change, and assert `router.replace` was called with the expected URL. Test `handleFilterChange` edge cases: empty value deletes the key (`HomePageClient.tsx:35-36`), multiple filters combine, page resets on filter change.

### Q47. `proxy.ts` runs on the edge runtime. What does that restrict, and why is it fine here?

**A:** Edge runtime has no Node.js APIs (no `fs`, limited `crypto`, no native modules). `src/proxy.ts` only does `Accept-Language` parsing and `NextResponse.redirect` — pure Web APIs, edge-safe. The matcher (`:38`) excludes static assets so the proxy only runs for HTML routes. Edge is chosen for global low-latency redirects. If the proxy ever needed DB access or heavy compute, it would have to move to a Node runtime route handler.

### Q48. `generateMetadata` in the locale layout returns `title: t('appTitle')`. What's missing for good SEO?

**A:** `src/app/[locale]/layout.tsx:13-20` sets only a title. Missing: `description`, `openGraph` (title/description/image/url), `twitter` card, `alternates` (hreflang `en`/`ar` — critical for a bilingual site to tell search engines the two locales are equivalent), and canonical URLs. Hreflang is especially important here — without it, Google may index only one locale or treat them as duplicates. The root layout (`src/app/layout.tsx:5-8`) has basic metadata but no OG either.

### Q49. The grid has no virtualization. At what scale would you add it, and how?

**A:** With 26 scholars, the DOM is tiny — virtualization is pure overhead. The threshold is usually ~100+ visible items or heavy cards. At scale, `react-window` or `@tanstack/react-virtual` would render only visible cards. But virtualization conflicts with server-side rendering (the grid is server-rendered), so you'd virtualize a *client* island receiving the full list — which re-introduces the bundle-size problem. For this app, server-rendered pagination (already present) is the better scaling lever.

### Q50. `next.config.ts` sets `reactStrictMode: true`. What bugs does that surface in dev?

**A:** StrictMode double-invokes render, effects, and some functions in development to surface impure renders, missing cleanups, and stale-closure bugs. For this app, it would catch: a `useEffect` in `ThemeProvider` that doesn't clean up its `matchMedia` listener, an impure filter function that mutates state, or a `useState` initializer with side effects. It does **not** affect production builds. The `matchMedia` cleanup in `src/lib/theme.tsx:43-52` is written to be StrictMode-safe.

---

## Round 3: TypeScript, Data, & Build Pipeline (25 questions)

*Tests: type system understanding, data processing, build-time vs runtime*

### Q51. `tsconfig.json` has `strict: true`. Which strict flag matters most for `getNameBySlug` returning `NameEntry | undefined`?

**A:** `strictNullChecks`. Without it, TypeScript treats `undefined` as assignable to any type, so a caller of a function returning `NameEntry | undefined` could access `.name` without a guard and the compiler wouldn't complain — it'd crash at runtime. With `strictNullChecks` (enabled by `strict`), the caller **must** narrow (`if (!entry) return notFound()`). For this app, the data-access functions returning optional values are the highest-value strict-flag beneficiaries.

### Q52. The `Scholar` type uses `Record<string, string>` for `name` and `bio`. What's the type-safety hole, and how would you close it?

**A:** `src/types/index.ts:15,25` — `name: Record<string,string>` accepts **any** locale key, so `scholar.name['xyz']` type-checks but returns `undefined` at runtime. A tighter type: `name: Record<Locale, string>` where `Locale = 'en' | 'ar'`, so only valid locales compile. Even better, a branded `LocalizedText` type with a helper `t(scholar.name, locale)` that enforces presence. The current loose typing lets a scholar ship with `name.en` but no `name.ar` silently.

### Q53. Why are `Country`, `Specialization`, `Scholar` defined as `interface` rather than `type`?

**A:** Object shapes conventionally use `interface` (`src/types/index.ts:1,7,13`): better error messages (TS names the interface), declaration merging (extensibility), and marginally faster compiler checks. `type` is reserved for unions/intersections/primitives. For a non-library app the difference is negligible, but `interface` is the idiomatic choice for domain object shapes. Note: `interface` merging could *accidentally* widen a type if two files declare the same name — a risk `type` avoids.

### Q54. The data is plain TS modules imported by the bundler, not JSON fetched at runtime. What are the trade-offs vs. a JSON-in-`public/` approach?

**A:** TS modules give full type safety (the `Scholar[]` is checked at compile time), tree-shaking, and direct server-side import — no fetch round-trip. The data lives in the server/client bundle (fine for 26 scholars; problematic at 10k). A JSON-in-`public/` approach (like the Asma project) decouples data from code (editable without rebuild), can be fetched lazily by the client, but loses type safety until parsed (needs Zod) and adds a runtime fetch. For static, typed, small data, TS modules win.

### Q55. There's no runtime validation of the scholar data (no Zod). What could ship undetected?

**A:** Because the data is hand-authored TS, `tsc` catches type errors, but not *semantic* errors: a scholar with `countryId: 999` (no such country), `language: 'xyz'`, a duplicate `id`, a misfiled `categoryId` (Q18), or `name.en` missing while `name.ar` exists. A Zod schema run at build (or in dev) would validate referential integrity (country/category ids exist), required locale fields per scholar, and id uniqueness — turning silent data bugs into build failures.

### Q56. The `scholars` barrel merges 11 category arrays. What happens if two files export a scholar with the same `id`?

**A:** Nothing catches it — the spread produces an array with two entries sharing an `id`. Lookups by `id` would return whichever `.find()` hits first; the second is a silent ghost. A `Set` of ids built in dev with a duplicate check (or a Map that throws on collision) would catch this. This is the kind of integrity check a build-time Zod pass (Q55) should include.

### Q57. `normalizeArabic` uses the regex `/[\u064B-\u0652\u0670]/g`. Decode that character range.

**A:** U+064B–U+0652 are the Arabic diacritics (harakat): fatha, damma, kasra, sukun, shadda, tanween, etc. U+0670 is superscript alef. The regex strips these so "الرَّحْمَن" matches "الرحمن". It does **not** cover dagger alef variants fully, hamza forms, or tatweel (Q14). The range is correct for the common harakat but incomplete for full Arabic normalization — a known limitation documented in the improvement plan.

### Q58. Build has no `prebuild` step. What does that imply about data freshness?

**A:** Unlike projects with a `prebuild` data-generation script, this app's data is committed TS — `next build` uses whatever is in `src/data/`. There's nothing to regenerate. The implication: data edits require a code change + rebuild + redeploy (no CMS-driven updates). This is fine for a curated static directory but means the deploy pipeline *is* the content pipeline. A CMS or Supabase backend would decouple them.

### Q59. `package.json` declares `pnpm` as the only package manager. How is that enforced, and why?

**A:** `AGENTS.md:18` documents pnpm-only; the lockfile is `pnpm-lock.yaml`. There's no `packageManager` field in `package.json` (which would make npm/yarn warn) and no `only-allow-pnpm` preinstall guard — so enforcement is convention, not technical. A senior fix: add `"packageManager": "pnpm@<version>"` and a `preinstall: "npx only-allow-pnpm"` to actually block other managers. pnpm is chosen for disk efficiency (symlinked store) and workspace support.

### Q60. `tsconfig` uses `moduleResolution: bundler`. Why, and what does it enable?

**A:** `moduleResolution: bundler` (`tsconfig.json`) is the modern choice for apps bundled by Next/Webpack/Turbopack — it allows imports without extensions, supports `package.json` `exports`, and doesn't enforce Node's resolution quirks. It pairs with `isolatedModules: true` (each file transpiles independently, required by Next). The older `node`/`node16` options would be wrong for a bundled app. Path alias `@/* → ./src/*` (`:26-30`) works under `bundler`.

### Q61. The `uniqueLanguages` list is derived via `[...new Set(scholars.flatMap(s => s.language))]`. What's the assumption about the `language` field?

**A:** `src/app/[locale]/page.tsx:51` assumes `s.language` is a **single string** (one language per scholar). If a scholar spoke multiple languages and `language` were an array, `flatMap` would over-flatten or the `Set` would include array elements oddly. The type (`Scholar.language: string`) encodes single-language. A senior observation: deriving filter options from data means a new language appears automatically — but also that a typo in data (`'Engilsh'`) becomes a filter option. Validation (Q55) would catch it.

### Q62. Country/category option labels are localized inline via `locale === 'ar' ? c.nameAr : c.nameEn`. Why not via i18next?

**A:** `src/app/[locale]/page.tsx:52-53` reads `c.nameAr`/`c.nameEn` directly off the data objects. Reference data (country/specialization names) lives on the entities, not in message files — sensible because there are 10 countries × 2 locales = 20 strings that belong with the data. i18next message files hold *UI* strings (`searchPlaceholder`, `appTitle`). Mixing the two would split a country's identity across files. The trade-off: adding a 3rd locale requires adding `nameFr` to every country.

### Q63. `safePage = Math.min(currentPage, totalPages || 1)`. What edge case does this guard?

**A:** `src/app/[locale]/page.tsx:56`. If a URL has `?page=999` but there are only 3 pages, `safePage` clamps to 3 (the last page). The `|| 1` handles `totalPages === 0` (no results) — clamp to 1 to avoid `Math.min(x, 0)`. Without this, `slice()` would return `[]` on out-of-range pages, showing an empty grid with no explanation. The guard degrades gracefully to the last valid page.

### Q64. The build emits static `/en` and `/ar` but the filtered grid is server-rendered per request. Is this SSG or SSR?

**A:** It's a hybrid. The *route* is statically generated for the locale segment (`generateStaticParams`), but because the page reads `searchParams` (for filtering), Next.js renders it dynamically per request when query params are present. So bare `/en` can be cached statically, but `/en?country=5` is SSR. There's no `export const dynamic = 'force-static'` on the page, so the presence of `searchParams` opts it into dynamic rendering. A candidate should recognize this nuance — it's neither pure SSG nor pure SSR.

### Q65. `eslint.config.mjs` uses the flat config format. What changed from `.eslintrc`, and why does it matter here?

**A:** ESLint 9 moved to flat config (`eslint.config.mjs` exporting an array) from `.eslintrc.*` (hierarchical JSON/JS). `src/…` is linted via `eslint src/`. The flat config here (`:3`) is just `nextConfig` (core-web-vitals) — minimal. The change matters because the old `.eslintrc` cascade (per-directory configs) is gone; config is now explicit and merged in array order. The drift (Q20): `typescript` rules aren't applied despite docs claiming they are.

### Q66. There's no test setup (no vitest/jest/playwright). What's the highest-value first test to add?

**A:** `normalizeArabic` (`src/lib/search.ts:3`) — a pure function with clear edge cases (harakat, superscript alef, alef variants that *don't* normalize, empty string). A few `expect(normalizeArabic('الرَّحْمَن')).toBe('الرحمن')` assertions catch regressions for free. Second priority: the filter pipeline in `page.tsx` (mock `scholars`, assert filtering/pagination/safePage clamping). Components are lower value until the data logic is locked down.

### Q67. How would you type the i18n `resources` passed from server to client to catch missing keys at compile time?

**A:** Currently `resources` is loosely typed (`i18nextInstance.services.resourceStore.data`). For compile-time key safety, define `type Messages = typeof import('./../../public/locales/en/common.json')` and type each namespace's resources as `Record<Locale, Messages>`. Then `t('missingKey')` would error. i18next supports this via `i18next.d.ts` augmentation with `interface CustomTypeOptions { resources: {...} }`. The app doesn't do this, so missing keys fail silently at runtime (showing the key string).

### Q68. `resolveJsonModule: true` is set. Where is that used, and what's the risk?

**A:** It allows `import data from './foo.json'`. This app's data is TS (not JSON imports), but `tsconfig` has it enabled (common Next default). The risk: large JSON imports bloat the bundle and bypass type-checking (JSON is typed as inferred-shape, often `any`-ish). If the app ever imported `scholars-db.json` (the empty stub), it'd type as the empty shape. Not actively harmful here, but worth knowing it's on.

### Q69. `import type` vs `import` for types — does this codebase use it correctly, and why does it matter with `isolatedModules`?

**A:** With `isolatedModules: true` (required by Next), type-only imports must be marked `import type` so the transpiler can safely drop them (it can't tell if an import is a type otherwise). The codebase generally does this correctly. A violation would compile under `tsc` but fail under Next's per-file transpilation. A senior review would grep for `import { SomeType }` where `SomeType` is only a type and flag them.

### Q70. The `PER_PAGE = 12` constant lives in the page module. What's the concern, and where should it live?

**A:** `src/app/[locale]/page.tsx:28` — a magic number in the page couples the page to a specific paging size; if `Pagination` or the client ever needs to know it, they must duplicate it. Better: a shared `src/lib/pagination.ts` exporting `PER_PAGE`, `computeTotalPages(len)`, `clampPage(page, total)`. This centralizes the paging contract and makes it testable. At 26 scholars it's trivial, but it's a "constants belong in one place" discipline.

### Q71. The data files use camelCase exports (`dawahScholars`). Why is that preferable to default exports here?

**A:** `src/data/scholars/dawah.ts:3` exports `dawahScholars` (named). Named exports give autocompletion, prevent rename drift, and make the barrel (`scholars.ts:14-26`) explicit about what's imported. Default exports force a name at the import site (easy to mistype), don't refactor well, and can't be tree-shaken as cleanly. The codebase consistently uses named exports — a good convention.

### Q72. `ScholarCard`'s dev-only `console.error` is gated on `NODE_ENV`. Does `next.config` strip console in production?

**A:** No — unlike some projects that use `removeConsole` compiler option, this `next.config.ts` doesn't strip `console.*`. The `NODE_ENV` check (`ScholarCard.tsx:22`) is manual, so the `if` still ships (but the `console.error` branch is dead in prod). To actually strip, you'd add `compiler: { removeConsole: { exclude: ['error'] } }` to `next.config.ts`. The current approach works but leaves dead code in the bundle.

### Q73. How does the build handle the `public/locales/**/*.json` files — are they bundled?

**A:** They're **not** bundled — they live in `public/` and are served as static assets. The i18next backend loader (`src/lib/i18n.ts:19`) does a dynamic `import('@/../public/locales/...')` which, at build, resolves to a fetch-like load of the static file (Next handles `public/` imports specially). On the client, the provider receives `resources` as serialized props, so the JSON is fetched once server-side and passed down. This keeps locale files editable without touching code.

### Q74. `@/../public/locales/...` uses a path traversal out of `src`. Why not configure a cleaner alias?

**A:** `src/lib/i18n.ts:19` uses `@/../public/...` — `@/` is `./src/`, so `@/../public/` reaches the project root's `public/`. It works but is fragile (depends on `@/` resolving to `src/`) and ugly. A cleaner setup: add a `tsconfig` path `"@public/*": ["./public/*"]` and use `@public/locales/...`. Or configure i18next's backend with an explicit absolute path. This is a minor refactor for readability/robustness.

### Q75. The repo has a `pnpm-workspace.yaml` with `packages: []`. What does that indicate?

**A:** The workspace scaffold exists but declares **no** workspaces — it's a leftover from monorepo tooling setup that was never used (or was intended for a future split, e.g., `web/` + `api/`). With empty `packages`, pnpm treats the repo as a single package. It's harmless but confusing — a contributor might assume a monorepo. Either populate it or remove it. Indicates the project considered but didn't pursue a workspace structure.

---

## Round 4: Problem-Solving, Debugging & System Evolution (25 questions)

*Tests: debugging approach, feature addition, trade-off analysis, code reading*

### Q76. A user reports the Arabic site shows English text for scholar country names. How do you debug?

**A:** Trace: country labels come from `countries.ts` (`nameAr`/`nameEn`), rendered in `ScholarList.tsx:31-33` as `countryObject[currentLang] || countryObject['en']`. (1) Is `currentLang` correct? It comes from `useLocalizedScholar` (`src/hooks/useLocalizedScholar.ts:8`) reading `i18n.language`. (2) Is `i18n.language` actually `'ar'` on the Arabic route? If the proxy/header is misconfigured, the i18n instance might default to `'en'`. (3) Does the country have a `nameAr` field? If a country was added with only `nameEn`, the `|| 'en'` fallback fires. Most likely: a missing `nameAr` on a country, or `i18n.language` not matching the URL locale.

### Q77. Search for "الرحمن" returns no results even though a scholar's bio contains it. Why, and how do you confirm?

**A:** The search uses `normalizeArabic(...).includes(normalizeArabic(query))` (`page.tsx:35-40`). Likely causes: (1) the bio text has harakat that *are* stripped, but the query has an alef variant (أ vs ا) that *isn't* normalized (Q14) — "الرحمن" vs "الرّحْمَن" normalize fine, but "الرحمن" vs "الرحمان" wouldn't match. (2) The query has a leading/trailing space or zero-width character. (3) The bio field is missing for that scholar (`bio?.en` optional). Confirm by logging the normalized query and normalized bio in dev and diffing them.

### Q78. How would you add a "favorites/bookmark scholars" feature?

**A:** Client-only (localStorage), mirroring the theme pattern: a `useFavorites()` hook reading/writing `localStorage('favorite-scholars')` (array of ids), a `FavoriteButton` client component on `ScholarCard`, and a `/favorites` page filtering `scholars` by stored ids. The page must handle SSR (server renders empty, client hydrates with favorites) — use the `useHasMounted` guard to avoid hydration mismatch. For cross-device sync, you'd need the Supabase migration + auth. Limitation: ids are non-contiguous (Q12), so store ids, not indices.

### Q79. The dark mode toggle flashes light-then-dark on a hard refresh in Safari. How do you diagnose and fix?

**A:** The FOUC script (`layout.tsx:20-31`) should prevent this, but Safari may delay inline scripts or the `localStorage` read throws in private mode. (1) Check the script runs synchronously in `<head>` (it does, via `:35`). (2) Wrap the `localStorage.getItem` in try/catch (privacy mode throws) — the script has this. (3) Safari's `prefers-color-scheme` may differ from the stored theme; the script falls back to `system` correctly. (4) If using `suppressHydrationWarning`, ensure the class is added pre-paint. A Safari-specific fix: add the class via a `<meta>` refresh guard or test with Web Inspector's timeline to see exactly when the class flips.

### Q80. A contributor adds a 27th scholar but the grid still shows 26. What did they forget?

**A:** Most likely they added the scholar object to a category file but `scholars.ts:14-26` doesn't spread that category, OR they forgot to rebuild (no — data is TS, no build step). More subtle: the `id` collides with an existing scholar and a `Map`-based dedupe (if ever added) drops it. Or the `avatar` path is wrong and `ScholarAvatar`'s fallback renders but `ScholarCard` returns null due to a missing `name` (Q40). Debug: `console.log(scholars.length)` after the barrel; verify the new object is in the spread list and has all required fields.

### Q81. How would you implement keyboard shortcuts (`/` to focus search, `Esc` to clear)?

**A:** A `useKeyboardShortcuts()` client hook mounted in `HomePageClient` (or layout): a `useEffect` adding a `keydown` listener that checks `e.key === '/'` (and `document.activeElement?.tagName !== 'INPUT'` to avoid hijacking typing), then `document.querySelector<HTMLInputElement>('[name="q"]')?.focus()`. For `Esc`, clear the query via `handleFilterChange('query','')`. Cleanup removes the listener. Mount it once at a high-level client component. The matcher must ignore when a modifier key is pressed.

### Q82. The app crashes with "useFilters must be used within a FilterProvider" on `/about`. Why, and how do you fix the architecture?

**A:** `useFilters` (`FilterContext.tsx:23`) throws outside the provider. If `/about` (or any route) renders a component that calls `useFilters` but isn't under `FilterProvider` (which lives in `HomePageClient`, scoped to the home page), it throws. The fix: either scope the filter-consuming components to the home route only, or hoist `FilterProvider` to the locale layout if filters are global. Currently filters are home-specific, so the components shouldn't be reused elsewhere without the provider — a documentation/architecture constraint.

### Q83. How would you add Open Graph images per scholar (for social sharing)?

**A:** Since there are no per-scholar pages yet (Q21), first add the route. Then create an OG image endpoint: `src/app/og/[id]/route.tsx` using `next/og` (`ImageResponse`) rendering the scholar's name (localized) + avatar + country on a branded background. In `generateMetadata` for the scholar page, set `openGraph.images: ['/og/${id}']`. Arabic text in `ImageResponse` requires the font file loaded at runtime (Amiri/Cairo). Cache the generated PNGs. This is the standard Next OG-image pattern.

### Q84. A user on a slow connection sees the grid re-render on every keystroke with no debounce. How do you add one without breaking URL-as-state?

**A:** Keep the input responsive with local state (`useState` for the input value), but debounce the *URL write*. On keystroke, update local state immediately (responsive); start a 200ms timer to call `handleFilterChange('query', value)` → `router.replace`. Clear the timer on each new keystroke. The displayed value uses local state during typing; the URL updates 200ms after the last keystroke. This preserves URL-as-state for sharing while removing the per-keystroke round-trips.

### Q85. `proxy.ts` redirects `/` to `/en` or `/ar` based on `Accept-Language`. A user in France (browser `fr`) is always sent to `/en`. How do you add French?

**A:** (1) Add `'fr'` to `supportedLngs` (`src/lib/i18n.ts:6`) and `generateStaticParams` (auto via the array). (2) Create `public/locales/fr/{common,header,scholar}.json`. (3) The proxy's `Accept-Language` parser (`proxy.ts:7-21`) takes the first 2 chars — `'fr-FR'` → `'fr'` — so it'll redirect to `/fr` automatically once `fr` is supported. (4) Add RTL handling if needed (French is LTR, so no change). The `LanguageSwitcher` needs a French option. The data's `name`/`bio` `Record<string,string>` (Q52) would need `fr` keys for full localization.

### Q86. The grid shows 12 scholars on page 1 but `?page=2` shows 14. How is that possible?

**A:** It shouldn't be — `PER_PAGE=12` and `slice` (`page.tsx:55-57`) guarantee equal-sized pages (except the last). 14 on page 2 implies either: (1) the data changed between requests (a scholar was added) and `totalPages` recomputed, but the user's cached `?page=2` now slices differently — actually that'd show *fewer* or the same, not more. (2) A bug in `safePage` clamping. (3) The client and server disagree on the page (hydration mismatch). Most likely: a misread — verify by logging `scholars.length`, `currentPage`, `start`, `end` server-side. A real 14-result page would indicate the slice math is wrong.

### Q87. How would you migrate the data layer to Supabase without rewriting all components?

**A:** Introduce the repository layer first (Q13): `src/lib/scholars.ts` with `getAllScholars()`, `filterScholars(filters)`, `getScholarById(id)`. Initially these just re-export the in-memory array (zero behavior change). Then migrate the implementation: `getAllSchapters()` → `supabase.from('scholars').select(...)`, `filterScholars()` → a parameterized query. Components keep calling the same functions. Add Zod validation of DB rows at the seam. This is the "strangler" pattern — the repository is the seam that makes the swap incremental and reversible.

### Q88. A scholar's avatar shows a broken image, then the default, then the real avatar. Why the sequence?

**A:** `ScholarAvatar.tsx:12` starts with `error:false`, so `<img src={avatar}>` loads the real one. If it 404s, `onError` sets `error:true` → swaps to default (`:16`). But if the *real* avatar then loads late (cached, slow), you'd see default then real. More likely the "real then default" sequence: the real URL 404s after a delay. Fix: validate avatar existence at build (Q22) so broken paths never ship, or pre-assign default upfront if the path is suspect. The `useState` fallback is reactive, not predictive.

### Q89. How would you add analytics (which filters are most used)?

**A:** Integrate Plausible/Umami (privacy-friendly). Track filter changes: in `handleFilterChange` (`HomePageClient.tsx:33`), after `router.replace`, call `window.plausible('filter', { props: { type, value } })`. Track search queries, country/category selections, page navigations. Avoid tracking free-text search content (PII/privacy). Add the analytics `<script>` via `next/script` in the root layout, env-gated so it only loads in production. The events fire client-side (filtering is client-triggered).

### Q90. The `ThemeToggle` shows a placeholder button pre-hydration. Is that an accessibility or UX problem?

**A:** `ThemeToggle.tsx:17` (via `useHasMounted`) renders a disabled placeholder until mounted. Minor UX: the button is unclickable for the brief hydration window. Accessibility: if the placeholder has no `aria-label`, a screen reader announces an unlabeled disabled button. Fix: give the placeholder a static `aria-label="theme toggle"` and `disabled` so it's announced correctly, then enable on mount. The flash is usually imperceptible but matters on slow devices.

### Q91. A contributor runs `pnpm lint` and sees no errors, but `tsc` finds type errors. Why the disconnect?

**A:** `pnpm lint` runs ESLint with **only** `core-web-vitals` (Q20) — no TypeScript-specific rules. `tsc --noEmit` does full type-checking. So type errors (e.g., a `Record<string,string>` accessed with a missing key, an `any` leak) are caught by `tsc` but not `lint`. The fix: add `eslint-config-next/typescript` to `eslint.config.mjs`, and ideally add `tsc --noEmit` to CI / a pre-commit hook so type errors fail the pipeline. The docs claiming both configs are active (`AGENTS.md`) are wrong.

### Q92. How would you add a service worker for offline reading?

**A:** The app is static-content-friendly (data is small). Use `@serwist/next` or `next-pwa`: add a `sw.ts` precaching the build manifest + `public/locales/**/*.json` + avatars, with a network-first strategy for HTML and cache-first for assets. Register it in the root layout via a client `useEffect`. Considerations: the locale JSON must be cached for offline language switching; avatars total a few MB (acceptable); the service worker version must bump on deploy to invalidate. The filtered grid (dynamic per query) won't be cached — only the bare locale pages.

### Q93. The site is deployed but `X-Frame-Options: DENY` prevents an embed a partner requested. How do you selectively allow it?

**A:** `next.config.ts:6-17` sets `X-Frame-Options: DENY` globally. To allow a specific partner, replace `X-Frame-Options` with a `Content-Security-Policy: frame-ancestors 'self' https://partner.com;` (CSP `frame-ancestors` supersedes XFO in modern browsers and allows a whitelist). Configure it per-route via `headers()` in `next.config.ts` with a matcher, or globally. Keep `DENY` for all other origins. This is the modern approach to clickjacking protection with controlled embedding.

### Q94. How would you add a sitemap that includes filtered URLs?

**A:** `src/app/sitemap.ts:7` currently lists only `/en` and `/ar`. Filtered URLs (`/?country=5&lang=ar`) are generally **not** worth indexing (infinite combinations, low value each). Instead, add per-scholar pages (Q21) and include those. If you must index some filters, add curated "category" pages (`/en/country/5`) with real routes (not query strings) and `generateStaticParams`. Google ignores query-string variants mostly. The right move is to make important filters into real routes, not to enumerate query strings in the sitemap.

### Q95. How would you convert this to a full-stack app with user-submitted scholars (moderation flow)?

**A:** (1) Supabase backend with `scholars` table + RLS (public read, authenticated insert to a `scholar_submissions` table). (2) A submission form (react-hook-form + Zod) posting to an API route. (3) An admin route (auth-gated) listing submissions with approve/reject. (4) On approval, move the row to `scholars` (or flag it `approved:true` and filter the public query). (5) ISR or on-demand revalidation so new scholars appear without redeploy. (6) Image uploads to Supabase Storage with validation. The static-directory nature changes to a CMS-like workflow.

### Q96. A teammate wants to add Redux for "better state." How do you respond?

**A:** Current global state is: theme (3 values, custom context) + filters (URL-derived, controlled context). Redux would add a store, reducers, actions, middleware (~10KB) for state that's either already handled or shouldn't live in a store (filters belong in the URL). Ask: "What specific problem does Redux solve?" If the answer is "global state," point out there are two values. Redux is justified if the app grows to complex cross-cutting state (auth, real-time sync, optimistic updates). For now, YAGNI — context + URL is correct.

### Q97. The build succeeds locally but fails on Vercel with a module resolution error for `@/../public/locales`. Why, and how do you fix?

**A:** `@/../public/...` (`src/lib/i18n.ts:19`) depends on `@/*` resolving to `./src/*`. If Vercel's Node version or Next version handles the alias differently, or if the file is imported from a context where `@/` isn't configured (e.g., a script), resolution fails. Fix: use a cleaner alias (Q74) — add `"@public/*": ["./public/*"]` to `tsconfig` paths and import `@public/locales/...`, or compute an absolute path with `path.join(process.cwd(), 'public/locales', ...)`. The relative traversal is the root fragility.

### Q98. How would you implement a "scholar of the day" rotation?

**A:** Deterministic, server-side: `const today = new Date().toDateString(); const idx = hash(today) % scholars.length;` picks a stable scholar per day (same for all users, changes at midnight). Hash the date string (not `Math.random`, which would differ per request/SSG). Feature it on the home page above the grid. For SSG, the page is built once and the scholar is frozen until the next build — to make it actually rotate daily without rebuilds, use ISR (`revalidate: 3600`) or compute it client-side (less ideal, flickers).

### Q99. How would you add i18n-aware SEO with hreflang?

**A:** In `generateMetadata` (locale layout or per page), return `alternates: { languages: { en: '/en/...', ar: '/ar/...' } }` and `canonical`. For the home page: `alternates.languages = { en: `${base}/en`, ar: `${base}/ar` }`. This tells Google the two locales are equivalent alternates. Also add `<link rel="alternate" hreflang="x-default" href="/en">`. Without hreflang, Google may pick one locale and ignore the other or treat them as duplicates. The current metadata (`layout.tsx:13`) omits this entirely — a real SEO gap.

### Q100. Onboarding a new dev: what's the 5-step guide?

**A:** 1. Read `AGENTS.md` + `docs/adr.md` (the 9 ADRs explain every non-obvious decision). 2. `pnpm install && pnpm dev` (Turbopack). 3. Trace a request: `proxy.ts` → `[locale]/layout.tsx` → `page.tsx` filtering → `HomePageClient`. Understand URL-as-state. 4. Read `src/data/` (the 11 category files + types) and note `scholars-db.json` is a stub (Q2). 5. Add a scholar: edit a category file, run the app, see it in the grid; then add a filter test. The ADRs are the Rosetta stone — every "why" is documented there.

---

## Bonus Round: Stretch Questions (5 questions)

*For candidates who finish early or show exceptional depth*

### Q101. The `scholar` namespace isn't preloaded (Q11), yet components work. Exactly what renders during the gap, and how would you guarantee no flash?

**A:** On first client paint, `useTranslation('scholar')` returns a `t` that returns the **key string** (e.g. `'filterByCategory'`) because the namespace isn't loaded into the client instance yet (only `common`+`header` were passed as resources). The UI may briefly show raw keys. react-i18next then lazy-loads `scholar` (via the backend if configured on the client, or it's missing entirely since the client provider only got 2 namespaces). To guarantee no flash: add `'scholar'` to the layout's preloaded namespaces (`layout.tsx:25`) so its resources are serialized into the client provider alongside the others. The current setup "works" only by luck of timing.

### Q102. Design a caching layer for `getTranslation` that's SSR-safe and doesn't leak across requests.

**A:** The per-request `createInstance` (`i18n.ts:13`) is correct for isolation but rebuilds the instance every call — wasteful if called multiple times in one request. A safe cache: `AsyncLocalStorage` scoped to the request, mapping `locale+ns` → instance. Within a request, repeat calls hit the cache; across requests, the storage is fresh. Alternatively, `React.cache()` (unstable_cache) dedupes within a single render pass. Never use a module-level `Map` — it leaks across concurrent requests (request A's `ar` instance poisons request B's `en`). The key invariant: cache lifetime ≤ request lifetime.

### Q103. The `FilterContext` value is assembled from `useSearchParams` in `HomePageClient`. What breaks if you SSR a component using `useFilters` outside the home route?

**A:** `useSearchParams` is only valid in a client component under `<Suspense>`. If a component calls `useFilters` (which transitively needs the provider whose value comes from `useSearchParams`) on a route where `FilterProvider` isn't mounted, `useFilters` throws (Q82). Even if mounted, calling `useSearchParams` in a server component is illegal. So filter-consuming components are structurally scoped to the home route — reusing them elsewhere requires re-providing the context (and a URL strategy for that route). The coupling is intentional but implicit.

### Q104. Propose a refactor to shrink the client boundary (per `senior-project-analysis.md` P2).

**A:** Make `PageLayout`, `Header`, and `Footer` server components. `Header` composes `<ThemeToggle>` and `<LanguageSwitcher>` (client) — a server `Header` can render client children, so move `'use client'` into just those two. `Footer` only needs translated strings — pass them as props from a server parent instead of calling `useTranslation` inside. `PageLayout` is a layout wrapper with no hooks — make it server. Result: less JS shipped, more HTML server-rendered. The only real client boundary becomes the interactive islands (toggle, switcher, filters, card).

### Q105. The app mixes `i18n.dir()` at two levels (`<html>` and `<header>`). Formalize the RTL strategy to prevent drift.

**A:** Single source: set `dir` only on `<html>` via the root layout (`layout.tsx:33`). All descendants inherit. Use logical CSS properties (`margin-inline-start`, `padding-inline-end`) and Tailwind logical utilities (`gap-*` per ADR-004, `ms-*`/`me-*`) — never physical (`ml-*`, `left-*`). Remove the redundant `dir` on `<header>` (`Header.tsx:12`). Add an ESLint rule banning physical directional utilities in this project. Test both locales in CI (screenshot diff `en` vs `ar`). The rule: `dir` is set once at the root; everything else is logical.

---

## Evaluation Criteria

| Area | Mid | Senior | Staff |
|------|-----|--------|-------|
| **Architecture** | Explains URL-as-state | Debates SSG vs SSR for filtered routes | Designs the repository seam for Supabase migration |
| **React** | Identifies server vs client components | Spots the wide client boundary (P2) | Redesigns provider ordering & context scoping |
| **TypeScript** | Knows `strict` implications | Catches the `Record<string,string>` locale hole | Designs Zod validation for data integrity |
| **Data** | Traces filter pipeline | Debugs `normalizeArabic` gaps | Builds referential-integrity checks into the build |
| **i18n** | Knows i18next basics | Diagnoses the un-preloaded `scholar` namespace | Designs hreflang + per-locale metadata strategy |
| **Problem-solving** | Follows debug steps | Identifies root cause (e.g., non-contiguous IDs) | Prevents recurrence (build-time data validation) |
| **Security** | Knows XSS basics | Explains the FOUC script safety | Designs CSP without breaking the inline theme script |
| **Performance** | Knows server filtering is good | Debates debounce vs URL-as-state trade-offs | Designs the scaling path to 10k scholars |

---

*End of interview document. 105 questions across 5 rounds. All file/function references verified against the voices-of-truth codebase.*
