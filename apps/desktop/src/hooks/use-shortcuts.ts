import { useEffect } from "react";
import { shortcutService } from "@/services/shortcut.service";

export function useShortcut(enabled: boolean, key: string, handler: () => void) {
  useEffect(() => {
    if (!enabled) return;

    shortcutService.register(key, handler);
    return () => shortcutService.unregister(key);
  }, [enabled, key, handler]);
}
