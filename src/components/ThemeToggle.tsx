'use client';

import { useTheme } from 'next-themes';
import { useTranslation } from "react-i18next";
import Button from './Button';
import { useHasMounted } from '@/hooks/useHasMounted';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('common');
  const mounted = useHasMounted();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <Button
      disabled
      className="hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {t('theme')}
      </Button>
    );
  }

  return (
    <Button
    onClick={toggleTheme}
    className="hover:bg-gray-200 dark:hover:bg-gray-700"
  >
    {theme === 'light' ? t('dark') : t('light')} {t('theme')}
    </Button>
  );
}
