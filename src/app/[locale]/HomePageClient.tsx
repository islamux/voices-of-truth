'use client';

import { useCallback } from 'react';
import { Scholar, Country } from '@/types';
import ScholarList from '@/components/ScholarList';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import WaveformMark from '@/components/WaveformMark';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FilterProvider } from '@/context/FilterContext';
import { useTranslation } from 'react-i18next';

interface HomePageClientProps {
  scholars: Scholar[];
  countries: Country[];
  uniqueCountries: { value: string; label: string }[];
  uniqueCategories: { value: string; label: string }[];
  uniqueLanguages: string[];
  currentPage: number;
  totalPages: number;
}

export default function HomePageClient({
  scholars,
  countries,
  uniqueCountries,
  uniqueCategories,
  uniqueLanguages,
  currentPage,
  totalPages,
}: HomePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation('common');

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (!value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
      if (key !== "page") {
        current.delete("page");
      }
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.replace(`${pathname}${query}`);
    },
    [pathname, router, searchParams],
  );

  const onSearchChange = useCallback(
    (value: string) => handleFilterChange('query', value),
    [handleFilterChange],
  );

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
    onSearchChange,
  };

  return (
    <FilterProvider value={filterContextValue}>
      <section className="mb-10 max-w-2xl">
        <div className="mb-4 flex items-center gap-2 text-accent">
          <WaveformMark className="h-5 w-5" />
          <span className="text-eyebrow">{t('appTitle')}</span>
        </div>
        <h1 className="text-display text-foreground">{t('headerTagline')}</h1>
      </section>

      <FilterBar />
      <ScholarList scholars={scholars} countries={countries} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </FilterProvider>
  );
}
