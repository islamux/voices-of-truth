// src/components/ScholarCard.tsx
"use client";

import Image from 'next/image';
import React from 'react';
import { Scholar } from '../types';
import { motion, scale } from 'framer-motion';
import { FaTwitter, FaYoutube, FaFacebook, FaInstagram, FaTelegram, FaLink } from 'react-icons/fa';
import { IconContext } from "react-icons";
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
import SocialMediaLinks from './SocialMediaLinks';
import { setConfig } from 'next/config';

import { useTranslation } from 'react-i18next';

interface ScholarCardProps {
  scholar: Scholar; // The scholar data object.
}

const ScholarCard: React.FC<ScholarCardProps> = ({ scholar }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // Retrieves the localized name, falling back to English if the current language's translation is not available.
  const name = scholar.name[currentLang] || scholar.name['en'];
  // Retrieves the localized country, falling back to English.
  const country = scholar.country[currentLang] || scholar.country['en'];
  // Retrieves the localized bio, if available, falling back to English.
  const bio = scholar.bio && (scholar.bio[currentLang] || scholar.bio['en']);

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

export default ScholarCard;
