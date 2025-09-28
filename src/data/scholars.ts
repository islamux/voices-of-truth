import { allScholars } from './scholars/index';
import { countries } from './countries';
import { specializations } from './specializations';
import { Scholar } from '../types';


// Helper function fto find ID from a name
const findId = (collection: {id: number; en: string}[], name:string) => {
  const item = collection.find(c=> c.en === name);
  return item ? item.id : -1; // return -1 or handle error if not found
};


// Transform the raw scholar data to the format expected by the app.
export const scholars: Omit<Scholar, 'country' | 'category'> & { counteryId: number; categoryId: number }[] = 
  allScholars.map(scholar => ({
    ...scholar,
    id: typeof scholar.id === 'string' ? parseInt(scholar.id.split('-')[1]) : scholar.id, // convert string ID to number 
    counteryId: findId(countries, scholar.country.en),
    categoryId: findId(specializations, scholar.category.en),
  }));           


