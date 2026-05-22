'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface FilterContextType {
  uniqueCountries: Array<{ value: string; label: string }>;
  uniqueLanguages: string[];
  uniqueCategories: Array<{ value: string; label: string }>;
  currentFilters: {
    query: string;
    country: string;
    lang: string;
    category: string;
  };
  onCountryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
  value: FilterContextType;
}

export const FilterProvider = ({ children, value }: FilterProviderProps) => {
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
