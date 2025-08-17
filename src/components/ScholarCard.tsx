// src/components/ScholarCard.tsx
"use client";

import Image from 'next/image';
import React from 'react';
import { Scholar } from '../types';
import { motion } from 'framer-motion';
import { FaTwitter, FaYoutube, FaFacebook, FaInstagram, FaTelegram, FaLink } from 'react-icons/fa';
import { IconContext } from "react-icons";

interface ScholarCardProps {
  scholar: Scholar; // The scholar data object.
  currentLang: string; // The currently active language to display translated fields.
}

const ScholarCard: React.FC<ScholarCardProps> = ({ scholar, currentLang }) => {
  // Retrieves the localized name, falling back to English if the current language's translation is not available.
  const name = scholar.name[currentLang] || scholar.name['en'];
  // Retrieves the localized country, falling back to English.
  const country = scholar.country[currentLang] || scholar.country['en'];
  // Retrieves the localized bio, if available, falling back to English.
  const bio = scholar.bio && (scholar.bio[currentLang] || scholar.bio['en']);

  // Renders the appropriate social media icon based on the platform.
  const renderSocialIcon = (platform: string, link: string, icon?: string) => {
    let iconElement; // Will hold the React icon component.
    switch (icon) { // Determines which icon component to use.
      case 'FaTwitter': iconElement = <FaTwitter />; break;
      case 'FaYoutube': iconElement = <FaYoutube />; break;
      case 'FaFacebook': iconElement = <FaFacebook />; break;
      case 'FaInstagram': iconElement = <FaInstagram />; break;
      case 'FaTelegram': iconElement = <FaTelegram />; break;
      default: iconElement = <FaLink />; // Default icon if no specific match.
    }
    return (
      <a 
        href={link} 
        target="_blank" // Open link in a new tab.
        rel="noopener noreferrer" // Security best practice for external links.
        className="text-[rgb(var(--muted-text-rgb))] hover:text-[rgb(var(--foreground-rgb))] transition-colors mx-2"
        aria-label={`${platform} link for ${name}`} // Accessibility label.
        key={link} // Unique key for React list rendering
      >
        <IconContext.Provider value={{ size: "1.5em" }}> {/* Standardizes icon size. */}
          {iconElement}
        </IconContext.Provider>
        <span className="sr-only">{platform}</span> {/* Screen reader text. */}
      </a>
    );
  };

  // Main card component rendering.
  return (
    <motion.div // Framer Motion div for animations.
      className="border rounded-lg shadow-lg p-5 bg-[rgb(var(--card-bg-rgb))] border-[rgb(var(--card-border-rgb))] flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }} // Initial animation state.
      animate={{ opacity: 1, y: 0 }} // Animate to this state.
      transition={{ duration: 0.4, ease: "easeOut" }} // Animation timing and easing.
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.15)" }} // Hover animation.
    >
      <Image
        src={scholar.avatarUrl || '/avatars/default-avatar.png'} // Scholar's avatar or default.
        alt={`${name}'s avatar`}
        width={112} // w-28 = 28 * 4px = 112px
        height={112} // h-28 = 28 * 4px = 112px
        className="rounded-full mx-auto object-cover border-2 border-gray-300 dark:border-gray-600 shadow-md mb-4"
        onError={(e) => {
          e.currentTarget.src = '/avatars/default-avatar.png';
        }} // Fallback if image fails to load.
        unoptimized
      />
      <h3 className="text-lg sm:text-xl font-semibold text-[rgb(var(--foreground-rgb))] mb-1">{name}</h3>
      <p className="text-xs sm:text-sm text-[rgb(var(--muted-text-rgb))] mb-1">{country}</p>
      {bio && <p className="text-xs text-[rgb(var(--muted-text-rgb))] mb-2 italic px-2">{bio}</p>}
      <p className="text-xs sm:text-sm text-[rgb(var(--muted-text-rgb))] mb-3">
        Languages: {scholar.language.join(', ')}
      </p>
      {/* Social media link section, appears at the bottom of the card. */}
      <div className="mt-auto pt-3 border-t border-[rgb(var(--card-border-rgb))] w-full flex justify-center items-center">
        {scholar.socialMedia.map((social) => 
          renderSocialIcon(social.platform, social.link, social.icon)
        )}
      </div>
    </motion.div>
  );
};

export default ScholarCard;
