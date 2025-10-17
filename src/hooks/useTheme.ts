'use client';

import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@/components/ThemeProvider';

// The hook explicitly declares that it returns a ThemeContextType
export default function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
