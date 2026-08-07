'use client';

import { useTranslation } from 'react-i18next';
import FilterDropdown from './FilterDropdown';
import { useFilters } from '@/context/FilterContext';

export default function CategoryFilter() {
  const { t } = useTranslation('common');
  const { uniqueCategories, onCategoryChange, currentFilters } = useFilters();

  return (
    <FilterDropdown
      label={t('filterByCategory')}
      filterKey="category"
      options={uniqueCategories}
      value={currentFilters.category}
      onChange={onCategoryChange}
    />
  );
}
