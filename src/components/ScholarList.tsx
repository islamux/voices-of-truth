import { Scholar, Country } from "@/types";
import ScholarCard from "./ScholarCard";
import { useTranslation } from "react-i18next";

interface ScholarListProps {
  scholars: Scholar[];
  countries: Country[];
}

export default function ScholarList({ scholars, countries }: ScholarListProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // Create a Map for efficient country lookups (O(1) access).
  const countriesMap = new Map(countries.map((c) => [c.id, c]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {scholars.map((scholar) => {
        if (!scholar || !scholar.id) return null;

        // Efficiently find the country and its localized name.
        const countryObject = countriesMap.get(scholar.countryId);
        const countryName = countryObject
          ? countryObject[currentLang] || countryObject['en']
          : "";

        return (
          <ScholarCard
            key={scholar.id}
            scholar={scholar}
            countryName={countryName}
          />
        );
      })}
    </div>
  );
}
