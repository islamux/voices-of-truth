import I18nProviderClient from "@/components/I18nProviderClient";
import PageLayout from "@/components/PageLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from '@/lib/theme';
import { getTranslation, supportedLngs } from "@/lib/i18n";
import type { Metadata } from "next";

interface LocaleLayoutProps{
  children : React.ReactNode;
  params: Promise<{locale: string}>;
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'common');
  return {
    title: t('appTitle'),
    description: 'A bilingual directory of renowned Islamic scholars and preachers worldwide.',
  };
}

export default async function LocaleLayout({children, params}:LocaleLayoutProps){

  const {locale} = await params; 
  const {resources} = await getTranslation(locale, ['common', 'header']);

  return (
    <ThemeProvider>
    <I18nProviderClient locale={locale} resources={resources} >
      <ErrorBoundary><PageLayout> {children} </PageLayout></ErrorBoundary>
    </I18nProviderClient>
    </ThemeProvider>
  );
}

export async function generateStaticParams() {
  return supportedLngs.map(function(locale) {
    return { locale :locale};
  });
}