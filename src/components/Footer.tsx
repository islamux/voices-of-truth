'use client';

import { useTranslation } from 'react-i18next';
import WaveformMark from './WaveformMark';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center md:flex-row md:justify-between md:text-start md:px-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <WaveformMark className="h-4 w-4 text-accent" />
          <span className="text-sm">{t('footerNote')}</span>
        </div>
        <p className="text-sm text-muted-foreground">{t('footerText')}</p>
      </div>
    </footer>
  );
}
