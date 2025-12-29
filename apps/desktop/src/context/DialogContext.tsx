import React, { createContext, useContext, useState, useCallback } from "react";
import { Dialog } from "@/modals/Dialog";
import type { DialogConfig } from "@/utils/types/global.types";

interface DialogContextType {
  openDialog: (config: DialogConfig) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);

  const openDialog = useCallback((newConfig: DialogConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    // Optional: Clear config after animation
    setTimeout(() => setConfig(null), 300);
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog isOpen={isOpen} onClose={closeDialog} config={config} />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
