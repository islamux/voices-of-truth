# Feature Guide: Adding a Backend Server

Hey there! As you grow as a developer, you'll find that managing data in local files, like we're doing now, has its limits. To make our app more powerful, scalable, and easier to manage, we're going to move our data to a real database and access it through a backend API.

This guide will walk you through the process, explaining each step simply.

## 1. Why Are We Doing This?

Currently, all our scholar data lives in TypeScript files inside `src/data`. This is fine for a small project, but it has drawbacks:

*   **Hard to Update:** To add or change a scholar, you have to edit a file and redeploy the entire application.
*   **Not Scalable:** If we have thousands of scholars, the initial page load will be very slow because we're sending all the data to the user at once.
*   **Limited Features:** It's difficult to implement more advanced features like user accounts, favorites, or complex filtering efficiently.

By moving to a database with an API, we gain:

*   **Dynamic Data:** We can add, update, and delete data without a new deployment.
*   **Scalability:** The database can handle millions of records, and we only fetch the data we need.
*   **Single Source of Truth:** A centralized database ensures data consistency.

## 2. Our New Tech Stack

We'll use modern, stable, and well-supported tools that integrate perfectly with our existing Next.js project.

*   **Backend:** **Next.js API Routes**. We don't need a separate server! Next.js has a built-in feature that lets us create backend API endpoints right inside our app. This is a native solution that keeps our project simple.
*   **Database:** **PostgreSQL**. A powerful and reliable open-source database that can handle anything we throw at it.
*   **ORM:** **Prisma**. An ORM (Object-Relational Mapper) is a tool that lets us write TypeScript code to talk to our database, instead of writing raw SQL. It gives us auto-completion and type safety, which means fewer bugs and faster development.

## 3. Step-by-Step Implementation Plan

Here’s how we’ll build it, one step at a time.

### Step 1: Set Up Your Database

For local development, the easiest way to run a PostgreSQL database is with Docker.

1.  Create a file named `docker-compose.yml` in the root of the project.
2.  Add this content to it:

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

3.  Run `docker-compose up -d` in your terminal to start the database server in the background.

### Step 2: Integrate Prisma

Now, let's connect Prisma to our new database.

1.  **Install Prisma:**
    ```bash
    pnpm add @prisma/client
    pnpm add prisma -D
    ```

2.  **Initialize Prisma:**
    ```bash
    pnpm prisma init --datasource-provider postgresql
    ```
    This command creates a `prisma` folder with a `schema.prisma` file and a `.env` file.

3.  **Configure the Database URL:**
    Open the `.env` file and set the `DATABASE_URL` to point to our new Docker database:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/voices_of_truth"
    ```

4.  **Define the Schema:**
    Open `prisma/schema.prisma` and replace its content with our data models. This schema is based on the types in `src/types/index.ts`.

    ```prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

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
      en       String    @map("name_en")
      ar       String    @map("name_ar")
      scholars Scholar[]
    }
    ```

### Step 3: Create and Seed the Database

1.  **Run the Migration:**
    This command will create the tables in your database based on the schema.
    ```bash
    pnpm prisma migrate dev --name "initial-schema"
    ```

2.  **(Optional, but Recommended) Seed with Initial Data:**
    We can create a script to move our existing data into the database.
    *   Create a file: `prisma/seed.ts`.
    *   Write a script to read from `src/data` and use `PrismaClient` to create the records. You can run this with `pnpm prisma db seed`.

### Step 4: Build the API Route

Now for the fun part: creating an endpoint to get our scholars.

1.  Create a new file: `src/app/api/scholars/route.ts`.
2.  Add the following code to it:

    ```typescript
    import { NextResponse } from 'next/server';
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    export async function GET(request: Request) {
      try {
        const scholars = await prisma.scholar.findMany({
          include: {
            country: true,
            category: true,
          },
        });
        return NextResponse.json(scholars);
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
      }
    }
    ```

You can now visit `http://localhost:3000/api/scholars` in your browser to see the data served from your database!

### Step 5: Update the Frontend

Finally, let's make our frontend components use this new API.

1.  **Locate Data Fetching:**
    Find the components that currently import data from `src/data`, like `HomePageClient.tsx` or `ScholarList.tsx`.

2.  **Switch to API Fetching:**
    You'll change how you get the data.

    **Before (in a Server Component):**
    ```typescript
    import { scholars } from '@/data/scholars';

    const Page = () => {
      // ... uses scholars directly
    }
    ```

    **After (in a Server Component):**
    ```typescript
    async function getScholars() {
      // URL will be the absolute path on the server
      const res = await fetch('http://localhost:3000/api/scholars', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      return res.json();
    }

    const Page = async () => {
      const scholars = await getScholars();
      // ... uses scholars fetched from the API
    }
    ```

That's the core of it! We've successfully moved from a static data system to a dynamic, database-driven one. This is a huge step forward for the project and opens the door to many new features.
