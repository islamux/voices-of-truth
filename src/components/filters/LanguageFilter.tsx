'use client';

import React, {useMemo} from "react";
import { useTranslation } from "react-i18next";
import FilterDropdown from "./FilterDropdown";

interface LanguageFilterProps{
  uniqueLanguages: string[];
  onLanguageChange: (language: string)=> void;
}

const LanguageFilter: React.FC<LanguageFilterProps> = ({uniqueLanguages, onLanguageChange})=>{

  const { t } = useTranslation('common');
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

export default LanguageFilter;
