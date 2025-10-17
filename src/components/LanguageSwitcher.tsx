'use client';

import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from 'next/navigation';
import Button from "./Button";

export default function LanguageSwicher(){
  const {t, i18n} = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = i18n.language;

  function changeLanguage(newLang:  string){
    // const changeLanguage = (newLang: string)=>{
    if(currentLang === newLang) return;
    if(pathname){
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);  
      router.push(newPath);
    }else{
      router.push(`/${newLang}`);
    }
    }; 

    return (
      <div className="flex items-center space-x-1">
      <Button
      onClick={ ()=>changeLanguage('en') }
      disabled ={currentLang === 'en'}
      className="enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700" 
    >
      {t('english')}
      </Button>

      <Button
      onClick={ ()=> changeLanguage('ar') }
      disabled={currentLang === 'ar'}
      className="enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700"
    >
      {t('arabic')}
      </Button>
      </div>
    );
  }
