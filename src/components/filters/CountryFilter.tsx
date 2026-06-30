import { useFilters } from '@/context/FilterContext';
import { useTranslation } from "react-i18next";
import FilterDropdown from "./FilterDropdown";

export default function CountryFilter() {
  const { uniqueCountries, onCountryChange, currentFilters } = useFilters();
  const { t } = useTranslation('common');

  return (
    <FilterDropdown
      label={t('filterByCountry')}
      filterKey="country"
      options={uniqueCountries}
      value={currentFilters.country}
      onChange={onCountryChange}
    />
  );
}