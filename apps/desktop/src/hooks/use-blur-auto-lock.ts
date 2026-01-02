import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useRef } from "react";

const BLUR_LOCK_DELAY = 300_000; // 5 minutes

export function useBlurAutoLock(isUnlocked: boolean, lockVault: () => void) {
  const blurTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const win = getCurrentWindow();

    const unlistenPromise = win.onFocusChanged(({ payload }) => {
      // payload === false → window lost focus
      if (!payload && isUnlocked) {
        // start delayed lock
        blurTimerRef.current = window.setTimeout(() => {
          lockVault();
        }, BLUR_LOCK_DELAY);
      }

      // payload === true → window focused again
      if (payload && blurTimerRef.current !== null) {
        clearTimeout(blurTimerRef.current);
        blurTimerRef.current = null;
      }
    });

    return () => {
      if (blurTimerRef.current !== null) {
        clearTimeout(blurTimerRef.current);
      }

      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [isUnlocked, lockVault]);
}
