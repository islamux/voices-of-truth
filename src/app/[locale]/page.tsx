// src/app/[locale]/page.tsx
/**
 * Locale-specific page (server component)
 * NOTE: In this codebase, params is treated as a Promise (similar to layout usage),
 * so we await it before destructuring `locale`.
 * If later refactored to the standard Next.js signature, remove the Promise type and the `await`.
 */

import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Scholar, Country, Specialization } from '@/types';

interface HomePageProps {
  // Promise-wrapped params (non-standard; matches current project pattern)
  params: Promise<{ locale: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  // 1. Await params to safely extract locale (fix for: params must be awaited error)
  const { locale } = await params;
  // 2. Read filter criteria from URL search parameters
  const { query, country, lang, category } = searchParams;

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
