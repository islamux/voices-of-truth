# Styling Guide: Tailwind v4 + OKLCH Tokens + Custom Theming

> **Status:** ✅ Current — Tailwind v4 CSS-based config (`@theme`), OKLCH token palette, custom `ThemeProvider` (no `next-themes`, no `tailwind.config.ts`).

This guide describes the styling architecture as it exists today.

## 1. Technologies

- **Tailwind CSS v4** — configured via the `@theme` directive in CSS (no JavaScript config file).
- **PostCSS** — `@tailwindcss/postcss` processes Tailwind; autoprefixing is built into v4.
- **CSS custom properties** — all theme values are OKLCH triples (e.g. `0.24 0.027 250`) consumed as `oklch(var(--token))`.

## 2. Configuration

### `postcss.config.mjs`

```javascript
const config = { plugins: { '@tailwindcss/postcss': {} } };
export default config;
```

### `src/app/globals.css` (the single source of truth)

Tailwind v4 replaces `tailwind.config.ts` with a CSS-based `@theme` block. There is **no `tailwind.config.ts`**.

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-background: oklch(var(--background));
  --color-foreground: oklch(var(--foreground));
  --color-card: oklch(var(--card));
  --color-primary: oklch(var(--primary));
  --color-accent: oklch(var(--accent));
  /* ...radius, fonts, and the rest of the token map */
  --radius-lg: 0.75rem;
  --font-sans: var(--font-plex), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-grotesk), var(--font-plex), sans-serif;
}
```

- `@import "tailwindcss"` — single-entry import (replaces `@tailwind base/components/utilities`).
- `@custom-variant dark (...)` — class-based dark mode; active when `.dark` is on `<html>`.
- `@theme` — registers tokens as CSS variables so utilities like `bg-card`, `text-foreground`, `border-border`, and `rounded-lg` work.

### Token values

Tokens are OKLCH triples (lightness chroma hue), defined under `:root` (light) and `.dark`:

```css
@layer base {
  :root {
    --background: 0.98 0.006 245;
    --foreground: 0.24 0.027 250;
    --card: 0.997 0.003 245;          /* elevated above background */
    --accent: 0.72 0.14 68;           /* the single warm amber accent */
    /* ... */
  }
  .dark {
    --background: 0.175 0.022 255;
    --card: 0.215 0.024 255;          /* un-collapsed: cards lift above bg */
    --accent: 0.76 0.14 75;
    /* ... */
  }
}
```

Notes:
- Neutrals are tinted toward a cool ink hue (~245–255) — never raw black/white.
- Dark-mode tokens are **un-collapsed**: `card`, `popover`, `secondary`, `muted`, `accent`, and `border` each have distinct values so surfaces elevate.
- The amber accent is reserved for non-text (marks, hovers, focus rings, selection). Where it appears as small text (`.text-eyebrow`), light mode uses a deeper, AA-safe gold; dark mode uses the vibrant accent.

## 3. Custom `ThemeProvider`

The project uses a **custom** provider in `src/lib/theme.tsx` (not `next-themes`) for Next.js 16 / React 19 compatibility. It exposes `'light' | 'dark' | 'system'` via React Context, persists to `localStorage`, listens to `matchMedia` for system changes, and toggles the `.dark` / `.light` class on `<html>`.

An inline script in `src/app/layout.tsx` applies the resolved theme before hydration to prevent FOUC:

```tsx
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'system';
      var resolved = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      document.documentElement.classList.add(resolved);
      document.documentElement.style.colorScheme = resolved;
    } catch(e) {}
  })();
`;
```

`suppressHydrationWarning` on `<html>` covers the expected class mismatch between server and first client paint.

## 4. Typography (`next/font`)

Fonts are loaded in `src/app/layout.tsx` and exposed as CSS variables on `<body>`:

- **Space Grotesk** (`--font-grotesk`) — Latin display.
- **IBM Plex Sans** (`--font-plex`) — Latin body.
- **Markazi Text** (`--font-markazi`) — Arabic body.
- **Amiri** (`--font-amiri`) — Arabic display (naskh).

A `:lang(ar)` rule swaps the stacks so Arabic uses the naskh families, and resets negative letter-spacing (which breaks Arabic cursive joining) plus adds line-height:

```css
:lang(ar) {
  --font-sans: var(--font-markazi), var(--font-plex), ui-serif, Georgia, serif;
  --font-display: var(--font-amiri), var(--font-markazi), serif;
}
:lang(ar) .text-display,
:lang(ar) .text-display-sm { font-weight: 700; letter-spacing: 0; line-height: 1.3; }
:lang(ar) .tracking-tight { letter-spacing: 0; }
```

## 5. Usage in components

Prefer semantic token utilities over raw palette colors:

```tsx
// Correct: theme-aware tokens
<div className="bg-card text-foreground border border-border rounded-lg">
  <span className="text-muted-foreground">…</span>
</div>
```

Use the `dark:` prefix only when a token does not already encode the difference (most surfaces do). Avoid raw `gray-*` / `blue-*` — they bypass the token system and break theming.
