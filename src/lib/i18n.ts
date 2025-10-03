import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export const fallbackLng = 'en';
// Add new locales here; first one (fallbackLng) is used as the overall fallback language.
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
        // Dynamically import the JSON file for the requested language + namespace.
        // This keeps initial bundles small and only loads what is needed per request.
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
