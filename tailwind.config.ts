import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", 
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // These might be from an older version or initial setup.
        // Preserving them is fine, but they might not be actively used 
        // if CSS variables in globals.css are handling theming.
        background: "var(--background)", 
        foreground: "var(--foreground)", 
      },
    },
  },
  plugins: [], 
};
export default config;
