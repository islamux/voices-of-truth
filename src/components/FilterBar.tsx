'use client';

import CountryFilter from './filters/CountryFilter';
import LanguageFilter from './filters/LanguageFilter';
import CategoryFilter from './filters/CategoryFilter';
import SearchInput from './filters/SearchInput';
import Button from './Button';
import { useFilters } from '@/context/FilterContext';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function FilterBar() {
  const { currentFilters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation('common');

  const hasActive = Object.values(currentFilters).some(
    (v) => v && v.length > 0,
  );

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="sm:min-w-[220px] sm:flex-1">
          <SearchInput />
        </div>
        <CountryFilter />
        <LanguageFilter />
        <CategoryFilter />
        {hasActive && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => router.replace(pathname)}
            className="h-10 shrink-0 text-muted-foreground hover:text-foreground"
          >
            {t('resetFilters')}
          </Button>
        )}
      </div>
    </div>
  );
}
