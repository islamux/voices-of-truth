"use client";

import { useEffect } from 'react';
import I18nProviderClient from './I18nProviderClient';

interface LocaleProviderProps {
  children: React.ReactNode;
  locale: string;
}

export default function LocaleProvider({ children, locale }: LocaleProviderProps) {
  const isRTL = locale === 'ar';
  
  useEffect(() => {
    // Set the lang and dir attributes on the html element
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [locale, isRTL]);
  
  return (
    <I18nProviderClient locale={locale}>
      {children}
    </I18nProviderClient>
  );
}
