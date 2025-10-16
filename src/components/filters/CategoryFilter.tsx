'use client'

import React from "react"
import { useTranslation } from "react-i18next"
import FilterDropdown from "./FilterDropdown"

interface CategoryFilterProps{
  uniqueCategories: Array<{value: string, label: string}>
    onCategoryChange: (category: string)=> void;
}

export default function CategoryFilter({uniqueCategories, onCategoryChange}:CategoryFilterProps){
  // const CategoryFilter: React.FC<CategoryFilterProps> = ({uniqueCategories, onCategoryChange})=> {

  const { t } = useTranslation('common');

  return (
    <FilterDropdown 
    label={t('filterByCategory')}
    filterKey="category"
    options={uniqueCategories}
    onChange={onCategoryChange}
    />
  );
  };
