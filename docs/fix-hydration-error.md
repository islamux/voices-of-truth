### Plan to Resolve Hydration Error

> **Status:** ✅ Implemented — `ThemeToggle.tsx` uses `useHasMounted()` guard backed by `useSyncExternalStore`.

1.  **Analyze the Cause**: The hydration error is occurring because the `ThemeToggle` component, which uses the `useTheme` hook, renders different content on the server and the client. The server has no knowledge of the user's theme preference (stored in the client's local storage), leading to a mismatch.

2.  **Implement a Client-Side Rendering Guard**: To fix this, `src/components/ThemeToggle.tsx` ensures the theme-dependent UI is rendered only after the component has mounted on the client. The `useHasMounted` hook uses `useSyncExternalStore` (React 18+) to safely return `false` during SSR and `true` on the client without triggering cascading renders:
    *   `useSyncExternalStore` subscribes to an empty store (never updates) and returns `true` on the client, `false` on the server.
    *   A placeholder or disabled button is rendered when `mounted` is `false` (during SSR and initial client render).
    *   The actual theme-switching button renders only when `mounted` is `true`.

3.  **Verify the Fix**: After applying the changes, the hydration error should be resolved.
