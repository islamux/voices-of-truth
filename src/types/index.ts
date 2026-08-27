export interface Country {
  id: number;
  en: string;
  ar: string;
}

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface Specialization {
  id: number;
  en: string;
  ar: string;
}

export interface Scholar {
  id: number;
  name: LocalizedText;
  socialMedia: {
    platform: string;
    link: string;
    icon?: string;
  }[];
  countryId: number;
  categoryId: number;
  language: string[];
  avatarUrl: string;
  bio?: LocalizedText;
}
