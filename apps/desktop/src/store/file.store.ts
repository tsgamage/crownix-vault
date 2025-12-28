import { create } from "zustand";

interface FileStore {
  vaultFile: Uint8Array | null;
  setVaultFile: (file: Uint8Array | null) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  vaultFile: null,
  setVaultFile: (file: Uint8Array | null) => set({ vaultFile: file }),
}));
