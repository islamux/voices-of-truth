import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Country, Specialization } from '@/types';
import { Suspense } from 'react';
import { normalizeArabic } from '@/lib/search';

const validCountryIds = new Set(countries.map(c => c.id));
const validCategoryIds = new Set(specializations.map(s => s.id));


interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

  export default async function HomePage({ params, searchParams }: HomePageProps) {

    const {locale} = await params;
    const { query, country, lang, category, page } = await searchParams;

    const searchQuery = normalizeArabic((query || '').toString().toLowerCase());
    const countryId = country ? parseInt(country as string, 10) : NaN;
    const categoryId = category ? parseInt(category as string, 10) : NaN;
    const langValue = (lang || '').toString();
    const currentPage = Math.max(1, parseInt(page as string, 10) || 1);
    const PER_PAGE = 12;

    const isValidCountry = !isNaN(countryId) && validCountryIds.has(countryId);
    const isValidCategory = !isNaN(categoryId) && validCategoryIds.has(categoryId);
    const isValidLang = langValue && scholars.some(s => s.language.includes(langValue));

    const filteredScholars = scholars.filter(scholar => {
      const matchSearch = searchQuery
        ? normalizeArabic(scholar.name.en.toLowerCase()).includes(searchQuery) ||
        normalizeArabic(scholar.name.ar.toLowerCase()).includes(searchQuery) ||
        normalizeArabic((scholar.bio?.en || '').toLowerCase()).includes(searchQuery) ||
        normalizeArabic((scholar.bio?.ar || '').toLowerCase()).includes(searchQuery)
        : true;

      const matchCountry = isValidCountry ? scholar.countryId === countryId : true;

      const matchesLang = isValidLang ? scholar.language.includes(langValue) : true;

      const matchesCategory = isValidCategory ? scholar.categoryId === categoryId : true;

      return matchSearch && matchCountry && matchesLang && matchesCategory;
    });

    const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];
    const uniqueCountries = countries.map((c: Country) => ({ value: c.id.toString(), label: locale === 'ar' ? c.ar : c.en }));
    const uniqueCategories = specializations.map((s: Specialization) => ({ value: s.id.toString(), label: locale === 'ar' ? s.ar : s.en }));

    const totalPages = Math.ceil(filteredScholars.length / PER_PAGE);
    const safePage = Math.min(currentPage, totalPages || 1);
    const paginatedScholars = filteredScholars.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    return (
      <Suspense fallback={<div className="text-center py-12"><div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-muted rounded mx-auto" /><div className="h-4 w-64 bg-muted rounded mx-auto" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"><div className="h-72 bg-card rounded-lg" /><div className="h-72 bg-card rounded-lg" /><div className="h-72 bg-card rounded-lg" /></div></div></div>}>
        <HomePageClient
        scholars={paginatedScholars}
        countries={countries}
        uniqueLanguages={uniqueLanguages}
        uniqueCountries={uniqueCountries}
        uniqueCategories={uniqueCategories}
        currentPage={safePage}
        totalPages={totalPages}
        />
      </Suspense>
    );
  }


