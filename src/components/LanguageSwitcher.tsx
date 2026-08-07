'use client';

import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';
import Button from './Button';
import { supportedLngs } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const current = i18n.language;

  const changeLanguage = (newLang: string) => {
    if (current === newLang) return;
    const segments = pathname.split('/');
    segments[1] = newLang;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-1 rounded-md bg-secondary/60 p-0.5 ring-1 ring-border">
      {supportedLngs.map((langCode) => {
        const active = current === langCode;
        return (
          <Button
            key={langCode}
            variant={active ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => changeLanguage(langCode)}
            aria-current={active ? 'true' : undefined}
            className="h-7 px-2 text-xs font-semibold"
            title={langCode === 'en' ? 'English' : 'العربية'}
          >
            {t(langCode)}
          </Button>
        );
      })}
    </div>
  );
}
