'use client'

import React from "react"
import { useTranslation } from "react-i18next"
import FilterDropdown from "./FilterDropdown"

import { useFilters } from "@/context/FilterContext";



export default function CategoryFilter(){


  const { t } = useTranslation('scholar');

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
};
