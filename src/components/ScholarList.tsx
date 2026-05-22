import { Scholar, Country } from "@/types";
import ScholarCard from "./ScholarCard";
import { useTranslation } from "react-i18next";

interface ScholarListProps {
  scholars: Scholar[];
  countries: Country[];
}

export default function ScholarList({ scholars, countries }: ScholarListProps) {
  const { t } = useTranslation('scholar');
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const countriesMap = new Map(countries.map((c) => [c.id, c]));

  if (scholars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{t('noScholarsFound')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {scholars.map((scholar) => {
        if (!scholar || !scholar.id || !scholar.name) return null;

        const countryObject = countriesMap.get(scholar.countryId);
        const countryName = String(countryObject
          ? countryObject[currentLang as keyof typeof countryObject] || countryObject['en']
          : "");

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
