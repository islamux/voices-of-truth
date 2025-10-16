# 🧭 Complete Guide: Adding an API Server and Integrating It with Next.js

> This guide walks you through **migrating from local data files to a real API architecture**,  
> step by step — starting with Next.js API routes, then optionally adding an Express server,  
> and finally integrating a PostgreSQL database using Prisma.

---

## ⚙️ Phase 1: Building an API Inside Next.js

### 🎯 Why This Change?

- 🧩 **Separation of Concerns:** Split frontend UI from backend logic.  
- ⚡ **Improved Performance:** Fetch data dynamically without full-page reloads.  
- 🔁 **Scalability:** Your API can later power mobile apps or admin dashboards.

---

### 🛠️ Create the API Endpoint

Create a new file:

```typescript
// src/app/api/scholars/route.ts
import { NextResponse } from 'next/server';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { Scholar } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const country = searchParams.get('country');
  const lang = searchParams.get('lang');
  const category = searchParams.get('category');

  const searchQuery = query.toLowerCase();

  const filteredScholars = scholars.filter(scholar => {
    const matchSearch =
      scholar.name.en.toLowerCase().includes(searchQuery) ||
      scholar.name.ar.toLowerCase().includes(searchQuery);

    const countryId = country ? countries.find(c => c.en === country)?.id : undefined;
    const matchCountry = country ? scholar.countryId === countryId : true;

    const matchesLang = lang ? scholar.language.includes(lang) : true;

    const categoryId = category ? specializations.find(s => s.en === category)?.id : undefined;
    const matchesCategory = category ? scholar.categoryId === categoryId : true;

    return matchSearch && matchCountry && matchesLang && matchesCategory;
  });

  return NextResponse.json(filteredScholars as Scholar[]);
}
````

🧪 Test it at:

```
http://localhost:3000/api/scholars
```

---

### 🧠 Client-Side Fetching (Recommended: SWR)

```tsx
"use client";
import { useState, useCallback } from 'react';
import useSWR from 'swr';
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";
import ScholarCardSkeleton from '@/components/ScholarCardSkeleton';
import { Scholar } from "@/types";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const HomePageClient = ({ uniqueCountries, uniqueLanguages, uniqueCategories }: any) => {
  const [filters, setFilters] = useState({ query: '', country: '', lang: '', category: '' });
  const params = new URLSearchParams(filters);
  const { data: scholars, error, isLoading } = useSWR<Scholar[]>(`/api/scholars?${params}`, fetcher);

  const handleFilterChange = useCallback((name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  if (error) return <div>Failed to load scholars.</div>;

  return (
    <div className="space-y-8">
      <FilterBar
        onCountryChange={v => handleFilterChange("country", v)}
        onCategoryChange={v => handleFilterChange("category", v)}
        onLanguageChange={v => handleFilterChange("lang", v)}
        onSearchChange={v => handleFilterChange("query", v)}
      />
      {isLoading
        ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ScholarCardSkeleton key={i} />)}
          </div>
        : <ScholarList scholars={scholars || []} countries={uniqueCountries} />
      }
    </div>
  );
};
export default HomePageClient;
```

> ✅ **Tip:**
> The `SWR` library from Vercel provides caching, auto revalidation, and error handling out of the box — making it ideal for production.

---

## 🧩 Phase 2: Adding a Dedicated Express Server (Optional)

If you need a standalone backend (for example, to serve data to multiple apps or perform heavier tasks),
you can add a lightweight **Node.js Express** server.

---

### 📦 Setup the Server Project

```bash
mkdir server && cd server
npm init -y
pnpm add express cors
pnpm add -D nodemon
```

---

### 📜 Create the Server File

```javascript
// server/index.js
const express = require('express');
const cors = require('cors');
const { scholars } = require('../src/data/scholars');
const { countries } = require('../src/data/countries');
const { specializations } = require('../src/data/specializations');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

app.get('/api/scholars', (_, res) => res.json(scholars));
app.get('/api/countries', (_, res) => res.json(countries));
app.get('/api/specializations', (_, res) => res.json(specializations));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
```

Add this to `server/package.json`:

```json
"scripts": {
  "dev": "nodemon index.js"
}
```

Then run:

```bash
pnpm dev
```

> 🔗 Update your fetch calls:
>
> ```typescript
> fetch('http://localhost:3001/api/scholars')
> ```

---

## 🗄️ Phase 3: Connecting to a Real Database (Prisma + PostgreSQL)

### 🎯 Why Use a Database?

* Update data without redeploying the app.
* Handle thousands of records efficiently.
* Maintain a **single source of truth** for all data.

---

### 🧱 Set Up PostgreSQL with Docker

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    restart: always
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=voices_of_truth
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Then run:

```bash
docker-compose up -d
```

---

### ⚙️ Initialize Prisma

```bash
pnpm add @prisma/client
pnpm add prisma -D
pnpm prisma init --datasource-provider postgresql
```

In your `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/voices_of_truth"
```

---

### 🧬 Define Your Schema

Open `prisma/schema.prisma`:

```prisma
model Scholar {
  id           Int      @id @default(autoincrement())
  name         Json
  bio          Json?
  avatarUrl    String
  language     String[]
  socialMedia  Json     @default("[]")
  country      Country  @relation(fields: [countryId], references: [id])
  countryId    Int
  category     Category @relation(fields: [categoryId], references: [id])
  categoryId   Int
}

model Country {
  id       Int       @id @default(autoincrement())
  en       String
  ar       String
  scholars Scholar[]
}

model Category {
  id       Int       @id @default(autoincrement())
  en       String
  ar       String
  scholars Scholar[]
}
```

Run your migration:

```bash
pnpm prisma migrate dev --name "initial-schema"
```

---

### 🌐 Create the API Route Using Prisma

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const scholars = await prisma.scholar.findMany({
      include: { country: true, category: true },
    });
    return NextResponse.json(scholars);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
```

You can test it at:

```
http://localhost:3000/api/scholars
```

---

## 🏁 Summary

| Phase                  | Technology       | Purpose                   |
| ---------------------- | ---------------- | ------------------------- |
| 1️⃣ Next.js API Routes | Built-in backend | Simplicity & performance  |
| 2️⃣ Express Server     | Node.js + CORS   | Scalability & flexibility |
| 3️⃣ Prisma Database    | PostgreSQL       | Dynamic, persistent data  |

---

