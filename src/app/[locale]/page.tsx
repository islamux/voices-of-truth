// src/app/[locale]/page.tsx
/**
 * Locale-specific page (server component)
 * Refactored to standard Next.js pattern: params is a plain object.
 */

import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Scholar, Country, Specialization } from '@/types';

interface HomePageProps {
  // params & searchParams appear to be Promise-like based on runtime warnings; treat them defensively.
  params: Promise<{ locale: string }> | { locale: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  // Normalize params (await if it's a Promise)
  const resolvedParams = await Promise.resolve(params);
  const { locale } = resolvedParams;

  // Normalize searchParams similarly
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { query, country, lang, category } = resolvedSearchParams;

  const searchQuery = (query || '').toString().toLowerCase();

    // 2. Filter the scholars on the server
    const filteredScholars = scholars.filter(scholar => {
      const matchSearch = searchQuery
        ? scholar.name.en.toLowerCase().includes(searchQuery) ||
        scholar.name.ar.includes(searchQuery) // no need toLowerCase for ar.
        : true;

      // Add logic for country, lang, category filters here
      const countryId = country ? countries.find(c => c.name.en === country)?.id : undefined;
      const matchCountry = country ? scholar.countryId === countryId : true;

      const matchesLang = lang ? scholar.language.includes(lang as string) : true;

      const categoryId = category ? specializations.find(s => s.name.en === category)?.id : undefined;
      const matchesCategory = category ? scholar.categoryId === categoryId : true;

      return matchSearch && matchCountry && matchesLang && matchesCategory;
    });

    // 3. Prepare data for the client
    const uniqueCountries = [...new Set(scholars.map(s => s.countryId))]
      .map(id => countries.find(c => c.id === id))
      .filter((country): country is Country => country !== undefined)
      .map(country => ({ 
        value: country.name.en,
        label: country.name[locale] || country.name.en,
      }));

    const uniqueCategories = [...new Set(scholars.map(s => s.categoryId))]
      .map(id => specializations.find(s => s.id === id))
      .filter((specialization): specialization is Specialization => specialization !== undefined)
      .map(specialization => ({
        value: specialization.name.en,
        label: specialization.name[locale] || specialization.name.en,
      }));
    const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];

    // 4.  Pass the filterd data to the client component.
    return (
      <HomePageClient
      scholars={filteredScholars as Scholar[]}
      uniqueCountries={uniqueCountries}
      uniqueCategories={uniqueCategories}
      uniqueLanguages={uniqueLanguages}
      countries={countries}
      />
    );
  }
