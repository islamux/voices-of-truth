# 🏗️ الدليل الكامل لبناء مشروع "Voices of Truth" من الصفر

مرحبًا بك أيها المطوّر الصاعد 👋  
في هذا الدليل سنقوم معًا — خطوة بخطوة — ببناء مشروع **"Voices of Truth"** من البداية، لتتعلم كيف تُنشئ تطبيقًا احترافيًا باستخدام **Next.js** و**TypeScript** و**TailwindCSS** مع دعم الترجمة (i18n) والتصميم المتجاوب.

الهدف ليس فقط أن يعمل المشروع، بل أن تفهم كيف تعمل الأمور داخليًا:  
كيف تنتقل البيانات؟ كيف تتفاعل المكونات مع بعضها؟ وما معنى "Server Component" و"Client Component"؟

---

## ⚙️ الخطوة الأولى: إنشاء مشروع Next.js جديد

نبدأ بإنشاء مشروع جديد باستخدام **pnpm** (مدير حزم سريع وحديث):

```bash
pnpm create next-app voices-of-truth --typescript --eslint --tailwind --app --src-dir --use-pnpm
```

📘 هذا الأمر يقوم بالتالي:
- **`voices-of-truth`**: اسم مجلد المشروع.
- **`--typescript`**: يفعّل دعم TypeScript.
- **`--eslint`**: يضيف أداة فحص الشيفرة (Linting).
- **`--tailwind`**: يضيف نظام تنسيق Tailwind CSS.
- **`--app`**: يستخدم نظام App Router الجديد (من Next.js 13+).
- **`--src-dir`**: يجعل المجلد الرئيسي للشيفرة داخل `src/`.
- **`--use-pnpm`**: يضمن استخدام pnpm بدل npm أو yarn.

بعد الإنشاء:
```bash
cd voices-of-truth
```

---

## 📦 الخطوة الثانية: تثبيت المكتبات الإضافية

نحتاج إلى بعض المكتبات التي ستضيف ميزات مثل الترجمة والأنيميشن والأيقونات:

```bash
pnpm add i18next react-i18next i18next-resources-to-backend framer-motion react-icons
```

🔍 ما وظيفة كل مكتبة؟

| المكتبة | الوظيفة |
|----------|----------|
| **i18next** و **react-i18next** | لتهيئة الترجمة متعددة اللغات |
| **i18next-resources-to-backend** | لتحميل ملفات الترجمة من المجلد `public/locales` |
| **framer-motion** | لإضافة حركات انتقالية جميلة وسلسة |
| **react-icons** | لإضافة أيقونات جاهزة بسهولة |

---

## 🧱 الخطوة الثالثة: بنية المشروع الأساسية

بعد الإعداد، ستكون بنية مشروعك كالتالي:

```
/
├── public/              # ملفات ثابتة (صور، خطوط، ترجمات)
│   └── locales/
│       ├── ar/common.json
│       └── en/common.json
├── src/
│   ├── app/             # صفحات Next.js بنظام App Router
│   ├── components/      # المكونات القابلة لإعادة الاستخدام
│   ├── data/            # بيانات ثابتة (مثل قائمة العلماء)
│   ├── lib/             # ملفات مساعدة (كإعداد i18n)
│   └── types/           # تعريف أنواع البيانات (TypeScript)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

🧠 **نصيحة من السينيور:**  
احرص على تنظيم مجلداتك منذ البداية. التنظيم الجيد يوفّر وقتًا وجهدًا كبيرين لاحقًا.

---

## 🧩 الخطوة الرابعة: تعريف نموذج البيانات (Model)

قبل عرض البيانات على الشاشة، يجب أن نعرّف شكلها.  
نبدأ بتعريف نوع (Interface) يمثل العالم أو المحاضر:

```typescript
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
```

### 💡 لماذا استخدمنا `Record<string, string>`؟
لأننا نريد أن نعرض النصوص بلغات مختلفة (إنجليزية/عربية).  
مثلًا:
```js
name = { en: "Ibn Taymiyyah", ar: "ابن تيمية" }
```

---

## 📚 الخطوة الخامسة: مصدر البيانات (Data Source)

البيانات ستكون ثابتة داخل المشروع، لذا سنخزنها في ملفات.

```typescript
// src/data/scholars/index.ts
import { comparativeReligionScholars } from "./comparative-religion";
// ... استيراد بقية التصنيفات

export const allScholars = [
  ...comparativeReligionScholars,
  // ...
];
```

ثم نُصدّرها في ملف واحد:
```typescript
// src/data/scholars.ts
import { allScholars } from './scholars/index';
import { Scholar } from '../types';

export const scholars: Scholar[] = [
  ...allScholars
];
```

---

## 🏗️ الخطوة السادسة: نظام التخطيط (Layout System)

في Next.js، نظام الـ Layout يسمح لك بإنشاء هيكل عام لجميع الصفحات (رأس، تذييل، محتوى).  
وهو يتكوّن من ثلاث طبقات رئيسية:

1. **RootLayout** – الهيكل الجذر للموقع بالكامل.  
2. **LocaleLayout** – يُحمّل الترجمة والسمات (Theme).  
3. **PageLayout** – المظهر البصري للصفحات (Header/Footer).

---

### 🔹 RootLayout

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { dir } from "i18next";

export const metadata: Metadata = {
  title: "Voices of Truth",
  description: "A directory of scholars and preachers.",
};

export default async function RootLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} dir={dir(locale)}>
      <body>{children}</body>
    </html>
  );
}
```

🧠 **شرح للمبتدئ:**
- هذا هو المكوّن الذي يلتف حول كل صفحات الموقع.  
- يحدد لغة الصفحة واتجاه النص (من اليمين أو اليسار).  
- لا يمكن استخدام الـ Hooks هنا لأنه **Server Component**.

---

### 🔹 LocaleLayout

```tsx
// src/app/[locale]/layout.tsx
import { getTranslation } from '../../lib/i18n';
import I18nProviderClient from '@/components/I18nProviderClient';
import ThemeProvider from '@/components/ThemeProvider';
import PageLayout from '@/components/PageLayout';

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { resources } = await getTranslation(locale);

  return (
    <I18nProviderClient locale={locale} resources={resources}>
      <ThemeProvider>
        <PageLayout>{children}</PageLayout>
      </ThemeProvider>
    </I18nProviderClient>
  );
}
```

💡 هذا الملف:
- يجلب ملفات الترجمة المناسبة.
- يوفّر سياقات (context) اللغة والثيم.
- يغلّف الصفحات بمكوّن **PageLayout** الذي يحتوي على التصميم العام.

---

### 🔹 PageLayout (الواجهة الفعلية)

```tsx
// src/components/PageLayout.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const changeLang = (newLang: string) => {
    if (i18n.language === newLang) return;
    const newPath = pathname.replace(`/${i18n.language}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex justify-between">
          <h1>{t('headerTitle')}</h1>
          <div className="flex space-x-2">
            <button onClick={() => changeLang('en')}>EN</button>
            <button onClick={() => changeLang('ar')}>AR</button>
            <button onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow p-6">{children}</main>
      <footer className="p-4 bg-gray-100 dark:bg-gray-800 text-center">
        <p>{t('footerText')}</p>
      </footer>
    </div>
  );
};

export default PageLayout;
```

🧠 **أفكار مهمة:**
- `"use client"` ضروري لاستخدام الـ Hooks.
- نستخدم `useState` لتبديل الثيم.
- نستخدم `useEffect` لضبط الثيم عند أول تحميل.
- نستخدم `useTranslation` لجلب النصوص المترجمة.

---

## 🌐 الخطوة السابعة: دعم الترجمة (i18n)

الترجمة تتم عبر مكتبتين:  
- **i18next** لإدارة النصوص.
- **react-i18next** لربطها بـ React.

المكوّن الوسيط بين الخادم والمتصفح هو:

```tsx
// src/components/I18nProviderClient.tsx
'use client';
import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLng, supportedLngs, defaultNS } from '../lib/i18n';

export default function I18nProviderClient({ children, locale, resources }: {
  children: React.ReactNode;
  locale: string;
  resources: any;
}) {
  const i18n = createInstance();
  i18n.use(initReactI18next).init({
    supportedLngs,
    fallbackLng,
    lng: locale,
    ns: defaultNS,
    defaultNS,
    resources,
  });
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

---

## 🧠 الخلاصة

في هذا الدليل تعلّمت كيف:
1. تُنشئ مشروع Next.js من الصفر.
2. تنظّم المجلدات بشكل احترافي.
3. تفهم الفرق بين Server وClient Components.
4. تُنشئ نظام ترجمة متعدد اللغات.
5. تضيف الثيم الداكن والفاتح بطريقة ذكية.
6. تُنشئ Layout شامل يربط جميع الصفحات.

---

## 🎯 مهمتك القادمة

افتح مكونات **FilterBar** و**ScholarList** وشاهد بنفسك كيف تنتقل القيم من المكوّن إلى السيرفر والعكس.  
كل تفاعل في الصفحة (اختيار بلد أو فئة) يُرسل طلبًا جديدًا للخادم لتصفية البيانات، ثم يعيد تحميل الجزء المطلوب فقط من الصفحة — وهذا هو جوهر Next.js الحديث.

---

✍️ **تذكّر:**  
الاحتراف لا يأتي من نسخ الأكواد، بل من فهم "لماذا" صُمّمت بهذا الشكل.  
اقرأ كل سطر كما لو أنك ستشرحه لشخص آخر.

---

> هذا المستند محدث ليتوافق مع Next.js 15 وما بعدها، مع استخدام TypeScript وApp Router وTailwindCSS.
