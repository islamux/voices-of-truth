// src/components/Layout.tsx
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode; // Prop to render child components within the layout.
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation('common'); // Hook for translations.
    const router = useRouter();
  const pathname = usePathname(); // Next.js hook for accessing the current path.
    const currentLang = i18n.language; // Currently active language.

    // State for managing the current theme (light/dark). Default is 'light'.
    const [theme, setTheme] = useState('light');

  // Effect to initialize theme from localStorage or system preference.
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

    // Toggles the theme between 'light' and 'dark'.
    // Updates localStorage and the class on the <html> element.
    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark');
    };

  // Changes the application language.
  // Replaces the current language slug in the path and navigates to the new path.
  const changeLanguage = (newLang: string) => {
    if (currentLang === newLang) return; // Avoid unnecessary change
    if (pathname) {
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      router.push(newPath);
    } else {
      // Fallback if pathname is somehow not available
      router.push(`/${newLang}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-transparent to-[rgb(var(--background-end-rgb))] bg-[rgb(var(--background-start-rgb))]">
    <header className="p-4 bg-gray-100 dark:bg-gray-800 shadow-md text-gray-900 dark:text-white">
    <div className="container mx-auto flex flex-wrap justify-between items-center">
    <h1 className="text-xl sm:text-2xl font-semibold">{t('headerTitle')}</h1>
    <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
    <div className="flex items-center space-x-1">
    <button 
    onClick={() => changeLanguage('en')} 
    disabled={currentLang === 'en'} 
    className="px-3 py-1.5 text-sm rounded-md disabled:opacity-60 enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700 disabled:cursor-not-allowed"
  >
    {t('english')}
    </button>
    <button 
    onClick={() => changeLanguage('ar')} 
    disabled={currentLang === 'ar'} 
    className="px-3 py-1.5 text-sm rounded-md disabled:opacity-60 enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700 disabled:cursor-not-allowed"
  >
    {t('arabic')}
    </button>
    </div>
    <button 
    onClick={toggleTheme} 
    className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
  >
    {theme === 'light' ? t('dark') : t('light')} {t('theme')}
    </button>
    </div>
    </div>
    </header>
    <main className="flex-grow container mx-auto p-4 md:p-6">
    {children}
    </main>
    <footer className="p-4 bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-700 dark:text-gray-300">
    <p>{t('footerText')}</p>
    </footer>
    </div>
  );
};

export default Layout;
