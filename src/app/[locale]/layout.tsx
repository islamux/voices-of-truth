import I18nProviderClient from "@/components/I18nProviderClient";
import PageLayout from "@/components/PageLayout"; 
import { ThemeProvider } from 'next-themes';
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
    description: t('appTitle'),
  };
}

interface LocaleLayoutProps{
  children : React.ReactNode;
  params: Promise<{locale: string}>;

}

export default async function LocaleLayout({children, params}:LocaleLayoutProps){

  const {locale} = await params; 
  const {resources} = await getTranslation(locale, ['common', 'header']);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
    <I18nProviderClient locale={locale} resources={resources} >
      <PageLayout> {children} </PageLayout>
    </I18nProviderClient>
    </ThemeProvider>
  );
}

// Generate static params for each supported locale
export async function generateStaticParams() {
  return supportedLngs.map(function(locale) {
    return { locale :locale};
  });
}