# Presentation package — "Voices of Truth"

> An internal engineering review, in **English**, for the technical team, **60 minutes**.
> The package files live in `presentation/` and are **outside the app's scope and not deployed to Vercel**
> (kept out of the project tree's build for that reason).

## Files and responsibilities

| File | Content | Use it when |
|------|---------|------------|
| `slides.html` | The deck itself: 34 RTL Arabic slides in the "Contemporary Voices" style, `data-notes` on every slide, overview mode, full shortcut set | during the session |
| `slides.en.html` | The same deck in LTR English, same structure and mechanics | for an English-language session |
| `demo-script.md` | 10-minute live demo script (+ 5-minute compressed track) with a numbered sequence and real commands | during the live recording |
| `demo-script.en.md` | The same live demo script in English | during an English live session |
| `qa-guide.md` | 31 questions split into 9 sections, each answer 30–60 s with a real `path:line` code reference | the Q&A session |
| `qa-guide.en.md` | The same hardened Q&A in English | an English Q&A session |
| `README.en.md` | This file, in English | reference during preparation |

## Running the deck

Open `slides.en.html` (or `slides.html`) directly in the browser with no server needed:

```bash
xdg-open presentation/slides.en.html
```

Shortcuts:

| Key | Function |
|-----|----------|
| `→` `Space` `PageDown` | next slide |
| `←` `PageUp` | previous slide |
| `Home` / `End` | first / last |
| `F` | fullscreen |
| `O` | overview (slide grid) |
| `N` | open/close presenter notes |
| `T` | toggle theme (light/dark) |
| `Esc` | close the overview or the notes |
| finger swipe (touch) | navigate |

Direct jump: reach a slide through a URL carrying its number — `slides.en.html#5`.
The theme opens with the value saved in `localStorage`; to reset, delete the `deck-theme` key.

## Session order (60 minutes)

1. **A full rehearsal** run once, strictly (checklist below).
2. **Opening** (slides 1–3, 5 min) — one opening sentence, the technical framing.
3. **Thesis** (4, 4 min) — the decision we examine today.
4. **The decision journey** (5–9, 7 min) — the "acquisition waves" stories.
5. **The mental model** (10–11, 4 min) — the decision map and its alternatives.
6. **The product** (12–13, 5 min) — the art and language archive; then we zoom in.
7. **The technical dive** (14–25, 14 min) — structure, filters, pagination, theme, Arabic search, **Hydration** (26–29 included).
8. **The live demo** (30 we switch, 10 min) — follow `demo-script.en.md`.
9. **Trade-offs** (31, 4 min) — what we chose and what we didn't measure.
10. **The roadmap** (32, 3 min) — `improvement-plan.md` with no time promises.
11. **Closing** (33–34, 4 min) — the synthesized check question: "would you build it this way with a fresh team?" then a single message.

The budget above each section is on the slides themselves — the timing is in the `data-notes`.

## Rehearsal checklist (60 minutes)

- [ ] Open `slides.en.html` and verify the count: **34 slides**, and the top counter shows `1 / 34`.
- [ ] Try every shortcut (→/←/Space/Home/End/F/O/N/T/Esc) once.
- [ ] `O` — the overview grid shows every slide with its title, and clicking jumps to the right one.
- [ ] Slides 26–29 (Hydration): read the notes aloud once to be sure of their wording.
- [ ] Time the real full narration — stop the stopwatch and see whether a section truly slipped.
- [ ] **Live demo rehearsal**: actually run half the steps (diacritized Arabic search, a country filter, a language/theme switch, a 404), don't just read them; save one screenshot per stage as the backup plan.
- [ ] `pnpm test` → expect the "2 files · 28 tests" line and 100% pass.
- [ ] `pnpm lint` → no errors, then `pnpm build` **sequentially**.
- [ ] If the machine dies during the session: open `slides.en.html` straight from disk (no server needed) and run the live demo through the saved screenshots.
- [ ] Have `qa-guide.en.md` open in a second window, ready for section I.

## The honesty pillar of the narration

Don't hand the team a number with no measurement, and don't turn an architecture into a paper promise:
- **No** "PWA / offline" — there is no Service Worker (manifest only).
- **No** "faster than everyone" — we present pre-declaration (52 paths declared at build) and pagination as structural, credible options, not as a comparative measurement; and remember the build log marks them "ƒ dynamic" because the root reads the header, so we don't say "served from a CDN".
- **No** "everything is tested" — our suite is core + integrity (28 tests), and its gaps are **declared** in `improvement-plan.md` section 5.
- The only allowed war is against what can be verified during the session itself: the `pnpm` commands above are the line.

The last slide is signed with one message; make it the team's message: "This project went from an interface to a ledger of documented decisions — that is the asset worth keeping."