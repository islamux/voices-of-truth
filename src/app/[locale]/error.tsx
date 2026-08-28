'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const { t } = useTranslation('common');

  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h2 className="font-display text-2xl font-bold text-foreground">
        {t('errorTitle')}
      </h2>
      <p className="max-w-md text-muted-foreground">{t('errorDescription')}</p>
      <Button variant="primary" size="md" onClick={reset}>
        {t('tryAgain')}
      </Button>
    </div>
  );
}
