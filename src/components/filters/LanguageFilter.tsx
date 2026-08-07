'use client';

import React, {useMemo} from "react";
import { useTranslation } from "react-i18next";
import FilterDropdown from "./FilterDropdown";

import { useFilters } from "@/context/FilterContext";
import { languageLabel } from "@/lib/languages";

export default function LanguageFilter(){

  const { t, i18n } = useTranslation('common');
  const { uniqueLanguages, onLanguageChange, currentFilters } = useFilters();
  const locale = i18n.language;

  const languageOptions =  useMemo( ()=>
    uniqueLanguages.map( lang => ({value: lang, label: languageLabel(lang, locale)})),
    [uniqueLanguages, locale]
  );


  return (
    <FilterDropdown
    label={t('filterByLanguage')}
    filterKey="language"
    options={languageOptions}
    value={currentFilters.lang}
    onChange={onLanguageChange}
    />
  );
};

