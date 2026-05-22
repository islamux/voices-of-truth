'use client';

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Header(){
  const {t} = useTranslation('header');


  return (
     <header className="p-4 bg-background shadow-md text-foreground">
    <div className="container mx-auto flex flex-wrap justify-between items-center">
    <h1 className="text-xl sm:text-2xl font-semibold">{t('headerTitle')}</h1>
    <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
    <LanguageSwitcher/>
    <ThemeToggle/>
    </div>
    </div>
    </header>
  );
}
