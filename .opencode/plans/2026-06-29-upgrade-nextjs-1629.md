# Next.js 16.2.9 + Full Dependency Upgrade Plan

**Goal:** Upgrade the project from Next.js 16.2.6 to 16.2.9 along with all related dependencies and clean up stale command-center references after the directory was deleted.

**Architecture:** Bump version numbers in package.json, migrate Tailwind CSS v3→v4 (config moves to CSS), add `types: ["node"]` for TS 6, remove autoprefixer, delete stale command-center references from docs and config.

**Tech Stack:** Next.js 16.2.9, React 19.2.7, TypeScript 6.0.3, ESLint 10.6.0, Tailwind CSS 4.3.1, i18next 26.3.3, react-i18next 17.0.8, framer-motion 12.42.0

---

### Task 1: Update package.json versions

**Files:**
- Modify: `package.json`

**Production deps to change:**
- `next`: `"16.2.6"` → `"16.2.9"`
- `react`: `"^19.1.1"` → `"^19.2.7"`
- `react-dom`: `"^19.1.1"` → `"^19.2.7"`
- `framer-motion`: `"^12.23.12"` → `"^12.42.0"`
- `i18next`: `"^25.3.6"` → `"^26.3.3"`
- `react-i18next`: `"^15.6.1"` → `"^17.0.8"`
- `react-icons`: `"^5.5.0"` → `"^5.6.0"`
- `tailwind-merge`: `"^3.3.1"` → `"^3.6.0"`

**Dev deps to change:**
- `typescript`: `"^5.9.2"` → `"^6.0.3"`
- `@types/react`: `"^19.1.10"` → `"^19.2.17"`
- `@types/react-dom`: `"^19.1.7"` → `"^19.2.3"`
- `@types/node`: `"^22.17.2"` → `"^26.0.1"`
- `eslint`: `"^9.33.0"` → `"^10.6.0"`
- `eslint-config-next`: `"15.4.7"` → `"16.2.9"`
- `@eslint/eslintrc`: `"^3.3.1"` → `"^3.3.5"`
- `tailwindcss`: `"^3.4.17"` → `"^4.3.1"`
- `postcss`: `"^8.5.6"` → `"^8.5.15"`
- **Add:** `"@tailwindcss/postcss": "^4.3.1"`
- **Remove:** `"autoprefixer": "^10.4.21"` (built into Tailwind v4)

### Task 2: Update tsconfig.json for TypeScript 6.0

**Files:**
- Modify: `tsconfig.json`

Add `"types": ["node"]` under `compilerOptions`. TS 6.0 no longer auto-discovers `@types/*` packages.

### Task 3: Migrate PostCSS config for Tailwind v4

**Files:**
- Modify: `postcss.config.mjs`

Change plugin from `tailwindcss: {}` to `'@tailwindcss/postcss': {}`.

### Task 4: Migrate globals.css for Tailwind v4

**Files:**
- Modify: `src/app/globals.css`

Replace `@tailwind base; @tailwind components; @tailwind utilities;` with `@import "tailwindcss";` and `@theme` directive for custom colors. Add `@custom-variant dark` for class-based dark mode. Keep `@layer base` with CSS variable definitions unchanged.

### Task 5: Delete tailwind.config.ts

**Files:**
- Delete: `tailwind.config.ts`

Tailwind v4 uses CSS-based config via `@theme` — JS config file no longer needed.

### Task 6: Clean up AGENTS.md

**Files:**
- Modify: `AGENTS.md`

**Changes:**
1. Remove lines 15-20 (`pnpm cc:status`, `cc:start`, `cc:complete`, `cc:task`, `cc:ui`, `cc:start-mcp` from Commands table)
2. Remove lines 84-99 (entire "Command Center" section including "AI Rules" and "SOP" subsections)
3. Update line 5 Next.js version from `16.2.6` to `16.2.9`

**Result:**
- Commands table keeps only: `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`
- GitHub Flow and ESLint sections remain unchanged
- Project description reflects new Next.js version

### Task 7: Clean up README.md

**Files:**
- Modify: `README.md`

**Changes:**
1. Update version badges (line 6-7):
   - `Next.js-16.2.6` → `Next.js-16.2.9`
   - `TypeScript-5.9` → `TypeScript-6.0`
   - `Tailwind-3.4` → `Tailwind-4`
2. Remove lines 45-47 (`pnpm cc:status`, `cc:start`, `cc:complete` from Scripts table)
3. Remove line 89 (`├── command-center/` line and update indentation of `└── docs/`)
4. Update Prerequisites: Node.js `18+` → `20.9+` (Next.js 16 requirement)

### Task 8: Delete or empty pnpm-workspace.yaml

**Files:**
- Modify: `pnpm-workspace.yaml`

Replace contents with empty/no packages:
```yaml
packages: []
```
(Or delete the file entirely — the project has no workspace packages now.)

### Task 9: Delete project-tracker.json

**Files:**
- Delete: `project-tracker.json`

Command center artifact (6466 lines of historical task data). The command center directory was deleted, so this file has no consumers.

### Task 10: Delete .cc-backups/ directory

**Files:**
- Delete: `.cc-backups/` (entire directory)

Backup tracker JSON files — command center artifacts.

### Task 11: Archive stale docs

**Files:**
- Modify: `docs/archive/setup-command-center.md`
- Modify: `docs/archive/command-center-blueprint-textual.md`
- Modify: `docs/archive/command-center-blueprint-voices-of-truth.md`

For each archived doc, update the status line to indicate the command center has been removed from the project.

### Task 12: Update docs/README.md index

**Files:**
- Modify: `docs/README.md`

Remove (or update status to `🗑️ Removed`) the Blueprints section entries for command-center docs, since the command center no longer exists in the project.

### Task 13: Install & verify

```bash
pnpm install
pnpm lint
pnpm build
```
