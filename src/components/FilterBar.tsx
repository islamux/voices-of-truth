// src/components/FilterBar.tsx
"use client";

import React from 'react';
import CountryFilter from './filters/CountryFilter';
import LanguageFilter from './filters/LanguageFilter';
import CategoryFilter from './filters/CategoryFilter';
import SearchInput from './filters/SearchInput';


interface FilterBarProps {
  uniqueCountries: Array<{ value: string; label: string }>; // Array of unique countries for the filter dropdown.
    uniqueLanguages: string[]; // Array of unique languages for the filter dropdown.
    uniqueCategories: Array<{ value: string; label: string }>; // Array of unique categories for the filter dropdown.
    onCountryChange: (country: string) => void; // Callback function when the selected country changes.
    onLanguageChange: (language: string) => void; // Callback function when the selected language changes.
    onCategoryChange: (category: string) => void; // Callback function when the selected category changes.
    onSearchChange: (term: string)=>void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  uniqueCountries,
  uniqueLanguages,
  uniqueCategories,
  onCountryChange,
  onLanguageChange,
  onCategoryChange,
  onSearchChange
}) => {

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
    <SearchInput onSearchChange={onSearchChange}/>
    <CountryFilter uniqueCountries={uniqueCountries} onCountryChange={onCountryChange} />
    <LanguageFilter uniqueLanguages={uniqueLanguages} onLanguageChange={onLanguageChange}/>
    <CategoryFilter uniqueCategories={uniqueCategories} onCategoryChange={onCategoryChange}/>
    </div>
  );
};

export default FilterBar;
