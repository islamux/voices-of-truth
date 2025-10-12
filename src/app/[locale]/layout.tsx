
import { getTranslation, supportedLngs } from '../../lib/i18n';
import I18nProviderClient from '../../components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/PageLayout';  //import the layout components

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const { resources } = await getTranslation(locale);

  return (
    <I18nProviderClient
    locale={locale}
    resources={resources}
  >
    <ThemeProvider>
    <Layout> {/*wrap children with the layout component*/}
    {children}
    </Layout>
    </ThemeProvider>

    </I18nProviderClient>
  );
}

// Generate static params for all supported locales (Make the func generic avoid hardcoded)
export async function generateStaticParams() {
  return supportedLngs.map(function(locale){
    return {locale: locale};
  });
}

// Generate static params for all supported locales
//export async function generateStaticParams() {
//  return [{ locale: 'en' }, { locale: 'ar' }];
//}
