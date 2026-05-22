import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Country, Specialization } from '@/types';
import { Suspense } from 'react';

// Precompute valid filter values for guardrails
const validCountryIds = new Set(countries.map(c => c.id));
const validCategoryIds = new Set(specializations.map(s => s.id));

// Define the props for the page, including searchParams.
interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

  export default async function HomePage({ params, searchParams }: HomePageProps) {

    const {locale} = await params;
    const { query, country, lang, category } = await searchParams;

    const searchQuery = (query || '').toString().toLowerCase();
    const countryId = country ? parseInt(country as string, 10) : NaN;
    const categoryId = category ? parseInt(category as string, 10) : NaN;
    const langValue = (lang || '').toString();

    // Validate filter values against known data
    const isValidCountry = !isNaN(countryId) && validCountryIds.has(countryId);
    const isValidCategory = !isNaN(categoryId) && validCategoryIds.has(categoryId);
    const isValidLang = langValue && scholars.some(s => s.language.includes(langValue));

    // Filter the scholars on the server
    const filteredScholars = scholars.filter(scholar => {
      const matchSearch = searchQuery
        ? scholar.name.en.toLowerCase().includes(searchQuery) ||
        scholar.name.ar.toLowerCase().includes(searchQuery) ||
        (scholar.bio?.en || '').toLowerCase().includes(searchQuery) ||
        (scholar.bio?.ar || '').toLowerCase().includes(searchQuery)
        : true;

      const matchCountry = isValidCountry ? scholar.countryId === countryId : true;

      const matchesLang = isValidLang ? scholar.language.includes(langValue) : true;

      const matchesCategory = isValidCategory ? scholar.categoryId === categoryId : true;

      return matchSearch && matchCountry && matchesLang && matchesCategory;
    });

    // Prepare data for the client
    const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];
    const uniqueCountries = countries.map((c: Country) => ({ value: c.id.toString(), label: locale === 'ar' ? c.ar : c.en }));
    const uniqueCategories = specializations.map((s: Specialization) => ({ value: s.id.toString(), label: locale === 'ar' ? s.ar : s.en }));

    // Pass the filterd data to the client component.
    return (
      <Suspense fallback={<div className="text-center py-12"><p className="text-muted-foreground">Loading...</p></div>}>
        <HomePageClient
        scholars={filteredScholars}
        countries={countries}
        uniqueLanguages={uniqueLanguages}
        uniqueCountries={uniqueCountries}
        uniqueCategories={uniqueCategories}
        />
      </Suspense>
    );
  }


