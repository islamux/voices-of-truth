'use client';

import { Scholar, Country, Specialization } from "@/types";
import ScholarList from "@/components/ScholarList";
import FilterBar from "@/components/FilterBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterProvider } from "@/context/FilterContext";

interface HomePageClientProps {
  scholars: Scholar[];
  countries: Country[];
  specializations: Specialization[];
  uniqueLanguages: string[];
  uniqueCountries: Array<{ value: string; label: string }>;
  uniqueCategories: Array<{ value: string; label: string }>;
}

export default function HomePageClient({ 
  scholars, 
  countries, 
  uniqueLanguages, 
  uniqueCountries, 
  uniqueCategories 
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
    router.push(`${pathname}${query}`);
  };

  const filterContextValue = {
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange: (value: string) => handleFilterChange('country', value),
    onLanguageChange: (value: string) => handleFilterChange('language', value),
    onCategoryChange: (value: string) => handleFilterChange('category', value),
    onSearchChange: (value: string) => handleFilterChange('search', value),
  };

  return (
    <FilterProvider value={filterContextValue}>
      <FilterBar />
      <ScholarList scholars={scholars} countries={countries} />
    </FilterProvider>
  );
}