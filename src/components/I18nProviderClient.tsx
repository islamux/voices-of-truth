'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, supportedLngs, defaultNS } from '../lib/i18n';
import { Resource } from 'i18next';
import { useMemo } from 'react';

interface I18nProviderClientProps {
  children: React.ReactNode;
  locale: string;
  resources: Resource;
}

export default function I18nProviderClient({
  children,
  locale,
  resources,
}: I18nProviderClientProps) {
  const i18n = useMemo(() => {
    const instance = createInstance();
    instance
      .use(initReactI18next)
      .init({
        supportedLngs,
        fallbackLng,
        lng: locale,
        ns: defaultNS,
        defaultNS,
        resources,
      });
    return instance;
  }, [locale, resources]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
