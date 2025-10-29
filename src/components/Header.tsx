'use client';

import { useTranslation } from "react-i18next";
import LanguageSwicher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Header(){
  const {t} = useTranslation('header');


  return (
    <header className="p-4 bg-gray-100 dark:bg-gray-800 shadow-md text-gray-900 dark:text-white">
    <div className="container mx-auto flex flex-wrap justify-between items-center">
    <h1 className="text-xl sm:text-2xl font-semibold">{t('headerTitle')}</h1>
    <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
    <LanguageSwicher/>
    <ThemeToggle/>
    </div>
    </div>
    </header>
  );
}
