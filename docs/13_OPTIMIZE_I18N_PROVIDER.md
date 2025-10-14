# Optimizing the I18nProviderClient Component

This guide explains how to optimize the `I18nProviderClient` component using React's `useMemo` hook to prevent unnecessary re-renders.

## The Problem

The current implementation of `I18nProviderClient.tsx` creates a new `i18next` instance on every render. This is inefficient and can lead to performance issues, as it will cause all children components to re-render, even if the language or resources haven't changed.

## The Solution

We can use the `useMemo` hook to memoize the `i18n` instance. This ensures that the instance is only recreated when its dependencies (`locale` or `resources`) change.

### Step 1: Open the file

Open the following file in your editor:
`src/components/I18nProviderClient.tsx`

### Step 2: Import `useMemo`

Add `useMemo` to the import statement from `react`.

### Step 3: Apply `useMemo`

Wrap the `i18next` instance creation and initialization logic in a `useMemo` hook. The dependency array for the hook should include `locale` and `resources`.

### Final Code

Your `src/components/I18nProviderClient.tsx` file should look like this:

```tsx
'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance, Resource } from 'i18next';
import { useMemo } from 'react';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, supportedLngs, defaultNS } from '../lib/i18n';

interface I18nProviderClientProps {
  children: React.ReactNode;
  locale: string;
  resources: Resource;
}

export default function I18nProviderClient({
  children,
  locale,
  resources,
}: I18nProviderClientProps) {
  const i18n = useMemo(() => {
    const instance = createInstance();
    instance.use(initReactI18next).init({
      supportedLngs,
      fallbackLng,
      lng: locale,
      ns: defaultNS,
      defaultNS,
      resources,
    });
    return instance;
  }, [locale, resources]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

By following these steps, you will have an optimized `I18nProviderClient` that performs better.
