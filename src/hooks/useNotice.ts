import { useCallback, useRef, useState } from "react";
import { useSetTimeout } from "./useSetTimeout";

export function useNotice() {
  const timerRef = useRef<NodeJS.Timeout | undefined>();
  const [notice, setNotice] = useState({ text: "", style: { opacity: 0 } });

  const setTimeout = useSetTimeout();

  const showNotice = useCallback(
    (text: string, duration = 2000) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setNotice({ text, style: { opacity: 1 } });
      timerRef.current = setTimeout(() => {
        setNotice({ text, style: { opacity: 0 } });
      }, duration);
    },
    [setTimeout]
  );

  return [notice, showNotice] as const;
}
