// src/app/[locale]/page.tsx
import HomePageClient from './HomePageClient';

/**
* This is the main page for a given locale.
  * It's a Server Component that renders the interactive Client Component.
  * The responsibility for fetching and managing translations is delegated
  * to the provider in the layout and the client component itself.
  */
  export default function HomePage() {
    return <HomePageClient />;
  }
