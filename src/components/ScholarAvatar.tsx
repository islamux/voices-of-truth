'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ScholarAvatarProps {
  avatarUrl: string;
  name: string;
}

export default function ScholarAvatar({ avatarUrl, name }: ScholarAvatarProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Image
      src={
        imgError
          ? '/avatars/default-avatar.png'
          : avatarUrl || '/avatars/default-avatar.png'
      }
      alt={name}
      width={112}
      height={112}
      className="mb-4 mx-auto h-28 w-28 rounded-full object-cover bg-muted shadow-sm ring-2 ring-border transition-shadow duration-200 group-hover:ring-accent/40"
      onError={() => setImgError(true)}
    />
  );
}
