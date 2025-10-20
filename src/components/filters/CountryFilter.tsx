// src/components/filters/CountryFilter.tsx (Refactored)

import { useFilters } from '@/context/FilterContext'; // Import our custom hook
import { useTranslation } from "react-i18next";
import FilterDropdown from "./FilterDropdown";

export default function CountryFilter() {
  // Call the hook to get the data and functions directly from the context.
  const { uniqueCountries, onCountryChange } = useFilters();
  const { t } = useTranslation('common');

  return (
    <FilterDropdown
      label={t('filterByCountry')}
      filterKey="country"
      options={uniqueCountries} // Use the data from context
      onChange={onCountryChange}  // Use the function from context
    />
  );
}