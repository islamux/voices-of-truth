'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { t } = useTranslation('common');

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {t('skipToContent')}
      </a>
      <Header />
      <main
        id="content"
        className="mx-auto w-full max-w-6xl flex-grow px-4 py-8 md:px-6 md:py-12"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
