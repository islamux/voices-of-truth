// src/lib/i18n.ts
import i18n from 'i18next'; // Core i18next library.
import { initReactI18next } from 'react-i18next'; // Integrates i18next with React.
import LanguageDetector from 'i18next-browser-languagedetector'; // Detects user language in the browser.
import HttpApi from 'i18next-http-backend'; // Loads translations from a backend or public folder.

i18n
  .use(HttpApi) // Plugs in the HTTP backend for loading translation files.
  .use(LanguageDetector) // Plugs in the language detector.
  .use(initReactI18next) // Initializes i18next for React.
  .init({
    supportedLngs: ['en', 'ar'], // Defines the languages supported by the application.
    fallbackLng: 'en', // Sets the fallback language if the detected language is not supported.
    defaultNS: 'common', // Default namespace to use for translations.
    ns: ['common'], // Specifies the namespaces to load. 'common' is used for shared translations.
    backend: {
      // Configures the HTTP backend.
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path pattern for loading translation files.
                                               // {{lng}} will be replaced by the language code (e.g., 'en').
                                               // {{ns}} will be replaced by the namespace (e.g., 'common').
    },
    detection: {
      // Configures language detection.
      // Order of detection methods:
      // 1. 'path': Looks for the language in the URL path (e.g., /en/somepage).
      // 2. 'localStorage': Checks if the language is set in localStorage.
      // 3. 'navigator': Uses the browser's default language.
      order: ['path', 'localStorage', 'navigator'],
      caches: ['localStorage'], // Caches the detected language in localStorage for persistence.
      lookupFromPathIndex: 0,  // Specifies the index in the URL path segments where the language code is located (e.g., /en -> 0).
    },
    react: {
      // React-specific i18next configurations.
      useSuspense: false, // Disables React Suspense for translations. Can be useful for simpler setups.
                           // For server-side rendering or more complex apps, Suspense might be enabled.
    },
  });

export default i18n; // Exports the configured i18n instance.
