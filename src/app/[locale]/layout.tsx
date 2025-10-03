// Locale-specific root layout.
// Rendered for every route under /[locale]/...
// Refactored to standard Next.js pattern: params is a plain object (not a Promise).
// Loads translations on the server and hydrates the client provider.

import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/Layout'; // Structural app layout (header/footer/etc.)

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = params; // params is now synchronous

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
