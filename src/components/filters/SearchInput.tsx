'use client'

import React from "react";
import { useTranslation } from "react-i18next"

import { useFilters } from "@/context/FilterContext";

export default function SearchInput(){

  const {t} = useTranslation('common');
  const { onSearchChange, currentFilters } = useFilters();

  return (
    <input
    type="text"
    placeholder={t('searchPlaceholder')}
    value={currentFilters.query}
    onChange={(e)=> onSearchChange(e.target.value)}
     className="p-2 border rounded-md bg-background border-border focus:outline-none focus:ring-2 focus:ring-ring"
  >
    </input>
  );
};

