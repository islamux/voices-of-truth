"use client";

import React from 'react';
import { Scholar } from '../types';
import { motion } from 'framer-motion';
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
import SocialMediaLinks from './SocialMediaLinks';
import { useLocalizedScholar } from '@/hooks/useLocalizedScholar';

interface ScholarCardProps {
  scholar: Scholar; // The scholar data object.
    countryName: string; // The pre-resolved, localized country name.
}

export default function ScholarCard({ scholar, countryName }: ScholarCardProps) {
  // All complex data logic is now handled by the hook.
  const { name, bio, languages } = useLocalizedScholar(scholar);

  if (!scholar.name) {
    console.error("Scholar with missing name:", scholar);
    return null;
  }

  // Main card component rendering.
  return (
    <motion.div // Framer Motion div for animations.
    className="border border-border rounded-lg shadow-lg p-5 bg-card text-card-foreground flex flex-col items-center text-center"
    initial={{ opacity: 0, y: 20 }} // Initial animation state.
    animate={{ opacity: 1, y: 0 }} // Animate to this state.
    transition={{ duration: 0.4, ease: "easeOut" }} // Animation timing and easing.
    whileHover={{ scale: 1.03 }} // Hover animation.
  >
    <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name} />
    <ScholarInfo name={name} country={countryName} bio={bio} languages={languages} />
    <SocialMediaLinks socialMedia={scholar.socialMedia} name={name} />
    </motion.div>
  );
}
