import { useEffect, useState } from 'react';

/**
 * A custom hook to check if a component has mounted.
 * This is useful for avoiding hydration mismatches in Next.js when rendering
 * client-side only UI.
 *
 * @returns {boolean} - True if the component has mounted, false otherwise.
 */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
