export interface Country {
  id: number;
  en: string;
  ar: string;
  [key: string]: string | number;
}

export interface Specialization {
  id: number;
  en: string;
  ar: string;
  [key: string]: string | number;
}

export interface Scholar {
  id: number;
  name: Record<string, string>;
  socialMedia: {
    platform: string;
    link: string;
    icon?: string;
  }[];
  countryId: number;
  categoryId: number;
  language: string[];
  avatarUrl: string;
  bio?: Record<string, string>;
}
