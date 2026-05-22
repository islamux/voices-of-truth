import React from "react";
import { useTranslation } from "react-i18next";

interface  FilterDropdownProps{
  label: string;
  filterKey: string;
  options: Array<{value: string, label: string}>;
  value: string;
  onChange: (value: string) => void;
}

export default function FilterDropdown({label, filterKey, options, value, onChange}:FilterDropdownProps){

  const {t} = useTranslation('common');

  // Render the dropdown filterKey
  
  return(
    <div  className="w-full sm:w-auto">
     <label htmlFor={`${filterKey}-filter`} className="block text-sm font-medium text-muted-foreground mb-1">
    {label}
    </label>

    <select 
    id={`${filterKey}-filter`}
    value={value}
    onChange={ (e)=> onChange(e.target.value) }
     className="p-2.5 border border-border rounded-md bg-background text-foreground w-full focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
  >
    <option value="">
    {t('all')}
    </option>
    {options.map( (option)=>(
      <option key={option.value} value={option.value}>
      {option.label}
      </option>
    ))}
    </select>
    </div>
  );  
};
