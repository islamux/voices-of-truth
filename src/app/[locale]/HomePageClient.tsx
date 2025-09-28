// src/app/[locale]/HomePageClient.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
import { Scholar } from "@/types";

interface HomePageClientProps {
  scholars: Scholar[];
  uniqueCountries: Array<{ value: string; label: string }>;
  uniqueLanguages: string[];
  uniqueCategories: Array<{ value: string; label: string }>;
}

const HomePageClient = ({
  scholars,
  uniqueCountries,
  uniqueLanguages,
  uniqueCategories,
}: HomePageClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL search parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [lang, setLang] = useState(searchParams.get('lang') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  // Effect to update URL when filter states change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (searchQuery) newSearchParams.set('query', searchQuery);
    if (country) newSearchParams.set('country', country);
    if (lang) newSearchParams.set('lang', lang);
    if (category) newSearchParams.set('category', category);

    router.push(`?${newSearchParams.toString()}`);
  }, [searchQuery, country, lang, category, router]);

  const handleSearchChange = (term: string) => setSearchQuery(term);
  const handleCountryChange = (selectedCountry: string) => setCountry(selectedCountry);
  const handleLanguageChange = (selectedLang: string) => setLang(selectedLang);
  const handleCategoryChange = (selectedCategory: string) => setCategory(selectedCategory);

  return (
    <div className="container max-auto px-4 py-8">
      <h1 className='text-4xl font-bold text-center mb-8'>Voices of Truth</h1>

      <FilterBar
        uniqueCountries={uniqueCountries}
        uniqueCategories={uniqueCategories}
        uniqueLanguages={uniqueLanguages}
        onSearchChange={handleSearchChange}
        onCountryChange={handleCountryChange}
        onLanguageChange={handleLanguageChange}
        onCategoryChange={handleCategoryChange}
      />

      <ScholarList scholars={scholars} />
    </div>
  );
};

export default HomePageClient;
