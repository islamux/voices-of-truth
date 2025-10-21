import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Scholar, Country, Specialization } from '@/types';

// Define the props for the page, including searchParams.
interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
  * This is the main page. It's now a server component that handles
  * data fetching and filtering.
  * */
  export default async function HomePage({ searchParams }: HomePageProps) {

    // const {locale} = await params;
    const { query, country, lang, category } = await searchParams;

    const searchQuery = (query || '').toString().toLowerCase();



    // 2. Filter the scholars on the server
    const filteredScholars = scholars.filter(scholar => {
      const matchSearch = searchQuery
        ? scholar.name.en.toLowerCase().includes(searchQuery) ||
        scholar.name.ar.toLowerCase().includes(searchQuery)
        : true;

      const matchCountry = country ? scholar.countryId === parseInt(country as string, 10) : true;

      const matchesLang = lang ? scholar.language.includes(lang as string) : true;

      const matchesCategory = category ? scholar.categoryId === parseInt(category as string, 10) : true;

      return matchSearch && matchCountry && matchesLang && matchesCategory;
    });

    // 3. Prepare data for the client
    const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];
    const uniqueCountries = countries.map((c: Country) => ({ value: c.id.toString(), label: c.en }));
    const uniqueCategories = specializations.map((s: Specialization) => ({ value: s.id.toString(), label: s.en }));

    // 4.  Pass the filterd data to the client component.
    return (
      <HomePageClient
      scholars={filteredScholars as Scholar[]}
      countries={countries}
      specializations={specializations}
      uniqueLanguages={uniqueLanguages}
      uniqueCountries={uniqueCountries}
      uniqueCategories={uniqueCategories}
      />
    );
  }


