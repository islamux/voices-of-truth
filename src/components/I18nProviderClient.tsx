'use client';

import { I18nextProvider } from 'react-i18next';
import  { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, supportedLngs, defaultNS } from '../lib/i18n';
import { Resource } from 'i18next';
import { useMemo } from 'react';

interface I18nProviderClientProps {
  children: React.ReactNode;
  locale: string;
  resources: Resource;
}

export default function I18nProviderClient({  children,  locale,  resources}:I18nProviderClientProps) {

  // Create a new i18n instance for each render to avoid sharing state between requests
  // Memoize the instance to avoid re-creating it on every render
  // This is important for performance and to avoid issues with concurrent requests

  const   i18Memoize = useMemo(() => {
    const i18n = createInstance();
    i18n
      .use(initReactI18next)
      .init({
        supportedLngs,
        fallbackLng,
        lng: locale,
        ns: defaultNS,
        defaultNS,
        resources,
      });
    return i18n;
  },[locale, resources]);


  return <I18nextProvider i18n={i18Memoize}> {children} </I18nextProvider>;
}
