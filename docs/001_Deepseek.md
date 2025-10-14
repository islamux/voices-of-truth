Tutorial: Building "Voices of Truth" From Scratch (Senior Developer Edition)
Hey there, junior dev! 👋 Welcome to your comprehensive guide to rebuilding the "Voices of Truth" project. I'm going to walk you through this step by step, explaining not just what we're doing, but why we're doing it that way. By the end, you'll understand modern Next.js architecture like a pro.

🚀 Let's Get Started: Project Setup
1. Creating Our Next.js Project
bash
pnpm create next-app voices-of-truth --typescript --eslint --tailwind --app --src-dir --use-pnpm
🔍 Let me break this down for you:

pnpm: This is our package manager (like npm but faster)

--typescript: Adds TypeScript - this catches errors before they happen!

--eslint: Adds code linting to keep our code clean

--tailwind: Adds Tailwind CSS for styling

--app: Uses the new App Router (this is a big deal in Next.js 13+)

--src-dir: Organizes our code in an src/ folder

--use-pnpm: Makes sure we use pnpm consistently

💡 Pro Tip: The App Router is Next.js's newer, more powerful way of building applications. It makes everything more straightforward once you understand it.

2. Installing Our Dependencies
bash
pnpm add i18next react-i18next i18next-resources-to-backend framer-motion react-icons
🧩 What each package does:

i18next family: Handles translations (making our app work in multiple languages)

framer-motion: Adds smooth animations

****react-icons**: Gives us access to thousands of icons

🎯 Why we need these: A professional app needs internationalization (i18n) for global users, animations for better user experience, and icons for clear visual communication.

🏗️ Step 1: Project Structure & Configuration
Think of project structure like organizing your room - when everything has a place, you can find what you need quickly.

text
/
├── public/                 # Static files (images, fonts, translations)
│   ├── avatars/           # Scholar profile pictures
│   └── locales/           # Translation files
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   ├── data/             # Our scholar database
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript type definitions
📁 Understanding the folders:

public/: Files that don't need processing (browser can access directly)

src/app/: Where our pages live (this is App Router magic)

src/components/: Reusable pieces like buttons, cards, filters

src/data/: Our "database" - just JavaScript objects for now

src/lib/: Helper functions (like i18n setup)

src/types/: TypeScript definitions - these are like "blueprints" for our data

💡 Key Insight: A well-organized project is like a well-organized kitchen - you know exactly where to find everything when you're cooking up new features!

📊 Step 2: Defining Our Data (The "Model")
Before we build anything visual, we need to define what our data looks like. This is like creating blueprints before building a house.

typescript
// src/types/index.ts
export interface Scholar {
  id: number;
  name: Record<string, string>; // { en: "Name", ar: "الاسم" }
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
🧠 Understanding the TypeScript magic:

Record<string, string>: This is a TypeScript type that says "an object where keys are strings and values are strings". Perfect for translations!

? after bio: Makes the field optional (some scholars might not have a bio)

[] after types: Means it's an array of that type

🎯 Why we do this first: TypeScript acts like a super-smart spell checker for your data. If you try to use data that doesn't match these shapes, TypeScript will warn you immediately. This catches bugs before they happen!

💡 Real-world analogy: Think of interfaces like ingredient labels - they tell you exactly what's inside each data "container".

🗃️ Step 3: Creating the Data Source
We organize our scholar data by categories, then combine everything:

typescript
// src/data/scholars/index.ts
import { comparativeReligionScholars } from "./comparative-religion";
import { islamicThoughtScholars } from "./islamic-thought";
// ... import other categories

export const allScholars = [
  ...comparativeReligionScholars,
  ...islamicThoughtScholars,
  // ... other categories
];
🔄 Understanding the spread operator (...):
The ... (spread operator) takes all items from an array and "spreads" them into a new array. It's like taking books from different shelves and putting them all on one big table.

📈 Scalability tip: By organizing data in separate files, we can:

Easily find and update specific categories

Add new categories without touching existing code

Prevent merge conflicts when multiple developers work together

🎨 Step 4: The Layout System - Your App's Blueprint
This is where Next.js gets really powerful. The layout system creates consistent structure across your entire app.

A. The Root Layout (src/app/layout.tsx)
tsx
// src/app/layout.tsx
interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{locale: string}>; 
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const {locale} = await params;
  return (
    <html lang={locale} dir={dir(locale)}>
      <body>{children}</body>
    </html>
  );
}
🌍 What's happening here:

params: Promise<{locale: string}>: In Next.js 15, URL parameters are asynchronous (we have to await them)

dir(locale): Sets text direction (left-to-right for English, right-to-left for Arabic)

lang={locale}: Helps screen readers pronounce content correctly

💡 Accessibility note: Setting proper lang and dir attributes isn't just nice - it's essential for users with screen readers or who speak different languages.

B. The Locale Layout (src/app/[locale]/layout.tsx)
tsx
// src/app/[locale]/layout.tsx
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const { resources } = await getTranslation(locale);

  return (
    <I18nProviderClient locale={locale} resources={resources}>
      <ThemeProvider>
        <PageLayout>
          {children}
        </PageLayout>
      </ThemeProvider>
    </I18nProviderClient>
  );
}
🎭 Understanding the "Provider Pattern":
Providers are like managers that distribute resources to components. Here we have three managers:

I18nProviderClient: Manages translations

ThemeProvider: Manages light/dark mode

PageLayout: Manages the visual layout

🔗 The data flow: Server fetches translations → passes to client providers → components use them

C. The Page Layout Component (src/components/PageLayout.tsx)
tsx
// src/components/PageLayout.tsx
"use client"; // This is IMPORTANT!

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation('common');
  const [theme, setTheme] = useState('light');

  // Theme persistence
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header>{/* Header content */}</header>
      <main>{children}</main>
      <footer>{/* Footer content */}</footer>
    </div>
  );
};
🎯 Key concepts explained:

"use client": This tells Next.js "this component needs browser features" (like useState, localStorage)

useState: Manages data that can change (like theme)

useEffect: Runs code when component loads (perfect for reading saved preferences)

localStorage: Browser storage that persists between sessions

💡 Pro Tip: The useEffect with empty array [] runs exactly once when the component first appears. Perfect for setup tasks!

D. The Translation Bridge (I18nProviderClient.tsx)
tsx
// src/components/I18nProviderClient.tsx
'use client';

export default function I18nProviderClient({
  children,
  locale,
  resources
}) {
  const i18n = createInstance();
  i18n.use(initReactI18next).init({
    lng: locale,
    resources,
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
🌉 Why we need this bridge:

Server Components can't use React Context (which react-i18next needs)

Client Components can use Context but shouldn't do data fetching

Solution: Server fetches data → passes to this bridge → bridge provides it to client components

🎯 Architecture pattern: This is a common pattern in Next.js 13+ - server components for data, client components for interactivity, and bridges to connect them.

🌐 Step 5: Internationalization (i18n) Made Simple
Internationalization (i18n) sounds scary, but it's just about making your app speak multiple languages.

How it works:

Middleware detects user's preferred language

Translation files contain all text in different languages

Components use the t() function to get the right text

json
// public/locales/en/common.json
{
  "headerTitle": "Voices of Truth",
  "english": "English",
  "arabic": "Arabic"
}

// public/locales/ar/common.json  
{
  "headerTitle": "أصوات الحق",
  "english": "الإنجليزية",
  "arabic": "العربية"
}
💡 User Experience tip: Detecting language automatically makes users feel like the app was made just for them!

⚡ Step 6: Server-Side Filtering - The Performance Game-Changer
This was a major architecture improvement. Instead of sending ALL data to the browser and filtering there, we filter on the server and send only what's needed.

tsx
// src/app/[locale]/page.tsx
export default async function HomePage({ params, searchParams }: HomePageProps) {
  // 1. Get filter values from URL
  const { query, country, lang, category } = await searchParams;

  // 2. Filter data on SERVER
  const filteredScholars = scholars.filter(scholar => {
    // Filtering logic here
    return matchSearch && matchCountry && matchesLang && matchesCategory;
  });

  // 3. Pass filtered data to client
  return (
    <HomePageClient
      scholars={filteredScholars}
      uniqueCountries={uniqueCountries}
      // ... other props
    />
  );
}
🚀 Performance benefits:

Faster initial load: Only necessary data is sent

Better mobile experience: Less data over cellular networks

Reduced memory usage: Browser doesn't store giant datasets

💡 Important Next.js 15 change: searchParams is now asynchronous - you MUST await it!

🎮 Step 7: The Interactive Client Component
While the server handles heavy data work, the client handles user interactions.

tsx
// src/app/[locale]/HomePageClient.tsx
"use client";

const HomePageClient: React.FC<HomePageClientProps> = ({
  scholars,
  uniqueCountries,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <div>
      <FilterBar onCountryChange={(country) => handleFilterChange("country", country)} />
      <ScholarList scholars={scholars} />
    </div>
  );
};
🎯 Understanding the user interaction flow:

User clicks filter → FilterBar calls onCountryChange("Egypt")

URL updates → handleFilterChange updates URL to ?country=Egypt

Server re-renders → Next.js sees new URL, re-runs HomePage with new filters

New data flows down → Freshly filtered scholars sent to client

UI updates → User sees updated results

🔧 Key React concepts:

useCallback: Optimizes performance by preventing unnecessary re-renders

URLSearchParams: Browser API for working with query strings

router.push: Programmatically changes the URL

💡 Pro Tip: This pattern (URL as state) is powerful because:

Users can bookmark filtered views

Back/forward buttons work correctly

Page can be shared with filters preserved

🎓 Step 8: Important React Rules You MUST Follow
Rule 1: Client vs Server Components
tsx
// ✅ Server Component (no "use client")
async function ServerComponent() {
  const data = await fetchData(); // Can use async/await
  return <div>{data}</div>;
}

// ✅ Client Component (has "use client")
"use client";
function ClientComponent() {
  const [state, setState] = useState(); // Can use state
  return <button onClick={() => setState(...)}>Click</button>;
}
What goes where:

Server Components: Data fetching, SEO metadata, non-interactive content

Client Components: Forms, animations, anything using browser APIs

Rule 2: The Rules of Hooks
tsx
// ✅ GOOD - hooks at top level
function MyComponent() {
  const [state, setState] = useState(null); // Top level
  const router = useRouter(); // Top level
  
  if (condition) {
    // Still OK - condition doesn't affect hook order
  }
  
  return <div>Content</div>;
}

// ❌ BAD - hooks inside condition
function BadComponent() {
  if (condition) {
    const [state, setState] = useState(null); // WRONG!
  }
  
  return <div>Content</div>;
}
Why this matters: React tracks hooks by their call order. If that order changes between renders, React gets confused and bugs happen.

🎉 Conclusion & Your Next Steps
Congratulations! You now understand a modern Next.js application from the ground up. Let's review what you've learned:

🏗️ Architecture Understanding:
Server Components for data and performance

Client Components for interactivity

Layout system for consistent structure

Provider pattern for sharing data

🔧 Technical Skills:
TypeScript for type safety

Tailwind CSS for styling

Internationalization for global users

URL-based state for shareable filters

🎯 Next Learning Steps:
Explore the FilterBar component - see how user interactions connect to URL changes

Try adding a new scholar category - practice with the data structure

Experiment with animations - use Framer Motion on the scholar cards

Add a new language - see how the i18n system works

💪 You've got this! The best way to learn is by doing. Don't be afraid to break things - that's how we learn. If you get stuck, remember: every senior developer was once a junior who kept trying.

Happy coding! 🚀
