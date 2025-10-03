# TypeScript Error Fix for `page.tsx`

Here's a breakdown of the TypeScript error and the steps to fix it.

## The Problem

The error `Type 'Country' is not assignable to type '{ id: number; name: { en: string; ar: string; }; }'` occurs because of a mismatch between the `Country` type defined in `src/types/index.ts` and the type inferred by TypeScript from the `countries` data in `src/data/countries.ts`.

1.  **In `src/types/index.ts`**, the `Country` interface defines the `name` property as `Record<string, string>`, which is a generic object with string keys and values.
2.  **In `src/data/countries.ts`**, the `countries` array is defined with objects where the `name` property is specifically `{ en: string; ar: string; }`. TypeScript infers this more specific type.
3.  **In `src/app/[locale]/page.tsx`**, when you use `countries.find(...)`, the returned type has the specific `name` type. The type guard `.filter((country): country is Country => ...)` then fails because the `Country` type (with `Record<string, string>`) is not assignable to the more specific, inferred type (with `{ en: string; ar: string; }`).

## The Solution

The solution involves two main changes:

1.  **Update Type Definitions:** Make the `Country` and `Specialization` interfaces in `src/types/index.ts` match the actual data structure.
2.  **Handle Dynamic Access:** Adjust the code in `src/app/[locale]/page.tsx` to correctly handle accessing the `name` property with a dynamic `locale` key.

### Step 1: Update `src/types/index.ts`

I will modify the `Country` and `Specialization` interfaces to have a specific `name` property. This change makes the type definitions accurate and resolves the original error in the `filter` type guard.

### Step 2: Update `src/app/[locale]/page.tsx`

After updating the types, TypeScript will complain about `country.name[locale]` because `locale` is a `string` and cannot be used to index a type that doesn't have a string index signature. To fix this, I will cast the `name` property to `Record<string, string>` when accessing it with the dynamic `locale` variable. This tells TypeScript that `locale` will be a valid key for the `name` object.
