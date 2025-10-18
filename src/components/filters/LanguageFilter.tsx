'use client';

import React, {useMemo} from "react";
import { useTranslation } from "react-i18next";
import FilterDropdown from "./FilterDropdown";

import { useFilters } from "@/context/FilterContext";

export default function LanguageFilter(){

  const { t } = useTranslation('common');
  const { uniqueLanguages, onLanguageChange } = useFilters();
  const languageOptions =  useMemo( ()=>
    uniqueLanguages.map( lang => ({value: lang, label: lang})),
    [uniqueLanguages]
  );


  return (
    <FilterDropdown 
    label={t('filterByLanguage')}
    filterKey="language"
    options={languageOptions}
    onChange={onLanguageChange}
    />
  );
};

