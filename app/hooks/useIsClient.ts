import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` saat SSR & hydration, `true` setelahnya. Pengganti pola
 * `useEffect(() => setMounted(true), [])` tanpa render berantai.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
