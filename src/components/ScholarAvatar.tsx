'use client';

import Image from "next/image";
import React, { useState } from "react";

interface ScholarAvatarProps{
  avatarUrl: string;
  name:string;
}

export default function ScholarAvatar({avatarUrl, name}:ScholarAvatarProps){
  const [imgError, setImgError] = useState(false);

  return (
    <Image 
    src={imgError ? '/avatars/default-avatar.png' : (avatarUrl || '/avatars/default-avatar.png')}
    alt={imgError ? 'Default avatar' : `${name}'s avatar`}
    width={112}
    height={112}
     className="rounded-full mx-auto object-cover border-2 border-border dark:bg-muted shadow-md mb-4"
    onError={() => setImgError(true)}
    />
  );
} 

