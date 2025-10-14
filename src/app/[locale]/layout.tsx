import I18nProviderClient from "@/components/I18nProviderClient";
import PageLayout from "@/components/PageLayout"; 
import ThemeProvider from "@/components/ThemeProvider";
import { getTranslation, supportedLngs } from "@/lib/i18n";

interface LocaleLayoutProps{
  children : React.ReactNode;
  params: Promise<{locale: string}>;

}

export default async function LocaleLayout({children, params}:LocaleLayoutProps){

  const {locale} = await params; 
  const {resources} = await getTranslation(locale);

  return (
    // Provide internationalization context to the application 
    // and wrap with ThemeProvider for theming support 
    // and PageLayout for consistent page structure
    <I18nProviderClient locale={locale} resources={resources} > 

    <ThemeProvider>
    <PageLayout> {children} </PageLayout>
    </ThemeProvider>

    </I18nProviderClient> 
  );
}

// Generate static params for each supported locale
export async function generateStaticParams() {
  return supportedLngs.map(function(locale) {
    return { locale :locale};
  });
}

