// src/components/I18nProviderClient.tsx
"use client";

import React, { ReactNode, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18nInstance from '../lib/i18n'; // Adjust path if lib is not at src/lib
import { useParams } from 'next/navigation';

interface I18nProviderClientProps {
  children: ReactNode;
}

const I18nProviderClient: React.FC<I18nProviderClientProps> = ({ children }) => {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang as string | undefined;
  const { i18n: i18nFromHook } = useTranslation(); // Get the instance from the hook

  useEffect(() => {
    const currentEffectiveLang = lang || i18nInstance.language;
    if (currentEffectiveLang && i18nFromHook.language !== currentEffectiveLang) {
      i18nFromHook.changeLanguage(currentEffectiveLang);
    }
  }, [lang, i18nFromHook]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nProviderClient;
