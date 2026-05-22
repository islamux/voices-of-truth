"use client";

import CountryFilter from './filters/CountryFilter';
import LanguageFilter from './filters/LanguageFilter';
import CategoryFilter from './filters/CategoryFilter';
import SearchInput from './filters/SearchInput';

export default function FilterBar() {
  return (
     <div className="p-4 bg-card rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <SearchInput />
      <CountryFilter />
      <LanguageFilter />
      <CategoryFilter />
    </div>
  );
}
