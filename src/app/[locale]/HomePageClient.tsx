// src/app/[locale]/HomePageClient.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/Layout';
import ScholarCard from '../../components/ScholarCard';
import FilterBar from '../../components/FilterBar';
import { scholars as allScholarsData } from '../../data/scholars';
import { Scholar } from '../../types';
import { useTranslation } from 'react-i18next';

const HomePageClient = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;

  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [displayedScholars, setDisplayedScholars] = useState<Scholar[]>(allScholarsData);

  const uniqueCountries = useMemo(() => {
    const countriesMap = new Map<string, string>();
    allScholarsData.forEach(scholar => {
      const countryKey = scholar.country['en'] || scholar.country[Object.keys(scholar.country)[0]];
      const countryLabel = scholar.country[lang] || scholar.country['en'] || scholar.country[Object.keys(scholar.country)[0]];
      if (countryKey && !countriesMap.has(countryKey)) {
        countriesMap.set(countryKey, countryLabel);
      }
    });
    return Array.from(countriesMap, ([value, label]) => ({ value, label })).sort((a,b) => a.label.localeCompare(b.label));
  }, [lang]);

  const uniqueLanguages = useMemo(() => {
    const languagesSet = new Set<string>();
    allScholarsData.forEach(scholar => {
      scholar.language.forEach(individualLang => languagesSet.add(individualLang));
    });
    return Array.from(languagesSet).sort();
  }, []);

  const uniqueCategories = useMemo(() => {
    const categoriesMap = new Map<string, string>();
    allScholarsData.forEach(scholar => {
      const categoryKey = scholar.category['en'] || scholar.category[Object.keys(scholar.category)[0]];
      const categoryLabel = scholar.category[lang] || scholar.category['en'] || scholar.category[Object.keys(scholar.category)[0]];
      if (categoryKey && !categoriesMap.has(categoryKey)) {
        categoriesMap.set(categoryKey, categoryLabel);
      }
    });
    return Array.from(categoriesMap, ([value, label]) => ({ value, label })).sort((a,b) => a.label.localeCompare(b.label));
  }, [lang]);

  useEffect(() => {
    let result = allScholarsData;
    if (selectedCountry) {
      result = result.filter(scholar => (scholar.country['en'] || scholar.country[Object.keys(scholar.country)[0]]) === selectedCountry);
    }
    if (selectedLanguage) {
      result = result.filter(scholar => scholar.language.includes(selectedLanguage));
    }
    if (selectedCategory) {
      result = result.filter(scholar => 
        (scholar.category['en'] || scholar.category[Object.keys(scholar.category)[0]]) === selectedCategory
      );
    }
    setDisplayedScholars(result);
  }, [selectedCountry, selectedLanguage, selectedCategory]);

  return (
    <Layout>
      <FilterBar
        uniqueCountries={uniqueCountries}
        uniqueLanguages={uniqueLanguages}
        uniqueCategories={uniqueCategories}
        onCountryChange={setSelectedCountry}
        onLanguageChange={setSelectedLanguage}
        onCategoryChange={setSelectedCategory}
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

export default HomePageClient;