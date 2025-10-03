export interface Country {
  id: number;
  name: Record<string, string>;
}

export interface Specialization {
  id: number;
  name: Record<string, string>;
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
