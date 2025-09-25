// src/app/[locale]/HomePageClient.tsx
"use client";

import { useScholars } from "../hooks/useScholars";
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";

const HomePageClient = () => {

  // All the complex logic is now inside our custom hook!
  const {
    filteredScholars,
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange,
    onLanguageChange,
    onCategoryChange
  } = useScholars();

  return (
    <div className="container max-auto px-4 py-8">
    <h1 className='text-4xl font-bold text-center mb-8'>Voices of Truth</h1>

    {/* Pass all the required props to FilterBar*/}
    <FilterBar 
    uniqueCountries={uniqueCountries}
    uniqueLanguages={uniqueLanguages}
    uniqueCategories={uniqueCategories}
    onCountryChange={onCountryChange}
    onLanguageChange={onLanguageChange}
    onCategoryChange={onCategoryChange} 
    />

    <ScholarList scholars={filteredScholars} />
    </div>
  ) ;
};

export default HomePageClient;