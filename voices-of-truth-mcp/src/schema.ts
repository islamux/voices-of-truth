export interface Country {
  id: number;
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

export interface Category {
  id: number;
  en: string;
  ar: string;
}

export interface ScholarStore {
  countries: Country[];
  specializations: Specialization[];
  scholars: Scholar[];
  categories: Category[];
  metadata: {
    last_updated: string;
    version: string;
  };
}

let store: ScholarStore = {
  countries: [],
  specializations: [],
  scholars: [],
  categories: [],
  metadata: { last_updated: '', version: '1.0.0' }
};

export function getStore(): ScholarStore {
  return store;
}

export function setStore(newStore: ScholarStore): void {
  store = newStore;
}

export function generateId(): number {
  const maxId = store.scholars.reduce((max, s) => Math.max(max, s.id), 0);
  return maxId + 1;
}