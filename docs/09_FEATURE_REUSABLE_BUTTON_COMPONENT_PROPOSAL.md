# Feature: Reusable Button Component

As our application grows, we want to ensure that our UI is consistent and our code is maintainable. Creating a reusable `Button` component is a fundamental step towards achieving this. It's not overkill; it's a best practice that will save you time and effort in the long run.

### Why Create a Reusable Button?

1.  **Consistency:** Ensures all buttons across the application share the same base styling, look, and feel.
2.  **Maintainability:** If you need to update your button styles, you only have to do it in one place.
3.  **Cleaner Code:** It simplifies your components, replacing long `className` strings with a clean and readable `<Button>` component.

---

## Step 1: Install a Helper Library

To make our component more robust, we'll install `tailwind-merge`. This utility is essential for intelligently merging Tailwind CSS classes, which prevents styling conflicts when you want to override or extend styles.

```bash
pnpm add tailwind-merge
```

## Step 2: Create the Button Component

Next, we'll create the actual `Button.tsx` file. This component will serve as the foundation for all buttons in the application.

```tsx
// src/components/Button.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, className, ...props }, ref) {
  const baseClasses = "px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  
  // twMerge allows you to override the base classes with the className prop
  const mergedClasses = twMerge(baseClasses, className);

  return (
    <button className={mergedClasses} ref={ref} {...props}>
      {children}
    </button>
  );
});
```

**What this code does:**
*   It creates a standard React button that accepts all the usual button attributes (`onClick`, `disabled`, etc.).
*   It defines `baseClasses` that will be applied to every button.
*   It uses `twMerge` to combine the `baseClasses` with any `className` you pass as a prop. This is powerful because if you pass `className="px-4"`, `twMerge` is smart enough to override the `px-3` from the base styles.
*   It uses `React.forwardRef` to allow passing a `ref` to the underlying button element, which is a good practice for component libraries.

## Step 3: Refactor Existing Components

Now, let's update our existing components to use our new `Button`.

### `ThemeToggle.tsx`

```tsx
// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";
import Button from './Button'; // <-- Import the new Button

export default function ThemeToggle(){
  const {theme, toggleTheme} = useTheme();
  const {t} = useTranslation('common');

  return (
    <Button 
      onClick={toggleTheme}
      className="hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === 'light' ? t('dark') : t('light')} {t('theme')}
    </Button>
  );
}
```

### `LanguageSwitcher.tsx`

```tsx
// src/components/LanguageSwitcher.tsx
'use client';

import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from 'next/navigation';
import Button from './Button'; // <-- Import the new Button

export default function LanguageSwicher(){
  const {t, i18n} = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = i18n.language;

  const changeLanguage = (newLang: string)=>{
    if(currentLang === newLang) return;
    if(pathname){
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);  
      router.push(newPath);
    }else{
      router.push(`/${newLang}`);
    }
  }; 

  return (
    <div className="flex items-center space-x-1">
      <Button
        onClick={ ()=>changeLanguage('en') }
        disabled ={currentLang === 'en'}
        className="enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700"
      >
        {t('english')}
      </Button>

      <Button
        onClick={ ()=> changeLanguage('ar') }
        disabled={currentLang === 'ar'}
        className="enabled:hover:bg-gray-200 dark:enabled:hover:bg-orange-700"
      >
        {t('arabic')}
      </Button>
    </div>
  );
}
```

Notice how much cleaner these components are now. The specific hover styles are passed in via the `className` prop, while all the common styles are handled by the `Button` component itself.

---

## Future Improvements: Variants

This simple `Button` component is a great start. As the app grows, you might need different kinds of buttons (e.g., a red "destructive" button or a button with just an outline).

For that, you can use a library called **`class-variance-authority` (CVA)**. It allows you to define variants for your components, like this:

```tsx
// Example of a more advanced Button with CVA
const buttonVariants = cva(
  "px-3 py-1.5 text-sm rounded-md", // Base classes
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white",
        destructive: "bg-red-500 text-white",
        outline: "border border-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

This is a powerful pattern for building a design system, but for now, our simple `Button` component is a perfect, practical solution.
