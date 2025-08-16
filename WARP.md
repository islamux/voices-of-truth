# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Voices of Truth** is a Next.js 15 web application that displays a directory of Islamic scholars and preachers worldwide. It features internationalization (Arabic/English), dark/light theme support, and filtering capabilities.

## Commands

### Development
```bash
# Install dependencies
npm install

# Run development server with Turbopack
npm run dev

# Access the app at:
# - http://localhost:3000/en (English)
# - http://localhost:3000/ar (Arabic)
```

### Build & Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Code Quality
```bash
# Run ESLint
npm run lint

# TypeScript type checking (no dedicated script, runs during build)
npm run build
```

### Git Workflow
```bash
# Stage all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to current branch
git push

# Push to specific remote branch
git push origin branch-name

# Switch to main branch
git checkout main

# Merge feature branch to main
git merge feature-branch-name

# Push merged changes to remote main
git push origin main
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.12
- **Internationalization**: i18next, react-i18next, next-i18next
- **Icons**: React Icons 5.5.0
- **State Management**: React hooks (useState, useEffect, useMemo)

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page (scholar directory)
│   └── globals.css        # Global styles and CSS variables
├── components/
│   ├── Layout.tsx         # Main layout with header, footer, theme/language switchers
│   ├── ScholarCard.tsx    # Individual scholar display card with social media links
│   ├── FilterBar.tsx      # Country and language filtering controls
│   └── I18nProviderClient.tsx  # Client-side i18n provider wrapper
├── data/
│   └── scholars.ts        # Scholar data (mock data structure)
├── lib/
│   └── i18n.ts           # i18next configuration
├── services/
│   └── avatarService.ts  # Avatar image handling service
└── types/
    └── index.ts          # TypeScript interfaces (Scholar type definition)
```

### Key Architectural Patterns

1. **Data Flow**:
   - Scholar data is stored in `src/data/scholars.ts` as a static array
   - Main page (`src/app/page.tsx`) manages filtering state and passes filtered data to components
   - Components receive data via props and use i18n hooks for translations

2. **Internationalization**:
   - Translations stored in `public/locales/{lang}/common.json`
   - Language switching updates URL path (e.g., `/en` to `/ar`)
   - RTL support for Arabic through Tailwind classes
   - All text content supports both Arabic and English

3. **Theming**:
   - Dark/light mode toggle stored in localStorage
   - Applied via Tailwind's `dark:` variant classes
   - CSS variables in `globals.css` define color schemes

4. **Component Responsibilities**:
   - `Layout.tsx`: App shell, navigation, theme/language controls
   - `FilterBar.tsx`: Stateless filtering UI, communicates via callbacks
   - `ScholarCard.tsx`: Scholar presentation with social media icon mapping
   - `page.tsx`: State management, data filtering logic, component orchestration

### Data Schema

The `Scholar` interface (from `src/types/index.ts`):
```typescript
interface Scholar {
  id: string
  name: Record<string, string>        // { en: "...", ar: "..." }
  socialMedia: {
    platform: string
    link: string
    icon?: string                    // React Icons component name
  }
  country: Record<string, string>     // { en: "...", ar: "..." }
  language: string[]                  // ["Arabic", "English", etc.]
  avatarUrl: string
  bio?: Record<string, string>        // Optional biography
}
```

### State Management

The application uses React's built-in state management:
- **Filtering State**: Managed in `page.tsx` with `useState` for country/language filters
- **Theme State**: Managed in `Layout.tsx` with localStorage persistence
- **Language State**: Handled by i18next with URL-based routing

### Styling Approach

- Tailwind CSS utility classes for all styling
- Dark mode via `dark:` variant classes
- Responsive design with `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Custom CSS variables for theme colors in `globals.css`
- Framer Motion for card animations and hover effects

## Important Considerations

1. **Image Handling**: Scholar avatars are expected in `/public/avatars/` with fallback to `default-avatar.png`

2. **Icon Mapping**: Social media icons use React Icons components mapped by string names in `ScholarCard.tsx`

3. **Language Detection**: Configured to check URL path first, then localStorage, then browser settings

4. **Performance**: Uses React's `useMemo` for expensive computations (unique countries/languages extraction)

5. **TypeScript**: Strict mode enabled, all components and data structures are fully typed
