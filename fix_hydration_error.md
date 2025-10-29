### Plan to Resolve Hydration Error

1.  **Analyze the Cause**: The hydration error is occurring because the `ThemeToggle` component, which uses the `useTheme` hook from `next-themes`, renders different content on the server and the client. The server has no knowledge of the user's theme preference (stored in the client's local storage), leading to a mismatch.

2.  **Implement a Client-Side Rendering Guard**: To fix this, I will modify `src/components/ThemeToggle.tsx` to ensure the theme-dependent UI is rendered only after the component has mounted on the client. This is a standard pattern for resolving such hydration issues.
    *   Introduce a `mounted` state variable, initialized to `false`.
    *   Use a `useEffect` hook to set `mounted` to `true` after the initial render on the client.
    *   Conditionally render a placeholder or disabled button when `mounted` is `false` (i.e., on the server and during the initial client render).
    *   Render the actual theme-switching button only when `mounted` is `true`.

3.  **Verify the Fix**: After applying the changes, the hydration error should be resolved.
