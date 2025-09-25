export interface Scholar {
  id: string; 
  name: Record<string, string>;
  socialMedia: {
    platform: string; 
    link: string;
    icon?: string; 
  }[]; 
  country: Record<string, string>; 
  language: string[]; 
  avatarUrl: string; 
  bio?: Record<string, string>; 
  category: {
    [key: string]: string;
  };
}
