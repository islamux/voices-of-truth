'use client'

import React from "react";
import { useTranslation } from "react-i18next"

import { useFilters } from "@/context/FilterContext";

export default function SearchInput(){

  const {t} = useTranslation('common');
  const { onSearchChange } = useFilters();

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

