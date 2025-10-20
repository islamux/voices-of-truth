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
  specializations: Specialization[];
  uniqueLanguages: string[];
}

export default function HomePageClient({ scholars, countries, specializations, uniqueLanguages }: HomePageClientProps) {
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

  const uniqueCountries = countries.map(c => ({ value: c.id.toString(), label: c.en }));
  const uniqueCategories = specializations.map(s => ({ value: s.id.toString(), label: s.en }));

  // Create a single object containing all the state and functions.
  // This will be the value of our context.
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
    // Now, FilterBar and any of its children can access this value.
    <FilterProvider value={filterContextValue}>
      <FilterBar /> {/* Notice: No more props are being drilled! */}
      <ScholarList scholars={scholars} countries={countries} />
    </FilterProvider>
  );
}