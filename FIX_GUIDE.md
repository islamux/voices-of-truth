# [FIX GUIDE: Voices of Truth Build Error]

This guide provides the exact code changes needed to resolve the Next.js production build error. Please apply the changes for each file as described below.

---

### **Module 1: Correct Prop Typing in Layouts**

**Objective:** Align layout components with Next.js 15's asynchronous prop handling.

**1. File: `src/app/layout.tsx`**

*   **REPLACE** the following code block:
    ```typescript
    interface RootLayoutProps {
      children: React.ReactNode;
      params: {
        locale: string;
      };
    }

    export default function RootLayout({
      children,
      params: { locale },
    }: RootLayoutProps) {
    ```
*   **WITH** this new block:
    ```typescript
    interface RootLayoutProps {
      children: React.ReactNode;
      params: Promise<{ locale: string }>;
    }

    export default async function RootLayout({
      children,
      params,
    }: RootLayoutProps) {
      const { locale } = await params;
    ```

**2. File: `src/app/[locale]/layout.tsx`**

*   **REPLACE** the following code block:
    ```typescript
    interface LocaleLayoutProps {
      children: React.ReactNode;
      params: { locale: string };
    }

    export default async function LocaleLayout({
      children,
      params,
    }: LocaleLayoutProps) {
      const { locale } = await Promise.resolve(params);
    ```
*   **WITH** this new block:
    ```typescript
    interface LocaleLayoutProps {
      children: React.ReactNode;
      params: Promise<{ locale: string }>;
    }

    export default async function LocaleLayout({
      children,
      params,
    }: LocaleLayoutProps) {
      const { locale } = await params;
    ```

---

### **Module 2: Correct Prop Typing in Pages**

**Objective:** Align the main page component with asynchronous prop handling.

**1. File: `src/app/[locale]/page.tsx`**

*   **REPLACE** the following code block:
    ```typescript
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
    ```
*   **WITH** this new block:
    ```typescript
    interface HomePageProps {
      params: Promise<{ locale: string }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    }

    /**
      * This is the main page. It's now a server component that handles
      * data fetching and filtering.
      * */
      export default async function HomePage({ params, searchParams }: HomePageProps) {
        const { locale } = await Promise.resolve(params);
        const { query, country, lang, category } = await searchParams;
    ```

---

### **Module 3: Resolve Downstream Type Errors**

**Objective:** Fix all cascading type errors that appear after the initial props are corrected.

**1. File: `src/data/scholars.ts`**

*   **REPLACE** the entire file content **WITH** the following corrected code. This defines a `RawScholar` type to handle the data transformation correctly.
    ```typescript
    import { allScholars } from './scholars/index';
    import { countries } from './countries';
    import { specializations } from './specializations';
    import { Scholar } from '../types';

    // Define the shape of the raw data, which is different from the final Scholar type.
    interface RawScholar {
      id: any;
      name: Record<string, string>;
      socialMedia: any[];
      country: { en: string; ar: string };
      category: { en: string; ar: string };
      language: string[];
      avatarUrl: string;
      bio?: Record<string, string>;
    }

    function findId(collection: {id: number; en:string}[], name: string)  {
      for(let i = 0; i < collection.length; i++)
      {
        if(collection[i].en === name){
          return collection[i].id;
        }
      }
      return -1;
    }

    // Transform the raw scholar data to the format expected by the app.
    export const scholars: Scholar[] = 
      (allScholars as unknown as RawScholar[]).map(scholar => {
        const { country, category, ...rest } = scholar;
        return {
          ...rest,
          id: typeof scholar.id === 'string' ? parseInt(scholar.id.split('-')[1]) : scholar.id, // convert string ID to number
          countryId: findId(countries, country.en),
          categoryId: findId(specializations, category.en),
        };
      });
    ```

**2. File: `src/types/index.ts`**

*   **REPLACE** the entire file content **WITH** this corrected version. This makes `Country` and `Specialization` indexable and fixes the `bio` type.
    ```typescript
    export interface Country{
      id : number;
      en : string;
      ar:string ;
      [key: string]: string | number;
    }

    export interface Specialization{
      id:number;
      en:string;
      ar:string;
      [key: string]: string | number;
    }

    export interface Scholar{
      id:number;
      name:Record<string, string>; // en: "Name", ar: "الاسم"
      socialMedia: {
        platform: string,
          link: string, 
          icon?:string,
      }[];
      countryId:number;
      categoryId:number;
      language:string[];
      avatarUrl:string;
      bio?:Record<string, string>;
    }
    ```

**3. File: `src/app/[locale]/HomePageClient.tsx`**

*   **REPLACE** the entire file content **WITH** this corrected version. This adds the filter handlers and passes the `countries` prop.
    ```typescript
    "use client";

    import { usePathname, useRouter, useSearchParams } from 'next/navigation';
    import { useCallback } from 'react';
    import { Scholar, Country } from '@/types';
    import ScholarList from '../../components/ScholarList';
    import FilterBar from '../../components/FilterBar';

    interface HomePageClientProps {
      scholars: Scholar[];
      uniqueCountries: { value: string; label: string }[];
      uniqueCategories: { value: string; label: string }[];
      uniqueLanguages: string[];
      countries: Country[];
    }

    const HomePageClient: React.FC<HomePageClientProps> = ({ scholars, uniqueCountries, uniqueCategories, uniqueLanguages, countries }) => {
      const router = useRouter();
      const pathname = usePathname();
      const searchParams = useSearchParams();
      
      const handleFilterChange = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams.toString());
          if (value) {
            params.set(name, value);
          } else {
            params.delete(name);
          }
          router.push(`${pathname}?${params.toString()}`);
        },
        [pathname, router, searchParams]
      );
      
      return (
        <div className="space-y-8">
          <FilterBar 
            uniqueCountries={uniqueCountries} 
            uniqueCategories={uniqueCategories} 
            uniqueLanguages={uniqueLanguages} 
            onCountryChange={(country) => handleFilterChange('country', country)}
            onLanguageChange={(language) => handleFilterChange('lang', language)}
            onCategoryChange={(category) => handleFilterChange('category', category)}
            onSearchChange={(term) => handleFilterChange('query', term)}
          />
          <ScholarList scholars={scholars} countries={countries} />
        </div>
      );
    };

    export default HomePageClient;
    ```

**4. File: `src/components/ScholarList.tsx`**

*   **REPLACE** the entire file content **WITH** this corrected version to pass the `countries` prop.
    ```typescript
    import { Scholar, Country } from "@/types";
    import ScholarCard from "./ScholarCard";

    interface ScholarListProps{
      scholars : Scholar[];
      countries: Country[];
    }

    const ScholarList = ({scholars}: ScholarListProps)=>{
      return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scholars.map(
          (scholar) =>
            scholar &&
            scholar.id && <ScholarCard key={scholar.id} scholar={scholar} countries={countries} />
        )}
        </div>
      );
    };
    export default ScholarList;
    ```

**5. File: `src/components/ScholarCard.tsx`**

*   **REPLACE** the entire file content **WITH** this corrected version to properly look up the country name.
    ```typescript
    "use client";

    import React from 'react';
    import { Scholar, Country } from '../types';
    import { motion } from 'framer-motion';
    import ScholarAvatar from './ScholarAvatar';
    import ScholarInfo from './ScholarInfo';
    import SocialMediaLinks from './SocialMediaLinks';
    import { useTranslation } from 'react-i18next';

    interface ScholarCardProps {
      scholar: Scholar; // The scholar data object.
      countries: Country[];
    }

    const ScholarCard: React.FC<ScholarCardProps> = ({ scholar, countries }) => {
      const { i18n } = useTranslation();
      const currentLang = i18n.language;

      if (!scholar.name) {
        console.error("Scholar with missing name:", scholar);
        return null;
      }
      
      const name = scholar.name[currentLang] || scholar.name['en'];
      const countryObject = countries.find(c => c.id === scholar.countryId);
      const country = countryObject ? (currentLang === 'ar' ? countryObject.ar : countryObject.en) : '';
      const bio = scholar.bio ? (currentLang === 'ar' ? scholar.bio.ar : scholar.bio.en) : undefined;

      return (
        <motion.div
        className="border rounded-lg shadow-lg p-5 bg-[rgb(var(--card-bg-rgb))] border-[rgb(var(--card-border-rgb))] flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.15)" }}
      >
        <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name}/>
        <ScholarInfo name={name} country={country} bio={bio} languages={scholar.language}/>
        <SocialMediaLinks socialMedia={scholar.socialMedia} name={name}/>
        </motion.div>
      );
    };

    export default ScholarCard;
    ```

**6. File: `src/app/[locale]/page.tsx` (Final Pass)**

*   Ensure you are passing the `countries` prop to `HomePageClient`. **REPLACE** the final `return` statement with this:
    ```typescript
        return (
          <HomePageClient
          scholars={filteredScholars as Scholar[]}
          uniqueCountries={uniqueCountries}
          uniqueCategories={uniqueCategories}
          uniqueLanguages={uniqueLanguages}
          countries={countries}
          />
        );
    ```

---

### **Module 4: Final Build & Verification**

After applying all the changes above, run the build command to confirm the fix:

```bash
pnpm run build
```

The build should now complete successfully.
