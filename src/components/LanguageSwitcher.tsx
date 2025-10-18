// src/components/LanguageSwitcher.tsx (Refactored)
'use client';

import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from 'next/navigation';
import Button from "./Button";
import { supportedLngs } from "@/lib/i18n"; // 1. Import our source of truth for language codes

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = i18n.language;

  const changeLanguage = (newLang: string) => {
    if (currentLang === newLang) return;
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Map over the supported language CODES */}
      {supportedLngs.map((langCode) => (
        <Button
          key={langCode}
          onClick={() => changeLanguage(langCode)}
          disabled={currentLang === langCode}
          className="enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700"
        >
          {/* Use the language code directly to get the translation */}
          {t(langCode)}
        </Button>
      ))}
    </div>
  );
}
