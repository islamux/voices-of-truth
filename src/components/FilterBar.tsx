// src/components/FilterBar.tsx
"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';

interface FilterBarProps {
  uniqueCountries: Array<{ value: string; label: string }>; // Array of unique countries for the filter dropdown.
                                                          // Each object has a 'value' (e.g., country code) and 'label' (display name).
  uniqueLanguages: string[]; // Array of unique languages for the filter dropdown.
  onCountryChange: (country: string) => void; // Callback function when the selected country changes.
  onLanguageChange: (language: string) => void; // Callback function when the selected language changes.
}

const FilterBar: React.FC<FilterBarProps> = ({
  uniqueCountries,
  uniqueLanguages,
  onCountryChange,
  onLanguageChange,
}) => {
  const { t } = useTranslation('common'); // Hook for translations.

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div className="w-full sm:w-auto">
        <label htmlFor="country-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('filterByCountry')}
        </label>
        <select
          id="country-filter"
          onChange={(e) => onCountryChange(e.target.value)}
          className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
        >
          <option value="">{t('all')}</option>
          {uniqueCountries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="language-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('filterByLanguage')}
        </label>
        <select
          id="language-filter"
          onChange={(e) => onLanguageChange(e.target.value)}
          className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
        >
          <option value="">{t('all')}</option>
          {uniqueLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
