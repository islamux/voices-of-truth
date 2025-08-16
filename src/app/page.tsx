// src/app/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import ScholarCard from '../components/ScholarCard';
import FilterBar from '../components/FilterBar';
import { scholars as allScholarsData } from '../data/scholars';
import { Scholar } from '../types';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language; // Get language from i18n instead of props

  // State for selected country filter, default is empty (no filter).
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  // State for selected language filter, default is empty.
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  // State for scholars to be displayed after filtering, initialized with all scholars.
  const [displayedScholars, setDisplayedScholars] = useState<Scholar[]>(allScholarsData);

  // Memoized calculation of unique countries for the filter bar.
  // Depends on the current language `lang` to provide translated country names.
  const uniqueCountries = useMemo(() => {
    const countriesMap = new Map<string, string>();
    allScholarsData.forEach(scholar => {
      // Use English country name as a key to ensure uniqueness, or the first available if 'en' is missing.
      const countryKey = scholar.country['en'] || scholar.country[Object.keys(scholar.country)[0]];
      // Get the label in the current language, or fallback to English or the first available.
      const countryLabel = scholar.country[lang] || scholar.country['en'] || scholar.country[Object.keys(scholar.country)[0]];
      if (countryKey && !countriesMap.has(countryKey)) {
        countriesMap.set(countryKey, countryLabel);
      }
    });
    // Convert map to array and sort alphabetically by label.
    return Array.from(countriesMap, ([value, label]) => ({ value, label })).sort((a,b) => a.label.localeCompare(b.label));
  }, [lang]); // Recalculates if `lang` changes.

  // Memoized calculation of unique languages for the filter bar.
  const uniqueLanguages = useMemo(() => {
    const languagesSet = new Set<string>();
    allScholarsData.forEach(scholar => {
      scholar.language.forEach(individualLang => languagesSet.add(individualLang));
    });
    // Convert set to array and sort alphabetically.
    return Array.from(languagesSet).sort();
  }, []); // Calculates once as languages in data are static.

  // Effect to filter scholars when selectedCountry or selectedLanguage changes.
  useEffect(() => {
    let result = allScholarsData; // Start with all scholars.
    if (selectedCountry) {
      // Filter by country, using English name as the key for comparison.
      result = result.filter(scholar => (scholar.country['en'] || scholar.country[Object.keys(scholar.country)[0]]) === selectedCountry);
    }
    if (selectedLanguage) {
      // Filter by language.
      result = result.filter(scholar => scholar.language.includes(selectedLanguage));
    }
    setDisplayedScholars(result); // Update the list of scholars to display.
  }, [selectedCountry, selectedLanguage]); // Recalculates if filter selections change.

  return (
    <Layout>
      <FilterBar
        uniqueCountries={uniqueCountries}
        uniqueLanguages={uniqueLanguages}
        onCountryChange={setSelectedCountry}
        onLanguageChange={setSelectedLanguage}
        // currentLang prop removed as FilterBar now uses useTranslation
      />
      {displayedScholars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedScholars.map(scholar => (
            <ScholarCard key={scholar.id} scholar={scholar} currentLang={lang} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          {t('noScholarsFound')}
        </p>
      )}
    </Layout>
  );
}

export default HomePage;
