# Project Fixes Guide - Voices of Truth

## Issues Found and Solutions

### 🔴 Critical Issues

## 1. Fix Page Component Error (CRITICAL - Build Failing) ✅ DONE

**Problem:** `src/app/page.tsx` has invalid props for Next.js 15 App Router

**Solution:** Replace the content of `src/app/page.tsx` with:

```tsx
// src/app/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import ScholarCard from '../components/ScholarCard';
import FilterBar from '../components/FilterBar';
import { scholars as allScholarsData } from '../data/scholars';
import { Scholar } from '../types';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language; // Get language from i18n instead of props

  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [displayedScholars, setDisplayedScholars] = useState<Scholar[]>(allScholarsData);

  const uniqueCountries = useMemo(() => {
    const countriesMap = new Map<string, string>();
    allScholarsData.forEach(scholar => {
      const countryKey = scholar.country['en'] || scholar.country[Object.keys(scholar.country)[0]];
      const countryLabel = scholar.country[lang] || scholar.country['en'] || scholar.country[Object.keys(scholar.country)[0]];
      if (countryKey && !countriesMap.has(countryKey)) {
        countriesMap.set(countryKey, countryLabel);
      }
    });
    return Array.from(countriesMap, ([value, label]) => ({ value, label })).sort((a,b) => a.label.localeCompare(b.label));
  }, [lang]);

  const uniqueLanguages = useMemo(() => {
    const languagesSet = new Set<string>();
    allScholarsData.forEach(scholar => {
      scholar.language.forEach(individualLang => languagesSet.add(individualLang));
    });
    return Array.from(languagesSet).sort();
  }, []);

  useEffect(() => {
    let result = allScholarsData;
    if (selectedCountry) {
      result = result.filter(scholar => (scholar.country['en'] || scholar.country[Object.keys(scholar.country)[0]]) === selectedCountry);
    }
    if (selectedLanguage) {
      result = result.filter(scholar => scholar.language.includes(selectedLanguage));
    }
    setDisplayedScholars(result);
  }, [selectedCountry, selectedLanguage]);

  return (
    <Layout>
      <FilterBar
        uniqueCountries={uniqueCountries}
        uniqueLanguages={uniqueLanguages}
        onCountryChange={setSelectedCountry}
        onLanguageChange={setSelectedLanguage}
      />
      {displayedScholars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedScholars.map(scholar => (
            <ScholarCard key={scholar.id} scholar={scholar} currentLang={lang} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          {t('noScholarsFound')}
        </p>
      )}
    </Layout>
  );
}

export default HomePage;
```

## 2. Update Next.js to Fix Security Vulnerabilities ✅ DONE

**Run these commands:**

```bash
# Update Next.js and eslint-config-next
pnpm update next@latest eslint-config-next@latest

# Or if the above doesn't work, use:
pnpm add next@15.4.6 eslint-config-next@15.4.6
```

## 3. Remove Conflicting Lock File ✅ DONE

```bash
rm package-lock.json
```

## 4. Fix Configuration Files ✅ DONE

### 4a. Create new TypeScript i18n config file

Create `next-i18next.config.ts`:

```typescript
// next-i18next.config.ts
import path from 'path';

const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
  },
  localePath: typeof window === 'undefined' 
    ? path.resolve('./public/locales') 
    : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

export default config;
```

### 4b. Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";
import i18nConfig from './next-i18next.config';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: i18nConfig.i18n,
  /* config options here */
};

export default nextConfig;
```

### 4c. Delete old JS config:

```bash
rm next-i18next.config.js
```

## 5. Update Other Outdated Packages ✅ DONE

```bash
# Update @types/node to latest compatible version
pnpm add -D @types/node@^22.0.0

# Optional: Update Tailwind CSS to v4 (BREAKING CHANGES - review docs first)
# pnpm add -D tailwindcss@latest

# Update all dependencies to latest
pnpm update
```

## 6. Approve Build Scripts (Optional)

If you need the build scripts for sharp, core-js, etc:

```bash
pnpm approve-builds
```

## 7. Verify All Fixes ✅ DONE

Run these commands to verify everything is working:

```bash
# 1. Clean install
pnpm install

# 2. Check TypeScript
pnpm tsc --noEmit

# 3. Run linter
pnpm lint

# 4. Check for vulnerabilities
pnpm audit

# 5. Build the project
pnpm build

# 6. Test in development
pnpm dev
```

---

## Expected Results After Fixes

✅ **Build should complete successfully**
✅ **No TypeScript errors**
✅ **No critical security vulnerabilities**
✅ **Only pnpm-lock.yaml exists (no package-lock.json)**
✅ **All configs in TypeScript**

## Quick Command Summary (Copy & Paste)

```bash
# Run all fixes in sequence
rm package-lock.json
pnpm add next@15.4.6 eslint-config-next@15.4.6
pnpm add -D @types/node@^22.0.0
pnpm update
pnpm install
pnpm build
```

## Troubleshooting

### If build still fails after page.tsx fix:
- Check if `src/components/Layout.tsx` exists
- Check if `src/components/ScholarCard.tsx` exists
- Check if `src/components/FilterBar.tsx` exists
- Check if `src/data/scholars.ts` exists
- Check if `src/types/index.ts` or `src/types.ts` exists

### If i18n errors occur:
- Ensure `/public/locales/en/common.json` exists
- Ensure `/public/locales/ar/common.json` exists
- Check that i18next is properly initialized in your app

### If pnpm commands fail:
```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install
```

---

## Status Checklist

- [x] Fixed page.tsx component ✅
- [x] Updated Next.js to 15.4.6+ ✅
- [x] Removed package-lock.json ✅
- [x] Converted i18n config to TypeScript ✅
- [x] Updated next.config.ts ✅
- [x] Updated @types/node ✅
- [x] Ran pnpm audit (no critical issues) ✅
- [x] Build completes successfully ✅
- [ ] Dev server runs without errors (pending test)

---

**Date Created:** 2025-08-16
**Project:** voices-of-truth
**Package Manager:** pnpm v10.5.2
