import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

/*
  Basic internationalization (i18n) helper for the app.

  What this file does:
  1. Defines which languages (locales) the site supports.
  2. Dynamically loads translation JSON files (so unused languages/namespaces are not bundled up-front).
  3. Creates and configures a fresh i18next instance on the server for each request.
  4. Exposes a small helper (getTranslation) so server components can easily access the "t" function and raw resources.

  Key concepts in simple words:
  - Language / Locale (lng): e.g. 'en', 'ar'. Determines which folder under /public/locales/ we load from.
  - Namespace (ns): Logical group of translation keys (we currently only use 'common'). You can split large translation
    files into multiple namespaces later (e.g. 'auth', 'profile', 'dashboard').
  - Fallback language: If a key is missing in the active language, we show the value from this language instead.

  Folder structure expected by the dynamic import below:
    public/locales/{language}/{namespace}.json
    Example: public/locales/en/common.json
             public/locales/ar/common.json

  How to add a new language quickly:
    1. Create a new folder under public/locales (e.g. 'fr').
    2. Copy common.json from 'en' as a starting point and translate its values.
    3. Add the new code (e.g. 'fr') to supportedLngs below.

  NOTE: We deliberately create a NEW i18next instance per request on the server (instead of a singleton) to avoid
  accidental cross-request state sharing in a server / RSC environment. This is simple and safe for most apps.
*/

export const fallbackLng = 'en';
// List of supported locales. The first one (fallbackLng) acts as the fallback when a translation key is missing.
export const supportedLngs = [fallbackLng, 'ar'];
// The default namespace we use if none is explicitly requested.
export const defaultNS = 'common';

// Internal helper that sets up i18next with the given language + namespace(s).
async function initI18next(
  lng: string,
  ns: string | string[]
) {
  // Create an isolated i18next instance (so no shared mutable global state).
  const i18nInstance = createInstance();

  await i18nInstance
    // Plug in react-i18next so React components can consume translations on the client side.
    .use(initReactI18next)
    // Configure how translation JSON files are loaded (dynamic import = code splitting / lazy loading).
    .use(
      resourcesToBackend(
        // Given a language (e.g. 'en') and a namespace (e.g. 'common'), we import that JSON file.
        // Adding a new namespace just means creating another JSON file next to common.json.
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    // Initialize i18next with our settings.
    .init({
      supportedLngs,    // Which languages users can pick.
      fallbackLng,      // Language to fall back to if a key is missing.
      lng,              // The active language for this particular request.
      ns,               // Namespace(s) we want to load.
      defaultNS,        // Default namespace if one is not specified when calling t().
      fallbackNS: defaultNS, // If a key is missing in a non-default namespace, look in the default one.
    });

  return i18nInstance;
}

// Public helper used by server components / loaders to get:
//  - t: a translation function already fixed to the chosen language + first namespace.
//  - i18n: the configured instance (if you need advanced features).
//  - resources: raw loaded translation data (often passed to a client provider to avoid re-fetching on the client).
export async function getTranslation(
  lng: string,
  ns: string | string[] = defaultNS
) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    // getFixedT ensures the translation function is bound to the correct language + first namespace.
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nextInstance,
    // Expose the resource store so the client can hydrate i18next without loading files again.
    resources: i18nextInstance.services.resourceStore.data,
  };
}
