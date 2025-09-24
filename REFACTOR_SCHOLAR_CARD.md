*Attention : Update TUT

# Refactoring `ScholarCard.tsx`

The `ScholarCard.tsx` component is getting large and can be broken down into smaller, more manageable components. This will improve readability, maintainability, and reusability.

Here is a step-by-step guide to refactor the `ScholarCard.tsx` component.

## Step 1: Create `ScholarAvatar.tsx`

This component will be responsible for displaying the scholar's avatar.

**Create a new file at `src/components/ScholarAvatar.tsx` with the following content:**

```tsx
// src/components/ScholarAvatar.tsx
import Image from 'next/image';
import React from 'react';

interface ScholarAvatarProps {
  avatarUrl: string;
  name: string;
}

const ScholarAvatar: React.FC<ScholarAvatarProps> = ({ avatarUrl, name }) => {
  return (
    <Image
      src={avatarUrl || '/avatars/default-avatar.png'}
      alt={`${name}'s avatar`}
      width={112}
      height={112}
      className="rounded-full mx-auto object-cover border-2 border-gray-300 dark:border-gray-600 shadow-md mb-4"
      onError={(e) => {
        e.currentTarget.src = '/avatars/default-avatar.png';
      }}
      unoptimized
    />
  );
};

export default ScholarAvatar;
```

## Step 2: Create `ScholarInfo.tsx`

This component will display the scholar's name, country, bio, and languages.

**Create a new file at `src/components/ScholarInfo.tsx` with the following content:**

```tsx
// src/components/ScholarInfo.tsx
import React from 'react';

interface ScholarInfoProps {
  name: string;
  country: string;
  bio: string | null | undefined;
  languages: string[];
}

const ScholarInfo: React.FC<ScholarInfoProps> = ({ name, country, bio, languages }) => {
  return (
    <>
      <h3 className="text-lg sm:text-xl font-semibold text-[rgb(var(--foreground-rgb))] mb-1">{name}</h3>
      <p className="text-xs sm:text-sm text-[rgb(var(--muted-text-rgb))] mb-1">{country}</p>
      {bio && <p className="text-xs text-[rgb(var(--muted-text-rgb))] mb-2 italic px-2">{bio}</p>}
      <p className="text-xs sm:text-sm text-[rgb(var(--muted-text-rgb))] mb-3">
        Languages: {languages.join(', ')}
      </p>
    </>
  );
};

export default ScholarInfo;
```

## Step 3: Create `SocialMediaLinks.tsx`

This component will render the social media icons.

**Create a new file at `src/components/SocialMediaLinks.tsx` with the following content:**

```tsx
// src/components/SocialMediaLinks.tsx
import React from 'react';
import { FaTwitter, FaYoutube, FaFacebook, FaInstagram, FaTelegram, FaLink } from 'react-icons/fa';
import { IconContext } from "react-icons";
import { Scholar } from '../types';

interface SocialMediaLinksProps {
  socialMedia: Scholar['socialMedia'];
  name: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socialMedia, name }) => {
  const renderSocialIcon = (platform: string, link: string, icon?: string) => {
    let iconElement;
    switch (icon) {
      case 'FaTwitter': iconElement = <FaTwitter />; break;
      case 'FaYoutube': iconElement = <FaYoutube />; break;
      case 'FaFacebook': iconElement = <FaFacebook />; break;
      case 'FaInstagram': iconElement = <FaInstagram />; break;
      case 'FaTelegram': iconElement = <FaTelegram />; break;
      default: iconElement = <FaLink />;
    }
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[rgb(var(--muted-text-rgb))] hover:text-[rgb(var(--foreground-rgb))] transition-colors mx-2"
        aria-label={`${platform} link for ${name}`}
        key={link}
      >
        <IconContext.Provider value={{ size: "1.5em" }}>
          {iconElement}
        </IconContext.Provider>
        <span className="sr-only">{platform}</span>
      </a>
    );
  };

  return (
    <div className="mt-auto pt-3 border-t border-[rgb(var(--card-border-rgb))] w-full flex justify-center items-center">
      {socialMedia.map((social) =>
        renderSocialIcon(social.platform, social.link, social.icon)
      )}
    </div>
  );
};

export default SocialMediaLinks;
```

## Step 4: Update `ScholarCard.tsx`

Now, update the `ScholarCard.tsx` component to use the new smaller components.

**Replace the content of `src/components/ScholarCard.tsx` with the following:**

```tsx
// src/components/ScholarCard.tsx
"use client";

import React from 'react';
import { Scholar } from '../types';
import { motion } from 'framer-motion';
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
import SocialMediaLinks from './SocialMediaLinks';

interface ScholarCardProps {
  scholar: Scholar;
  currentLang: string;
}

const ScholarCard: React.FC<ScholarCardProps> = ({ scholar, currentLang }) => {
  const name = scholar.name[currentLang] || scholar.name['en'];
  const country = scholar.country[currentLang] || scholar.country['en'];
  const bio = scholar.bio && (scholar.bio[currentLang] || scholar.bio['en']);

  return (
    <motion.div
      className="border rounded-lg shadow-lg p-5 bg-[rgb(var(--card-bg-rgb))] border-[rgb(var(--card-border-rgb))] flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.15)" }}
    >
      <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name} />
      <ScholarInfo name={name} country={country} bio={bio} languages={scholar.language} />
      <SocialMediaLinks socialMedia={scholar.socialMedia} name={name} />
    </motion.div>
  );
};

export default ScholarCard;
```

By following these steps, you will have successfully refactored the `ScholarCard.tsx` component into smaller, more focused components. This will make your codebase cleaner and easier to work with.
