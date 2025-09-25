'use client'

import React from "react"
import { useTranslation } from "react-i18next"
import FilterDropdown from "./FilterDropdown"

interface CategoryFilterProps{
  uniqueCategories: Array<{value: string, label: string}>
    onCategoryChangee: (category: string)=> void;
}


const CategoryFilter: React.FC<CategoryFilterProps> = ({uniqueCategories, onCategoryChangee})=> {

  const { t } = useTranslation('common');

  return (
    <FilterDropdown 
    label={t('filterByCategory')}
    filterKey="category"
    options={uniqueCategories}
    onChange={onCategoryChangee}
    />
  );
};
export default CategoryFilter;
