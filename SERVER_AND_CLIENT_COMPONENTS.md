# Guide: Server Components vs. Client Components in Next.js

This guide explains the difference between Server and Client Components, when to use each, and how the `"use server"` directive for Server Actions fits in.

---

## The Two Types of Components

In the Next.js App Router, components are divided into two main types. This model helps you build faster, more efficient applications by separating static, non-interactive content from dynamic, interactive content.

### 1. Server Components (The Default)

**What are they?**
Server Components run **only on the server**. Their code is never sent to the browser. They are the default component type in the `app` directory.

**Why use them?**
*   **Performance:** They don't add to your client-side JavaScript bundle size. This means a faster initial page load for the user.
*   **Direct Data Access:** They can directly access server-side resources like databases, file systems, or external APIs without needing a separate `fetch` call from the client.
*   **Security:** You can use sensitive keys and logic (e.g., API keys) directly in the component without exposing them to the browser.

**How to use them in this project?**
You are already using them! Any component inside the `app` directory that **does not** have the `"use client"` directive is a Server Component.

**Example:** `src/app/[locale]/page.tsx`
This component is a Server Component. It's perfect for this role because its main job is to set up the page structure and render the `HomePageClient`, which handles the interactivity.

```tsx
// src/app/[locale]/page.tsx

// This is a Server Component by default.
// Its code will not be sent to the browser.

import HomePageClient from "./HomePageClient";

export default function Home() {
  // It can fetch data directly here if needed
  // and pass it down to client components.
  return <HomePageClient />;
}
```

---

### 2. Client Components (`"use client"`)

**What are they?**
Client Components are rendered on the server for the initial load (SSR), but their code is also sent to the browser. On the client, they are "hydrated" to become fully interactive.

**Why use them?**
You **must** use a Client Component if it uses any of the following:
*   **Interactivity and Event Listeners:** `onClick()`, `onChange()`, etc.
*   **State and Lifecycle Hooks:** `useState()`, `useEffect()`, `useReducer()`, etc.
*   **Browser-only APIs:** `window`, `localStorage`, `navigator`.
*   **Custom Hooks** that depend on any of the above (like your `useScholars` hook).

**How to use them in this project?**
You declare a Client Component by placing the `"use client"` directive at the very top of the file.

**Example:** `src/app/[locale]/HomePageClient.tsx`
This is a perfect example of a Client Component. It needs to manage the state of the filters and handle user input, so it must be a Client Component.

```tsx
// src/app/[locale]/HomePageClient.tsx
"use client"; // This directive makes it a Client Component

import { useScholars } from "@/app/hooks/useScholars";
import FilterBar from "@/components/FilterBar";
import ScholarList from "@/components/ScholarList";

export default function HomePageClient() {
  // It uses a custom hook with useState and useMemo, so it must be a client component.
  const { filteredScholars, ... } = useScholars();

  return (
    <div>
      <FilterBar ... />
      <ScholarList ... />
    </div>
  );
}
```

---

### 3. Server Actions (`"use server"`)

**What are they?**
Server Actions are functions that you can write to let your Client Components directly call server-side code. They are the recommended way to handle data mutations (like form submissions) triggered by user interaction.

**Why use them?**
They eliminate the need to manually create API endpoints for every server-side task. You can define a function on the server and securely call it from the client.

**How to implement them?**
You can define a Server Action in two ways:
1.  Inside a Server Component.
2.  In a separate file with `"use server"` at the top.

Here's a hypothetical example for your project: adding a feature to "favorite" a scholar.

**Step A: Define the action in a Server Component.**

```tsx
// In a Server Component, e.g., `src/app/[locale]/page.tsx`

import HomePageClient from "./HomePageClient";

export default function Home() {

  // Define the Server Action
  async function addScholarToFavorites(scholarId: string) {
    "use server"; // This marks the function as a Server Action

    // Here you would have your database logic
    // For example: await db.favorites.add({ userId: '...', scholarId });
    console.log(`Scholar ${scholarId} favorited! This log happens on the SERVER.`);
  }

  // Pass the action down to the client component as a prop
  return <HomePageClient addScholarToFavorites={addScholarToFavorites} />;
}
```

**Step B: Call the action from a Client Component.**

```tsx
// In a Client Component, e.g., inside `ScholarCard.tsx`

// Let's assume `addScholarToFavorites` was passed down as a prop

<button onClick={() => props.addScholarToFavorites(scholar.id)}>
  Favorite
</button>
```

When the user clicks the "Favorite" button, the `addScholarToFavorites` function runs on the server, not in the browser.

---

## Best Practices in Your Project

1.  **Default to Server Components:** Always start by making your components Server Components.
2.  **Keep Client Logic at the Leaves:** Only use `"use client"` on the specific components that need interactivity. Instead of making a whole layout a Client Component, extract the interactive part into its own component and use `"use client"` there. Your project already does this well by having `page.tsx` (Server) render `HomePageClient.tsx` (Client).
3.  **Fetch Data in Server Components:** Whenever possible, fetch data in a Server Component at the top of the component tree and pass it down as props to Client Components. This is more performant.
