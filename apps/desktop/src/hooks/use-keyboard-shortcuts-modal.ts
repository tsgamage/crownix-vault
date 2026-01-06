import { useState } from "react";

export function useKeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    onOpenChange: setIsOpen,
  };
}
