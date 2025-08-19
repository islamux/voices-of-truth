import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export const fallbackLng = 'en';
export const supportedLngs = [fallbackLng, 'ar'];
export const defaultNS = 'common';

async function initI18next(
  lng: string,
  ns: string | string[]
) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      supportedLngs,
      fallbackLng,
      lng,
      ns,
      defaultNS,
      fallbackNS: defaultNS,
    });
  return i18nInstance;
}

export async function getTranslation(
  lng: string,
  ns: string | string[] = defaultNS
) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
    resources: i18nextInstance.services.resourceStore.data,
  };
}
