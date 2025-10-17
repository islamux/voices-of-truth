// src/components/FilterBar.tsx
"use client";

import React from 'react';
import CountryFilter from './filters/CountryFilter';
import LanguageFilter from './filters/LanguageFilter';
import CategoryFilter from './filters/CategoryFilter';
import SearchInput from './filters/SearchInput';


interface FilterBarProps {
  uniqueCountries: Array<{ value: string; label: string }>; 
  uniqueLanguages: string[]; 
  uniqueCategories: Array<{ value: string; label: string }>; 
  onCountryChange: (country: string) => void; 
  onLanguageChange: (language: string) => void; 
  onCategoryChange: (category: string) => void; 
  onSearchChange: (term: string)=>void;
}

export default function FilterBar({
  uniqueCountries,
  uniqueLanguages,
  uniqueCategories,
  onCountryChange,
  onLanguageChange,
  onCategoryChange,
  onSearchChange
}:FilterBarProps){

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
    <SearchInput onSearchChange={onSearchChange}/>
    <CountryFilter uniqueCountries={uniqueCountries} onCountryChange={onCountryChange} />
    <LanguageFilter uniqueLanguages={uniqueLanguages} onLanguageChange={onLanguageChange}/>
    <CategoryFilter uniqueCategories={uniqueCategories} onCategoryChange={onCategoryChange}/>
    </div>
  );
}

