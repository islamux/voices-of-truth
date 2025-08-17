export interface Scholar {
  id: string; // Using string for ID
  name: Record<string, string>; // e.g., { en: "Scholar Name", ar: "اسم العالم" }
  socialMedia: {
    platform: string; // e.g., "Twitter", "YouTube"
    link: string;
    icon?: string; // Optional: e.g., name of a react-icon
  }[]; // Array to support multiple social media platforms
  country: Record<string, string>; // e.g., { en: "Saudi Arabia", ar: "المملكة العربية السعودية" }
  language: string[]; // e.g., ["Arabic", "English"]
  avatarUrl: string; // e.g., "/avatars/scholar_avatar_1.png" (we'll handle actual images later)
  bio?: Record<string, string>; // Optional short bio
}
