'use client';

import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from 'next/navigation';
import Button from "./Button";
import { supportedLngs } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = i18n.language;

  const changeLanguage = (newLang: string) => {
    if (currentLang === newLang) return;
    const segments = pathname.split('/');
    segments[1] = newLang;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1">
    {supportedLngs.map((langCode) => (
      <Button
      key={langCode}
      onClick={() => changeLanguage(langCode)}
      disabled={currentLang === langCode}
      className="enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700"
    >
      {t(langCode)}
      </Button>
    ))}
    </div>
  );
}
