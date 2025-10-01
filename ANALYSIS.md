# [Analysis & Resolution Plan: Voices of Truth Build Error]

## 1. Vision & Tech Stack
*   **Problem:** The application builds successfully in development (`pnpm dev`) but fails during production build (`pnpm build`) with a TypeScript error: `Type 'LocaleLayoutProps' does not satisfy the constraint 'LayoutProps'`. This is due to an incompatibility in the `params` property type.
*   **Proposed Solution:** Systematically align the application's type definitions with the conventions of the installed Next.js version, focusing on how asynchronous props are handled in Server Components. The resolution will be executed in logical steps (modules) to ensure clarity and verification.
*   **Tech Stack:** Next.js (likely v15+), TypeScript, Tailwind CSS, pnpm.
*   **Applied Constraints and Preferences:** The resolution will adhere to the existing tech stack and project structure.

## 2. Core Requirements (from Fact-Finding Research)
*   **Asynchronous Props:** In recent Next.js versions (15+), Server Components within the App Router receive `params` and `searchParams` as `Promise`s, not as plain objects.
*   **Required Handling:** To access the values of these props, the component function must be declared as `async`, and the props themselves must be `await`ed.
*   **Type Mismatch:** The error `Type '{ locale: string; }' is missing the following properties from type 'Promise<any>'` is a direct symptom of this change. The code is defining `params` as a synchronous object while the underlying Next.js `LayoutProps` or `PageProps` constraint expects a `Promise`.

## 3. Prioritized Functional Modules (The Resolution Plan)
| Priority | Functional Module | Rationale (from Research) | Description (includes grouped features) |
|:---|:---|:---|:---|
| 1 | Correct Prop Typing in Layouts | The build fails first in `[locale]/layout.tsx`. The root layout `layout.tsx` will have the same error. This module fixes the entry point of the error. | 1. Modify `src/app/[locale]/layout.tsx`: Update the `LocaleLayoutProps` interface to type `params` as a `Promise`. Convert the component to an `async` function and `await` the `params` prop. <br> 2. Apply the identical fix to `src/app/layout.tsx` for the `RootLayoutProps`. |
| 2 | Correct Prop Typing in Pages | The `params` and `searchParams` props in `page.tsx` follow the same `Promise`-based convention as layouts. This must be fixed to prevent the error from appearing here next. | 1. Modify `src/app/[locale]/page.tsx`: Update the `HomePageProps` interface to type both `params` and `searchParams` as `Promise`s. Ensure the component `await`s them before use. |
| 3 | Resolve Downstream Type Errors | Fixing the top-level props will reveal other type inconsistencies that were previously masked. These must be resolved to complete the build. | 1. **Data Transformation:** The logic in `src/data/scholars.ts` for transforming raw scholar data is likely to have type errors due to incorrect assumptions about the source data. This will be corrected by ensuring the data transformation function correctly handles the input and output types. <br> 2. **Component Props:** Components like `ScholarCard.tsx` may be trying to access properties (e.g., `scholar.country`) that no longer exist after the data transformation. These components will be updated to use the correct props (e.g., `scholar.countryId` and a `countries` array). |
| 4 | Final Build & Verification | The ultimate goal is a successful production build. This module serves as the final quality gate. | 1. Execute `pnpm run build`. <br> 2. Verify that the build completes without any errors. |

---

This is the functional module roadmap for resolving the build error. Do you approve it to start building the first module: **`Correct Prop Typing in Layouts`**? I will not write any code before your approval.
