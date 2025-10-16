import React from "react";
import { useTranslation } from "react-i18next";

interface  FilterDropdownProps{
  label: string;
  filterKey: string;
  options: Array<{value: string, label: string}>;
  onChange: (value: string) => void;
}

export default function FilterDropdown({label, filterKey, options, onChange}:FilterDropdownProps){
  // const FilterDropdown : React.FC<FilterDropdownProps> = ({label, filterKey, options, onChange}) => {

  const {t} = useTranslation('common');

  return(
    <div  className="w-full sm:w-auto">
    <label htmlFor={`${filterKey}-filter`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    {label}
    </label>

    <select 
    id={`${filterKey}-filter`}
    onChange={ (e)=> onChange(e.target.value) }
    className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
  >
    <option value="">
    {t('all')}
    </option>
    {options.map( (option, index)=>(
      <option key={`${option.value}-${index}`} value={option.value}>
      {option.label}
      </option>
    ))}
    </select>
    </div>
  );  
  };
