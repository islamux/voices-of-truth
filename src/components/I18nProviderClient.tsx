'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, supportedLngs, defaultNS } from '../lib/i18n';

import { Resource } from 'i18next';

export default function I18nProviderClient({
  children,
  locale,
  resources
}: {
  children: React.ReactNode;
  locale: string;
  resources: Resource;
}) {
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

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
