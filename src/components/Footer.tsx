'use client';

import { useTranslation } from "react-i18next";

export default function Footer(){
  const { t } = useTranslation('common');

  return (
    <footer className="p-4 bg-gray-100 dark:bg-gray-800 shadow-md text-gray-900 dark:text-white">
    <div className="container mx-auto text-center">
    <p>{t('footerText')}</p>
    </div>
    </footer>
  );
}
