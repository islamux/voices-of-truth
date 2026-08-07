'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from '@/lib/theme';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import { useHasMounted } from '@/hooks/useHasMounted';

function subscribeDark(cb: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getDarkSnapshot() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getDarkServerSnapshot() {
  return false;
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('common');
  const mounted = useHasMounted();
  const systemDark = useSyncExternalStore(
    subscribeDark,
    getDarkSnapshot,
    getDarkServerSnapshot,
  );

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled aria-hidden="true">
        <span className="h-[18px] w-[18px]" />
      </Button>
    );
  }

  const resolved: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
  const toggle = () => setTheme(resolved === 'light' ? 'dark' : 'light');

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={t('toggleTheme')}
      title={`${t(resolved)} ${t('theme')}`}
    >
      {resolved === 'light' ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
