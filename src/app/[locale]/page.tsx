// src/app/[locale]/page.tsx
/**
 * Locale-specific page (server component)
 * Supports Promise-based params/searchParams (awaited) to avoid Next.js warnings.
 */

import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Scholar } from '@/types';

interface HomePageProps {
  // Align with Next.js PageProps expectation: optional Promise-wrapped params/searchParams
  params?: Promise<{ locale: string }>; // Next's type plugin expects Promise
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  // Safely resolve params (handle undefined)
  const resolvedParams = params ? await params : { locale: 'en' };
  const { locale } = resolvedParams;

  // Resolve searchParams or fallback to empty object
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const { query, country, lang, category } = resolvedSearchParams as Record<string, string | string[] | undefined>;

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
      .filter((country): country is { id: number; name: { en: string; ar: string } } => country !== undefined)
      .map(country => ({ 
        value: country.name.en,
        label: country.name[locale as keyof typeof country.name] || country.name.en,
      }));

    const uniqueCategories = [...new Set(scholars.map(s => s.categoryId))]
      .map(id => specializations.find(s => s.id === id))
      .filter((specialization): specialization is { id: number; name: { en: string; ar: string } } => specialization !== undefined)
      .map(specialization => ({
        value: specialization.name.en,
        label: specialization.name[locale as keyof typeof specialization.name] || specialization.name.en,
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
