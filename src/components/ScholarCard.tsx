"use client";

import React from 'react';
import { Scholar } from '../types';
import { motion } from 'framer-motion';
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
import SocialMediaLinks from './SocialMediaLinks';
import { useLocalizedScholar } from '@/hooks/useLocalizedScholar';
import { useTranslation } from 'react-i18next';

interface ScholarCardProps {
  scholar: Scholar;
    countryName: string;
}

export default function ScholarCard({ scholar, countryName }: ScholarCardProps) {
  const { name, bio, languages } = useLocalizedScholar(scholar);
  const { t } = useTranslation('scholar');

  if (!scholar.name) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Scholar with missing name:", scholar);
    }
    return null;
  }

  return (
    <motion.div
    className="border border-border rounded-lg shadow-lg p-5 bg-card text-card-foreground flex flex-col items-center text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    whileHover={{ scale: 1.03 }}
  >
    <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name} />
    <ScholarInfo name={name} country={countryName} bio={bio} languages={languages} languagesLabel={t('languages')} />
    <SocialMediaLinks socialMedia={scholar.socialMedia} name={name} />
    </motion.div>
  );
}
