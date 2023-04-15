import { useCallback, useEffect, useRef } from "react";

export function useSetTimeout() {
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      for (const timeout of timeouts) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const safeSetTimeout = useCallback((callback: () => void, ms: number) => {
    const timeout = setTimeout(callback, ms);

    timeoutsRef.current.push(timeout);

    return timeout;
  }, []);

  return safeSetTimeout;
}
