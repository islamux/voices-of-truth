import { useSyncExternalStore } from 'react';

export function useHasMounted() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}
