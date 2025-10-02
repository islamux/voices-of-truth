// src/app/[locale]/HomePageClient.tsx
"use client";

import { usePathname,useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
import { Country, Scholar } from "@/types";


interface HomePageClientProps {
  scholars: Scholar[];
  uniqueCountries: { value: string; label: string }[];
  uniqueCategories: { value: string; label: string }[];
  uniqueLanguages: string[];
  countries: Country[];
}

const HomePageClient: React.FC<HomePageClientProps> = ({
  scholars,
  uniqueCountries,
  uniqueCategories,
  uniqueLanguages,
  countries
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleFilterChange = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="space-y-8">
    <FilterBar
    uniqueCountries={uniqueCountries}
    uniqueCategories={uniqueCategories}
    uniqueLanguages={uniqueLanguages}
    onCountryChange={(country) => handleFilterChange("country", country)}
    onLanguageChange={(language) => handleFilterChange("lang", language)}
    onCategoryChange={(category) => handleFilterChange("category", category)}
    onSearchChange={(term) => handleFilterChange("query", term)}
    />
    <ScholarList scholars={scholars} countries={countries} />
    </div>
  );

};
export default HomePageClient;
