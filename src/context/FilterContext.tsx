// src/context/FilterContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

// 1. Define the "shape" of the context data.
// This interface ensures type safety for our context.
export interface FilterContextType {
  uniqueCountries: Array<{ value: string; label: string }>;
  uniqueLanguages: string[];
  uniqueCategories: Array<{ value: string; label: string }>;
  onCountryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

// 2. Create the actual context.
// We initialize it with `null` because the real value will be provided by the component below.
const FilterContext = createContext<FilterContextType | null>(null);

// 3. Create a custom hook for easy access.
// This is a best practice that makes consuming the context cleaner and safer.
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    // This error is a safeguard. It will let us know if we ever try to use
    // this hook outside of a component wrapped in our provider.
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

// 4. Create the Provider component.
// This is the component that will wrap our application tree and provide the context value.
interface FilterProviderProps {
  children: ReactNode;
  value: FilterContextType;
}

// export default function FilterProvider({ children, value }: FilterProviderProps) {
export const FilterProvider = ({ children, value }: FilterProviderProps) => {
  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
