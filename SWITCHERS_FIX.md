# Fixing Missing Theme and Language Switchers

## Problem

The theme switcher (for light/dark mode) and the language switcher (English/Arabic) are not visible on the page. 

This is because the main `Layout` component, which contains the header and all the switcher buttons and logic, is not being used to structure the pages.

The root layout file (`src/app/[locale]/layout.tsx`) correctly sets up the necessary providers, but it doesn't include the visual `Layout` component that renders the site's header and footer.

## Solution

To fix this, you need to import the `Layout` component and use it to wrap the `children` in `src/app/[locale]/layout.tsx`.

### File to Modify

`src/app/[locale]/layout.tsx`

### Before Change

```tsx
// src/app/[locale]/layout.tsx

import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await Promise.resolve(params);
  const { resources } = await getTranslation(locale);

  return (
    <I18nProviderClient
      locale={locale}
      resources={resources}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </I18nProviderClient>
  );
}

// ...
```

### After Change

```tsx
// src/app/[locale]/layout.tsx

import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/Layout'; // Import the Layout component

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await Promise.resolve(params);
  const { resources } = await getTranslation(locale);

  return (
    <I18nProviderClient
      locale={locale}
      resources={resources}
    >
      <ThemeProvider>
        <Layout>{children}</Layout>  {/* Wrap children with the Layout component */}
      </ThemeProvider>
    </I18nProviderClient>
  );
}

// ...
```

### Summary of Changes

1.  **Import `Layout`:** We added `import Layout from '@/components/Layout';` to make the component available.
2.  **Wrap `children`:** We wrapped the `{children}` prop with `<Layout>{children}</Layout>`. 

By doing this, every page will now be rendered inside your main `Layout` component, which will display the header containing the theme and language switchers, as well as the footer.
