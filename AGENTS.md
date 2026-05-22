# AGENTS.md - Voices of Truth Development Guide

This file provides guidelines for AI agents working on the Voices of Truth project.

## Branch Naming Convention

- Format: `{type}/{description}` (kebab-case)
- Types: `ms<N>/` for milestone tasks, `feat/`, `fix/`, `chore/`, `docs/`
- Create a new branch from `main` before starting any plan
- Example: `ms1/bug-fixes-code-quality`, `feat/add-search`, `fix/broken-layout`

## Project Overview

Next.js 16 web application for browsing a directory of scholars and preachers, supporting Arabic/English i18n, dark/light themes, and server-side filtering.

## Package Manager

**Use `pnpm` only. Never use `npm` or `yarn`.**

## Build Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint for code quality |
| `pnpm lint --fix` | Auto-fix ESLint issues |

## Code Style Guidelines

### Types & Interfaces

- Define all shared types in `src/types/index.ts`
- Use TypeScript interfaces for object shapes
- Example:
  ```typescript
  export interface Scholar {
    id: number;
    name: Record<string, string>;
    socialMedia: { platform: string; link: string; icon?: string }[];
    countryId: number;
    categoryId: number;
    language: string[];
    avatarUrl: string;
    bio?: Record<string, string>;
  }
  ```

### Component Naming & Structure

- Use **PascalCase** for component file names and exports
- Use **default exports** for page components and main UI components
- Client components must include `"use client"` at the very top
- Example structure:
  ```tsx
  "use client";

  import React from 'react';
  import { Scholar } from '@/types';
  import { useTranslation } from 'react-i18next';

  interface ComponentNameProps {
    data: Scholar;
  }

  export default function ComponentName({ data }: ComponentNameProps) {
    return <div>...</div>;
  }
  ```

### Styling with Tailwind CSS

- Use `tailwind-merge` (`twMerge`) for class merging to avoid conflicts
- Always include dark mode variants (`dark:bg-*`, `dark:text-*`)
- Use CSS variables for theme colors defined in `tailwind.config.ts`
- Example:
  ```tsx
  import { twMerge } from 'tailwind-merge';

  const baseClasses = 'px-3 py-1.5 text-sm rounded-md transition-colors';
  const mergedClasses = twMerge(baseClasses, className);
  ```

### Imports & Path Aliases

- Use `@/*` alias for absolute imports from `src/`
- Import order: external libraries → React → internal components/hooks/types
- Example:
  ```tsx
  import { motion } from 'framer-motion';
  import React from 'react';
  import { Scholar } from '@/types';
  import ScholarAvatar from './ScholarAvatar';
  import { useLocalizedScholar } from '@/hooks/useLocalizedScholar';
  ```

### Internationalization (i18n)

- Use `react-i18next` for translations
- Access translations via `useTranslation('namespace')` hook
- Translation files are in `public/locales/{locale}/{namespace}.json`
- Supported locales: `en` (default), `ar` (RTL)
- Example:
  ```tsx
  const { t } = useTranslation('common');
  return <h1>{t('welcome')}</h1>;
  ```

### Server vs Client Components

- **Server Components** (`page.tsx`): Data fetching, filtering, rendering
- **Client Components** (`HomePageClient.tsx`): Interactivity, state, hooks
- Pass data from server to client components via props
- Use URL query params as source of truth for filter state

### Error Handling

- Use `console.error` for logging errors with context
- Return `null` for graceful degradation on invalid data
- Example:
  ```tsx
  if (!scholar.name) {
    console.error("Scholar with missing name:", scholar);
    return null;
  }
  ```

### Animations

- Use `framer-motion` for animations
- Common pattern:
  ```tsx
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
  ```

### Data Files

- Scholar data organized in `src/data/scholars/` by category
- Each category exports an array of `Scholar` objects
- Main export in `src/data/scholars.ts` combines all categories

### Hooks

- Custom hooks in `src/hooks/` directory
- Use `useHasMounted` to prevent hydration mismatches
- Use hooks for reusable logic (e.g., `useLocalizedScholar`)

## Key Files & Locations

| Path | Purpose |
|------|---------|
| `src/app/[locale]/page.tsx` | Server component for filtering |
| `src/app/[locale]/HomePageClient.tsx` | Client component for interactivity |
| `src/components/` | Reusable UI components |
| `src/types/index.ts` | TypeScript type definitions |
| `src/lib/i18n.ts` | i18next configuration |
| `tailwind.config.ts` | Tailwind theme configuration |

## Command Center Integration

This project uses a Command Center for task and milestone tracking. See `command-center/` for the full toolkit.

### CLI Commands

All commands must be run from the project root.

| Command | Description |
|---------|-------------|
| `pnpm cc:status` | Project status overview |
| `pnpm cc:list` | List and filter tasks |
| `pnpm cc:start <id>` | Start a task |
| `pnpm cc:complete <id>` | Mark task ready for review |
| `pnpm cc:approve <id>` | Approve and mark done |
| `pnpm cc:reject <id>` | Reject, send back |
| `pnpm cc:reset <id>` | Reset task to todo |
| `pnpm cc:block <id>` | Block a task |
| `pnpm cc:unblock <id>` | Unblock a task |
| `pnpm cc:agents` | List registered agents |
| `pnpm cc:activity` | Recent activity feed |
| `pnpm cc:mstone <id>` | Milestone overview |
| `pnpm cc:task <id>` | Full task context |
| `pnpm cc:activate <id>` | Move milestone to active |
| `pnpm cc:complete-milestone <id>` | Complete a milestone |
| `pnpm cc:register-agent <id> <name> <type>` | Register agent |
| `pnpm cc:start-mcp` | Start MCP server (stdio) |
| `pnpm cc:ui` | Launch TUI dashboard |

### AI Rules

All agents must follow the 5-phase protocol in `command-center/docs/ai-rules.md`:
1. **Think & Plan** — Define assumptions, propose simplest solution
2. **Analyze Impact** — Read relevant files, determine approach
3. **Execute** — Write complete code, no placeholders
4. **Verify** — Confirm success criteria, run build/lint
5. **Sync** — Update tracker and docs

### SOP

1. Check tracker: `pnpm cc:status`
2. Execute tasks through all 5 phases
3. Log progress: `pnpm cc:complete <id> "summary"`
4. Sync state: Update `project-tracker.json` if structure changed

## GitHub Flow (`github_flow`)

Alias for pushing changes and merging via PR. Run from the project root.

| Step | Command(s) |
|------|-----------|
| 1. Add, commit, push | `git add -A && git commit -m "<message>" && git push` |
| 2. Create and merge PR (keep branch) | `gh pr create --fill && gh pr merge --squash --auto && gh pr merge --squash` |
| 3. Update main locally | `git checkout main && git pull` |

## ESLint Configuration

Project uses `eslint.config.mjs` extending `next/core-web-vitals` and `next/typescript`. Run `pnpm lint` to check code quality.
