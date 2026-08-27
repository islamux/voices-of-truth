'use client';

import { Scholar, Country } from '@/types';
import ScholarCard from './ScholarCard';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';

interface ScholarListProps {
  scholars: Scholar[];
  countries: Country[];
}

export default function ScholarList({ scholars, countries }: ScholarListProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const reduce = useReducedMotion();

  const countriesMap = new Map(countries.map((c) => [c.id, c]));

  if (scholars.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="font-display text-lg text-foreground">
          {t('noScholarsFound')}
        </p>
      </div>
    );
  }

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.05 },
    },
  };

  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {scholars.map((scholar) => {
        const countryObject = countriesMap.get(scholar.countryId);
        const countryName = String(
          countryObject
            ? countryObject[currentLang as keyof typeof countryObject] ||
                countryObject['en']
            : '',
        );

        return (
          <motion.div key={scholar.id} variants={item} className="h-full">
            <ScholarCard scholar={scholar} countryName={countryName} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
