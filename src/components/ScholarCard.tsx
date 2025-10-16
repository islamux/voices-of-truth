// src/components/ScholarCard.tsx
"use client";

import React from 'react';
import { Country, Scholar } from '../types';
import { motion } from 'framer-motion';
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
import SocialMediaLinks from './SocialMediaLinks';

import { useTranslation } from 'react-i18next';

interface ScholarCardProps {
  scholar: Scholar; // The scholar data object.
    countries: Country[];
}

export default function ScholarCard({scholar, countries}:ScholarCardProps){
  // const ScholarCard: React.FC<ScholarCardProps> = ({ scholar , countries}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  if (!scholar.name) {
    console.error("Scholar with missing name:", scholar);
    return null;
  }
    // Retrieves the localized name, falling back to English if the current language's translation is not available.
    const name = scholar.name[currentLang] || scholar.name['en'];
    // Retrieves the localized country, falling back to English.

    const countryObject = countries.find(c=> c.id === scholar.countryId);

    const country = countryObject ? (currentLang === 'ar' ? countryObject.ar : countryObject.en) : '';

    // Retrieves the localized bio, if available, falling back to English.
    const bio = scholar.bio ? (currentLang === 'ar' ? scholar.bio.ar : scholar.bio.en) : undefined;

    // Main card component rendering.
    return (
      <motion.div // Framer Motion div for animations.
      className="border rounded-lg shadow-lg p-5 bg-[rgb(var(--card-bg-rgb))] border-[rgb(var(--card-border-rgb))] flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }} // Initial animation state.
      animate={{ opacity: 1, y: 0 }} // Animate to this state.
      transition={{ duration: 0.4, ease: "easeOut" }} // Animation timing and easing.
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.15)" }} // Hover animation.
    >
      <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name}/>
      <ScholarInfo name={name} country={country} bio={bio} languages={scholar.language}/>
      <SocialMediaLinks socialMedia={scholar.socialMedia} name={name}/>

      </motion.div>
    );
  };

