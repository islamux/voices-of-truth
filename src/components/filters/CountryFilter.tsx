'use client'

import { useTranslation } from "react-i18next";
import FilterDropdown from "./FilterDropdown";

interface CountryFilterProps{
  uniqueCountries :Array<{value: string, label: string}>;
  onCountryChange: (country: string) => void;
}

const CountryFilter : React.FC<CountryFilterProps> = ({uniqueCountries, onCountryChange}) => {
  const { t } = useTranslation('common');


  return (
    <FilterDropdown 
    label={t('filterByCountry')}
    filterKey="country"
    options={uniqueCountries}
    onChange={onCountryChange}
    />
  );
};
export default CountryFilter;
