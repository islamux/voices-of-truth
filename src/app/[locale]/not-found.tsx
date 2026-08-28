'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import WaveformMark from '@/components/WaveformMark';

export default function NotFound() {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language;

  return (
    <div className="flex flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <WaveformMark className="h-10 w-10 text-accent" />
      <p className="font-display text-7xl font-bold text-foreground">
        404
      </p>
      <h2 className="font-display text-xl font-bold text-foreground">
        {t('notFoundTitle')}
      </h2>
      <p className="max-w-md text-muted-foreground">{t('notFoundDescription')}</p>
      <Link
        href={`/${locale}`}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {t('goHome')}
      </Link>
    </div>
  );
}
