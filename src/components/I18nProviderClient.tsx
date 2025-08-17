// src/components/I18nProviderClient.tsx
"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from '../lib/i18n';

interface I18nProviderClientProps {
  children: ReactNode;
  locale: string;
}

const I18nProviderClient: React.FC<I18nProviderClientProps> = ({ children, locale }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure i18n is initialized before rendering children
    const initI18n = async () => {
      if (!i18nInstance.isInitialized) {
        await i18nInstance.init();
      }
      if (locale && i18nInstance.language !== locale) {
        await i18nInstance.changeLanguage(locale);
      }
      setIsReady(true);
    };
    
    initI18n();
  }, [locale]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nProviderClient;
