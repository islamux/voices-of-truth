import I18nProviderClient from '../../components/I18nProviderClient';
import { use } from 'react';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = use(params);
  const isRTL = locale === 'ar';
  
  // Set the lang and dir attributes on the document
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }
  
  return (
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  );
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
