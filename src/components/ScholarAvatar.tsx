import Image from "next/image";
import React from "react";

interface ScholarAvatarProps{
  avatarUrl: string;
  name:string;
}


export default function ScholarAvatar({avatarUrl, name}:ScholarAvatarProps){

  return (
    <Image 
    src={avatarUrl || '../../public/avatars/default-avatar.png'}
    alt={`${name}'s avatar`}
    width={112}
    height={112}
    className="rounded-full mx-auto object-cover border-gray-300 dark:bg-slate-600 shadow-md mb-4"
    onError={(e)=>{
      e.currentTarget.src = '../../public/avatars/default-avatar.png'
    }}
    unoptimized
    />
  );
} 

