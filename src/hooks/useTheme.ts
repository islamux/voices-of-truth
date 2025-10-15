'use client';
import { useEffect, useState } from "react";


export function useTheme(){
  const [theme, setTheme] = useState('light');

  useEffect( ()=> {
    const storedTheme = localStorage.getItem('them');
    const systemPreferDark = window.matchMedia( '(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || ( systemPreferDark ? 'dark' : 'light' ); 
    setTheme(initialTheme);

    if(initialTheme === 'dark'){
      document.documentElement.classList.add('dark');
    }
  },[]);

  const toggleTheme = ()=> {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };
  return {theme, toggleTheme};

};

