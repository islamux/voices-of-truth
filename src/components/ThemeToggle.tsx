'use client';

import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";
import Button from './Button';

export default function ThemeToggle(){

  const {theme, toggleTheme} = useTheme();
  const {t} = useTranslation('common');

  return (
    <Button 
    onClick={toggleTheme}
    className= "hover:bg-gray-200 dark:hover:bg-gray-700"
  >
    {theme === 'light' ? t('dark') : t('light')} {t('theme')}
    </Button>
  );
}
