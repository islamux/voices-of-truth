// next-i18next.config.ts
import path from 'path';

const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
  },
  localePath: typeof window === 'undefined' 
    ? path.resolve('./public/locales') 
    : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

export default config;
