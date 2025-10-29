// src/app/[locale]/HomePageClient.tsx (Refactored)

'use client';

import { Scholar, Country, Specialization } from "@/types";
import ScholarList from "@/components/ScholarList";
import FilterBar from "@/components/FilterBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Import the provider we just created!
import { FilterProvider } from '@/context/FilterContext';

interface HomePageClientProps {
  scholars: Scholar[];
  countries: Country[];
  specializations:Specialization[];
  // Data is now pre-processed by the server and passed as props
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
    router.push(`${pathname}${query}`);
  };

  // No more mapping! The data is ready to be used directly in the context value.
  const filterContextValue = {
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange: (value: string) => handleFilterChange('country', value),
    onLanguageChange: (value: string) => handleFilterChange('lang', value),
    onCategoryChange: (value: string) => handleFilterChange('category', value),
    onSearchChange: (value: string) => handleFilterChange('query', value),
  };

  return (
    // Wrap the components in the provider and pass the context value.
    <FilterProvider value={filterContextValue}>
    <FilterBar /> {/* Notice: No more props are being drilled! */}
    <ScholarList scholars={scholars} countries={countries} />
    </FilterProvider>
  );
}
