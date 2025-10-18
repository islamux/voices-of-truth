'use client';

import { createContext, useContext, ReactNode } from 'react';

// Define the shape of the data using the new '...Type' convention
export interface FilterContextType {
  uniqueCountries: Array<{ value: string; label: string }>;
  uniqueLanguages: string[];
  uniqueCategories: Array<{ value: string; label: string }>;
  onCountryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

// Create the context
const FilterContext = createContext<FilterContextType | null>(null);

// Custom hook to easily consume the context
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

// Define the props for the provider component
interface FilterProviderProps {
  children: ReactNode;
  value: FilterContextType;
}

// The Provider component that will wrap our app
export const FilterProvider = ({ children, value }: FilterProviderProps) => {
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};