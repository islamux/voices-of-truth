'use client'

import { useTranslation } from "react-i18next";
import FilterDropdown from "./FilterDropdown";

import { useFilters } from "@/context/FilterContext";

export default function CountryFilter(){
  const { t } = useTranslation('common');
  const { uniqueCountries, onCountryChange } = useFilters();


  return (
    <FilterDropdown 
    label={t('filterByCountry')}
    filterKey="country"
    options={uniqueCountries}
    onChange={onCountryChange}
    />
  );
  };
