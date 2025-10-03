// Locale-specific root layout.
// This file is rendered for every route under /[locale]/...
// Example: visiting /en or /ar will use this layout to wrap the page.
// Goal: Load translations on the SERVER, then pass them (resources) to a client provider
// so the client doesn't re-fetch translation JSON.

import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/Layout'; // Structural app layout (header/footer/etc.)

interface RootLayoutProps {
  children: React.ReactNode;
  // NOTE: In this project params is typed as a Promise. In a typical Next.js
  // app router setup it would just be: params: { locale: string }. We await it below.
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // 1. Resolve the params to extract the dynamic [locale] segment
  const { locale } = await params;

  // 2. Load translation resources on the server for this locale
  // getTranslation returns an object containing:
  //  - resources: the raw translation bundles (for hydration)
  //  - t / i18n: (not needed here because we only pass resources)
  const { resources } = await getTranslation(locale);

  // 3. Wrap the application subtree with the I18nProviderClient so that
  // client components can use hooks like useTranslation().
  // 4. ThemeProvider and Layout are standard app wrappers (unrelated to i18n logic).
  return (
    <I18nProviderClient locale={locale} resources={resources}>
      <ThemeProvider>
        <Layout>
          {/** Child routes / pages render here */}
          {children}
        </Layout>
      </ThemeProvider>
    </I18nProviderClient>
  );
}

// Static generation: emit one path per supported locale.
// If you add a new language, include it here AND in supportedLngs (i18n.ts) and middleware locales.
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
