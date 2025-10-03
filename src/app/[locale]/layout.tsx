// Locale-specific root layout.
// Rendered for every route under /[locale]/...
// Using Promise-based params (awaited) to satisfy Next.js dynamic API expectations.
// Loads translations on the server and hydrates the client provider.

import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/Layout'; // Structural app layout (header/footer/etc.)

interface RootLayoutProps {
  children: React.ReactNode;
  // params is delivered as a Promise (Next.js warning indicated we must await it)
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Await params to safely access locale (fixes dynamic API warning)
  const { locale } = await params;

  const { resources } = await getTranslation(locale);

  return (
    <I18nProviderClient locale={locale} resources={resources}>
      <ThemeProvider>
        <Layout>
          {children}
        </Layout>
      </ThemeProvider>
    </I18nProviderClient>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
