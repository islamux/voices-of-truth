'use client';

import { useTranslation } from "react-i18next";

export default function Footer(){
  const { t } = useTranslation('common');

  return (
     <footer className="p-4 bg-background shadow-md text-foreground">
    <div className="container mx-auto text-center">
    <p>{t('footerText')}</p>
    </div>
    </footer>
  );
}
