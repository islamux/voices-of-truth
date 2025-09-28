// src/app/[locale]/page.tsx
/**
* This is the main page for a given locale.
  * It's a Server Component that renders the interactive Client Component.
  * The responsibility for fetching and managing translations is delegated
  * to the provider in the layout and the client component itself.
  */

  import HomePageClient from './HomePageClient';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Scholar, Country, Specialization } from '@/types';

// Define the props for the page, including searchParams.
interface HomePageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
  * This is the main page. It's now a server component that handles
  * data fetching and filtering.
  * */
  export default async function HomePage({ params, searchParams }: HomePageProps) {
    const { query, country, lang, category } = await searchParams;

    const searchQuery = (query || '').toString().toLowerCase();



    // 2. Filter the scholars on the server
    const filteredScholars = scholars.filter(scholar => {
      const matchSearch = searchQuery
        ? scholar.name.en.toLowerCase().includes(searchQuery) ||
        scholar.name.ar.toLowerCase().includes(searchQuery)
        : true;

      // Add logic for country, lang, category filters here
      const countryId = country ? countries.find(c => c.en === country)?.id : undefined;
      const matchCountry = country ? scholar.countryId === countryId : true;

      const matchesLang = lang ? scholar.language.includes(lang) : true;

      const categoryId = category ? specializations.find(s => s.en === category)?.id : undefined;
      const matchesCategory = category ? scholar.categoryId === categoryId : true;

      return matchSearch && matchCountry && matchesLang && matchesCategory;
    });

    // 3. Prepare data for the client
    const uniqueCountries = [...new Set(scholars.map(s => s.countryId))]
      .map(id => countries.find(c => c.id === id))
      .filter((country): country is Country => country !== undefined)
      .map(country => ({ value: country.en, label: country.en }));

    const uniqueCategories = [...new Set(scholars.map(s => s.categoryId))]
      .map(id => specializations.find(s => s.id === id))
      .filter((specialization): specialization is Specialization => specialization !== undefined)
      .map(specialization => ({ value: specialization.en, label: specialization.en }));
    const uniqueLanguages = [...new Set(scholars.flatMap(s => s.language))];

    // 4.  Pass the filterd data to the client component.
    return (
      <HomePageClient
      scholars={filteredScholars as Scholar[]}
      uniqueCountries={uniqueCountries}
      uniqueCategories={uniqueCategories}
      uniqueLanguages={uniqueLanguages}
      />
    );
  }
