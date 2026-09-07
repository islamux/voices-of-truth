# Hardened Q&A — the "Voices of Truth" review

> A pre-scrutinized presenter's guide: every answer is designed for 30–60 seconds, backed by a real
> `path/to/file.ts:line-range` reference from the code (verified while preparing this script — don't
> promise anything you can't find a reference for).
> Regular questions in lightface; standby/deep questions in parentheses.

## A) Architecture and technical choices

**1. Why Next.js 16 + React 19 + TypeScript?**
We needed a combination that gives server-rendered HTML for public pages meant for both search engines and visitors, and the React Server Components approach makes moving data off the client a native style rather than extra engineering. TypeScript pins the shape of the project's data (26 scholars with bilingual names) before indexing can get it wrong. Result: `package.json` lists them as runtime dependencies, not experiments.
- Reference: `package.json` (runtime deps) · `src/types/index.ts:18-31`
- Trade-off: frequent major upgrades (Next 16 now) and a high churn surface.
- (Question: what actually moves to the client? — only the "filtered sheet" via `HomePageClient`; the data is truncated in `page.tsx:72-80` which passes the results sliced.)

**2. Why data in `src/data` and not a database?**
The initial content (26 scholars) is fixed in size and open to review inside the repository, and the tests verify the integrity of the records and references without depending on any external service. This decision is fast to start with, but it hands a manual update flow for every scholar.
- Reference: `src/data/scholars.ts:14-26` · `src/data/data-integrity.test.ts`
- (Background: a draft `scholars-db.json` schema sits at the project root, a candidate for a future DB/CMS — point to it without promising.)

**3. Why react-i18next in this server/client pattern?**
The server loads translations from `public/locales/{locale}/*.json` and sends the final page text; the client keeps a light translation context for the instant re-translation when switching language (from `/ar` to `/en`) without a reload.
- Reference: `src/lib/i18n.ts` · `src/app/[locale]/layout.tsx` · `src/components/LanguageSwitcher.tsx:14-19`
- (Question: how does the root know the direction? — the `x-locale` header from `src/proxy.ts:21-43` is read in `src/app/layout.tsx:40` to produce `lang/dir` at `:54`.)

**4. Why a custom theme instead of next-themes?**
Documented in ADR-009: with Next.js 16 we needed a script that runs before the first client effect link, and the external dependency didn't give us the no-flash control we wanted, so we kept `ThemeProvider` in house.
- Reference: `docs/adr.md:61-67` · `src/lib/theme.tsx:30-58`
- (Question: what modes does it have? — `'light' | 'dark' | 'system'`, and `applyTheme` sets the class on `<html>` plus `colorScheme`.)

---

## B) Rendering: SSR / SSG / CSR / Hydration (the mandatory axis)

**5. What is the difference between SSR, SSG, CSR, and Hydration in this project's language?**
- **SSR**: the page is generated as HTML on the server per request — we drive it with the `searchParams` prop in `page.tsx:22-40` (filters are dynamic by definition, not cacheable as precomputed).
- **SSG**: pages built once at build time — each scholar's page: `generateStaticParams` in `scholars/[id]/page.tsx:20-24` declares 52 paths (26 scholars × 2 languages). One precise note from the build log itself: because the root reads the `x-locale` header, the keys show as `ƒ` (dynamic) — "path declaration" is real at build time, while the actual rendering is currently per-request. No filler — we promise exactly what `pnpm build` shows us.
- **CSR**: filling an empty page with JavaScript — we don't use it as a page; our client manages interactivity over a pre-delivered HTML.
- **Hydration**: once the HTML arrives, React attaches to bind listeners and turn the components into interactive copies without a visual re-render. This is the "fault line" around which many of our questions turn.

**6. Why does a Hydration Mismatch happen at all?**
The values differ between what was rendered on the server and what the browser first renders: reading `localStorage`, `matchMedia`, `Date`… the client, during its first render, produces a different DOM. The real solution isn't to prevent the difference but to **never let the render depend on browser values during the first draw**.
- Reference: `src/lib/theme.tsx:30-38` (`getInitialTheme` returns `'system'` when `window` is missing on the server).

**7. How do we prevent the flash/break between both sides in this project?**
- An inline `<head>` script that runs before any render: it reads the saved theme and applies the `class` to `<html>` immediately — `src/app/layout.tsx:41-52` with `suppressHydrationWarning` at `:54`.
- The component that represents the theme (the toggle) is not rendered until mounting completes: `useHasMounted` uses `useSyncExternalStore` with a fixed server snapshot of `false` — `src/hooks/useHasMounted.ts:3-5`, and `src/components/ThemeToggle.tsx:59-72` renders an empty pixel instead of an icon until mount.
- Result: nothing on the client first-draws its "own guess" of the theme — no mismatch faces, no flash.

**8. The difference between reading "during render" and reading "after commit in useEffect"?**
A read during render (like initializing state with `useState(getInitial)`) can differ between server and client; a read inside `useEffect` happens **after the DOM is committed and is safe** — because the browser and its tools are ready by then. A live example: the `matchMedia` listener that follows the system-theme change lives in a `useEffect` in `theme.tsx:43-52` and switches the class before any content renders on top of it.
- (Deep question: so why does `ThemeToggle` never render with a wrong icon before mount? — because it relies on `useHasMounted`; the precise answer is the `ThemeToggle.tsx:66-72` reference.)

**9. Why don't we read `window`/`document` during server rendering?**
Simply because they don't exist on the server — and any guard like `typeof window === 'undefined'` must be placed before the render; if a stray access reaches the render it produces a mismatch on the platform. The rule: "what renders must be isolated from the browser; what belongs to the browser is deferred until mount."
- Reference: `theme.tsx:18` (the guard) · `useHasMounted.ts:3-5` (the isolation) — compare the approach with the document `docs/fix-hydration-error.md`.

**10. Where are the scholar pages built and what happens if an unknown id comes in?**
`generateStaticParams` produces a path for each scholar per language at build; when an unknown id arrives, `notFound()` returns → the custom 404 — no exception spills to the user.
- Reference: `scholars/[id]/page.tsx:20-24` and `:43` · `src/app/[locale]/not-found.tsx`
- (Question: why no dynamic fallback for fast additions? — every new scholar requires a rebuild; the possible negotiation with that pain is the reason it's discussed in the improvement plan at `improvement-plan.md:407-415`.)

---

## C) Routing and state

**11. Why is "the URL the source of truth" for filters?**
The reasoning of ADR-002: every filter became a parameter in the address; sharing, reloading, and deep-linking work without any in-memory backup state. It sacrifices every client-state-mirroring structure. Our state describes itself in the address itself.
- Reference: `docs/adr.md:12-18` · `src/lib/searchParams.ts:1-12`

**12. Why `router.replace` and not `push` for filters?**
Filtering is not a "new visit" that deserves a place in history; `replace` swaps the current entry so the back button returns to the state before filtering, not to the filtering itself. Documented as ADR-003.
- Reference: `docs/adr.md:19-25` · `src/app/[locale]/HomePageClient.tsx:38-45`

**13. What if an invalid URL param arrives (like `country=99` or `category=abc`)?**
We don't break the page; we treat it as if it wasn't requested: the set of valid ids is prebuilt outside the function (`validCountryIds`/`validCategoryIds` in `page.tsx:11-12`), and any invalid value becomes null and the filter proceeds normally. This is documented in ADR-008, with one small downside: we don't tell the user a wrong param was ignored.
- Reference: `page.tsx:22-40` · `docs/adr.md:54-59`

**14. Why the Suspense boundary around `HomePageClient`?**
Because the client uses `useSearchParams`, which Next requires to be wrapped in a Suspense boundary in SSR (ADR-006) — otherwise the HTML pre-render is emptied before the draw. We invest the same boundary as a loading shell for the page.
- Reference: `docs/adr.md:40-46` · `page.tsx:51-81`

---

## D) The data pipeline and text processing

**15. How does the diacritics-tolerant Arabic search work in 4 lines?**
`normalizeArabic` in `src/lib/search.ts:4-9`:
1. Removes diacritics and tatweel (`\u064B-\u0652\u0670\u0640`).
2. Unifies hamza forms (ء/أ/إ/آ/ٱ) to `ا`.
3. Flips `ى` → `ي`.
4. Flips `ة` → `ه`.
That way «مُحَمَّد» and «محمد» match in both the query and the text. Both texts are normalized to the same form before filtering (`page.tsx:24` for the query, and inside `filterScholars` for the data).
- Reference: `search.ts:1-9` · `page.tsx:24`
- (Question: don't we lose sorting/distinction when normalizing? — that's intended for matching, not for destroying the text; normalization never feeds back into the display.)

**16. Where does the filtering happen? Why there?**
On the server, inside `page.tsx:24-40`, before the HTML is sent — so the client only gets the 12 cards of its page, never the full array. The real cost: `O(n)` processing per search request (fine at 26; needs an index when growing).
- Reference: `page.tsx:24-48` · `src/lib/filterScholars.ts:11-32`

**17. What guarantees that the 26 scholars' data is "sound"?**
The integrity package (8 tests) checks: unique ids, each country/specialization reference actually exists, every avatar image points to an existing file (27 — 26 + a `default-avatar.png`), every language comes from the closed list, and bilingual vocabulary integrity. It runs via `pnpm test` under `vitest.config.ts`.
- Reference: `src/data/data-integrity.test.ts`

---

## E) API / database / identity

**18. Is there an API, a DB, or a login?**
No. The data is static in `src/data` and no network journey starts from the browser, and there is no authentication in any sense. This is a "clean start" decision whose price is that any content update goes through the repository and a redeploy.
- Reference: (no API files under `src/app/api` — check the folder structure) · the `scholars-db.json` draft
- (Question: is that good forever? — no; the plan proposes a CMS/DB via `improvement-plan.md:397-415`.)

**19. If we added a DB tomorrow, what changes in the architecture?**
Only the "source of records" changes, not the shape: `page.tsx` reads from a service instead of a constant, `generateStaticParams` shifts to periodic regeneration (ISR/revalidate) or dynamic, and the rest of the layers — components, filters, translations — stay as they are. That's thanks to the "data separated from presentation" split the repository was designed with from day one.
- Reference: `src/app/[locale]/scholars/[id]/page.tsx:20-24` (the only point that changes)

---

## F) Performance, caching, and PWA

**20. What does "52 pages declared at build time" mean in your numbers?**
26 scholars × 2 languages = 52 paths declared by `generateStaticParams` in `build`. But look at the build log I ran right before the review: the lines `ƒ /[locale]` and `ƒ /[locale]/scholars/[id]` appear — "dynamic, rendered on request", because the root `src/app/layout.tsx:40` reads the `x-locale` header, making every page request-dependent. The honest phrase is: **the paths are pre-declared, the rendering is currently dynamic**; removing the header read (or turning it into a header boundary) is the gateway to genuinely static pages served from the CDN — list it as a roadmap candidate, not a promise.
- Reference: `scholars/[id]/page.tsx:20-24`

**21. Is this app a PWA?**
**No.** There is only `manifest.ts` (name/icon/theme) and no **Service Worker** at all; test it cold: with no connection the page doesn't open. One of the strongest ethical rules of this script: **never promise the audience offline mode**.
- Reference: `src/app/manifest.ts` (and there is no `sw.js` file in the repository)

**22. Where do you get better performance with no extra cost?**
- Server Components send the HTML text and the minimum JS for interactivity.
- Pagination of 12/page shrinks the first response (`PER_PAGE=12` in `page.tsx:13`).
- Self-hosted fonts via `next/font` with caching — `src/app/layout.tsx`.
- Pre-declaration: 52 paths declared at build (knowing the actual rendering is "ƒ dynamic" because the root reads the header — the real static-routing gateway later is removing that read).
- (Question: where does performance degrade? — O(n) search per request and the trade-offs documented in `improvement-plan.md:231-330`.)

---

## G) Security and the threat model

**23. Which security headers are sent today?**
`next.config.ts:21-41` sets: `X-Frame-Options: DENY`, `X-Content-Type-Options`, a strict `Referrer-Policy`, and `Strict-Transport-Security` — with the CSP defined at `:5-16` (`frame-ancestors 'none'`, `form-action 'self'`, `object-src 'none'`).
- Reference: `next.config.ts:5-16,21-41`

**24. Why is `unsafe-inline` in the CSP?**
Because the theme's anti-flash script is inlined into the root page (`layout.tsx:41-52`) and must remain inline to run before any external file arrives. This is a deliberate concession: together, the theme system works. Moving to a nonce/external file is tracked as a future improvement.
- (Question: what about `unsafe-eval`? — it concerns the **development environment only**, with Turbopack, and does not exist in production; verify it in `next.config.ts`.)

**25. What does our threat model look like?**
The data comes from a trusted repository, there is no direct user input and no authentication — so the real attack surface is narrow: tampering with the text typed in the params (digested safely through the valid-id sets) and authored HTML content — which React escapes. We don't claim universal immunity; we say "the attack surface is small and deliberate."
- Reference: `page.tsx:25-28` (param digestion) · `docs/adr.md:54-59` (safe handling of bad params)

---

## H) Testing and monitoring

**26. What do the 28 tests cover today?**
Two files: **data-integrity** (8) and **pure-logic** (20), split into: `normalizeArabic` (5 cases), `filterScholars` (8), `getPages` (4), `paginate` (3). All pure core — they pin the structure and the narration precisely and stay runnable via `pnpm test` (the fresh run reports 2/28).
- Reference: `src/lib/pure-logic.test.ts` · `src/data/data-integrity.test.ts`

**27. What does this suite not cover yet?**
- React components (surface Hydration, theme subscriptions) — unplanted.
- Hooks like `ThemeProvider`/`useHasMounted`.
- E2E for the 26-scholar UI journeys.
This gap is **declared with a plan**: `improvement-plan.md` sections 5.1-5.2 prescribe component units and E2E automation; we don't make it a secret.
- (Question: where would the risk be if we shipped now without those tests? — the Hydration behavior and the language/theme switching are what users touch directly and need a safe picture.)

**28. How do we actually verify in the work cycle?**
`pnpm test` then `pnpm lint` then **sequentially** `pnpm build` (not in parallel so `.next` doesn't cross with the type check); I re-ran this before this review and print the output as it is.

---

## I) Trade-offs and the future plan

**29. What is the biggest trade-off we've made so far?**
I see it in the **custom theme** (ADR-009): our gain is exact no-flash control, and its price is our own maintenance surface for subscriptions and synchronization with Next releases. Second: **data in the repository** — launch speed against scaling difficulty.
- Reference: `docs/adr.md:61-67`

**30. What is the upcoming roadmap?**
The reference document is `improvement-plan.md`: **P0** priorities (error coverage / theme / RTL header) and **P1** security (structure cleanup/state cards) and **P4** (CMS/diacritics search) — and section 5 mentions the component-test and E2E path. Nobody attributes to us a schedule that became real.
- Reference: `docs/improvement-plan.md` (sections 1, 2, 4, 5)

**31. (Standby) What must never be said in any tone?**
- "The app works offline (PWA)" — there is no service worker.
- "Far faster than any alternative" — we have no benchmark run.
- "Everything is tested and guaranteed" — we own a core + integrity only.
- "We read the theme from localStorage on the server" — the server starts with `system`, then the front-end script decides before the render.

---

## Usage note for the presenter

- Every question gets an explicit 30–60 s answer; if the audience drags on, pick a "signpost" that lowers it to a general level and then the reference.
- Don't answer with the reference line alone; give the short trade-off first, then point to "the reference is at…" to show that you know where the real decision lives.
- Parenthesized questions usually come from the audience itself — have a short answer ready for them; they are the gateway to the audience's trust, not to a technical rabbit hole.
- If asked for a specific performance measurement you haven't run, say it plainly: "I haven't measured it; this is structural — you can measure it with a script right now" — honesty at that moment lifts you, it doesn't weaken you.