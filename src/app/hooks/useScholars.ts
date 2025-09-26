import { scholars } from "@/data/scholars";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";


export const useScholars = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // State to hold the user's filter selections
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize the filtered scholars so it only recalculates  when data or filters change
  const filteredScholars = useMemo( ()=>{
    return scholars.filter( (scholar)=>{

      // if a filter is set, check if the scholar matches
      const countryMatch = !selectedCountry || (scholar.country[currentLang] || scholar.country['en']) === selectedCountry;
      const languageMatch = !selectedLanguage || scholar.language.includes(selectedLanguage);
      const categoryMatch =!selectedCategory || (scholar.category[currentLang] || scholar.category['en']) === selectedCategory;
      const searchMatch = !searchTerm || (scholar.name[currentLang] || scholar.name['en']).toLowerCase().includes(searchTerm.toLowerCase());
      console.log(`Search Term: ${searchTerm}, Scholar Name: ${scholar.name}, Search Match: ${searchMatch}`);

      return countryMatch && languageMatch && categoryMatch && searchMatch;
    });

  },[selectedCountry, selectedLanguage, selectedCategory, currentLang, searchTerm]);

  // ---- Data for  FilterBar Dropdowns ----
  // Memoize unique countries to prevent recalculation on every render
  const uniqueCountries = useMemo( ()=> {
    const countries = new Set(scholars.map(s => s.country[currentLang] || s.country['en']));
    return Array.from(countries).map(c => ({value: c, label: c}));
  },[currentLang]);

  // Memoize unique languages
  const uniqueLanguages = useMemo( ()=> {
    const languages= new Set(scholars.flatMap( s=> s.language));
    return Array.from(languages);
  },[]); 

  // Memoize unique categories (specializations)
  const uniqueCategories = useMemo( ()=> {
    const categories = new Set(scholars.map(s => s.category[currentLang] || s.category['en']));
    return Array.from(categories).map( c => ({value: c, label: c}));
  } ,[currentLang]);


  return{
    filteredScholars,
    // Filter values and handlers
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    searchTerm,
    onCountryChange: setSelectedCountry,
    onLanguageChange: setSelectedLanguage,
    onCategoryChange: setSelectedCategory,
    onSearchChange: setSearchTerm
  };
};               
