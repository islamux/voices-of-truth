import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { scholars } from "@/data/scholars";
import { countries } from "@/data/countries";
import { specializations } from "@/data/specializations";


export const useScholars = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // 1- State to hold the user's filter selections
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // const [searchTerm, setSearchTerm] = useState('');

  // 2- Memoize the logic to filter scholars when selections change 
  const filteredScholars = useMemo(() => {
    return scholars
      .map((scholar) => {
        const country = countries.find((c) => c.id === scholar.countryId);
        const category = specializations.find(
          (s) => s.id === scholar.categoryId
        );

        return {
          ...scholar,
          country: country
            ? { en: country.en, ar: country.ar }
            : { en: "", ar: "" },
          category: category
            ? { en: category.en, ar: category.ar }
            : { en: "", ar: "" },
        };
      })
      .filter((scholar) => {
        const countryMatch =
          !selectedCountry || scholar.country.en === selectedCountry;
        const languageMatch =
          !selectedLanguage || scholar.language.includes(selectedLanguage);
        const categoryMatch =
          !selectedCategory || scholar.category.en === selectedCategory;
        const searchMatch =
          !searchTerm ||
          Object.values(scholar.name).some((name) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        return countryMatch && languageMatch && categoryMatch && searchMatch;
      });
  }, [selectedCountry, selectedLanguage, selectedCategory, searchTerm]);

  // 3- Memoize logic to get uniq , translated values for filter dropdowns
  const uniqueCountries = useMemo(() => {
    return countries
      .map((country) => ({
        value: country.en,
        label: country[currentLang] || country["en"],
      }))
      .filter((country) => country.value);
  }, [currentLang]);

  const uniqueLanguages = useMemo( ()=> {
    const allLanguages = scholars.flatMap(scholar => scholar.language);
    return [... new Set(allLanguages)];
  } ,[]);

  const uniqueCategories = useMemo(() => {
    return specializations
      .map((category) => ({
        value: category.en,
        label: category[currentLang] || category["en"],
      }))
      .filter((category) => category.value);
  }, [currentLang]);

  // Return every things the components needs 
  return {
    filteredScholars,
    uniqueCountries,
    uniqueLanguages,
    uniqueCategories,
    onCountryChange: setSelectedCountry,
    onLanguageChange: setSelectedLanguage,
    onCategoryChange: setSelectedCategory,
    onSearchChange: setSearchTerm,
  };
};               
