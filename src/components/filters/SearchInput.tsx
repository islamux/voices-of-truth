'use client'

import React from "react";
import { useTranslation } from "react-i18next"

interface SearchInputProps{
  onSearchChange :(term: string)=>void;
}


const SearchInput: React.FC<SearchInputProps> = ({onSearchChange}) => {

  const {t} = useTranslation('common');

  return (
    <input
    type="text"
    placeholder={t('searchByName')}
    onChange={(e)=> onSearchChange(e.target.value)}
    className="p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:right-2 focus:ring-blue-500"
  >
    </input>
  );
};

export default SearchInput;
