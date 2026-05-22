'use client';

import { Scholar, Country } from "@/types";
import ScholarList from "@/components/ScholarList";
import FilterBar from "@/components/FilterBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterProvider } from '@/context/FilterContext';

interface HomePageClientProps {
  scholars: Scholar[];
  countries: Country[];
  uniqueCountries: { value: string; label: string }[];
  uniqueCategories: { value: string; label: string }[];
  uniqueLanguages: string[];
}

export default function HomePageClient({
  scholars,
  countries,
  uniqueCountries,
  uniqueCategories,
  uniqueLanguages
}: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.replace(`${pathname}${query}`);
  };

  const currentQuery = searchParams.get('query') || '';
  const currentCountry = searchParams.get('country') || '';
  const currentLang = searchParams.get('lang') || '';
  const currentCategory = searchParams.get('category') || '';

  const filterContextValue = {
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    currentFilters: {
      query: currentQuery,
      country: currentCountry,
      lang: currentLang,
      category: currentCategory,
    },
    onCountryChange: (value: string) => handleFilterChange('country', value),
    onLanguageChange: (value: string) => handleFilterChange('lang', value),
    onCategoryChange: (value: string) => handleFilterChange('category', value),
    onSearchChange: (value: string) => handleFilterChange('query', value),
  };

  return (
    <FilterProvider value={filterContextValue}>
      <FilterBar />
      <ScholarList scholars={scholars} countries={countries} />
    </FilterProvider>
  );
}
