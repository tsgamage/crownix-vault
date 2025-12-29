import type { IVaultFile } from "@/services/vaultFile.service";
import { create } from "zustand";

interface FileStore {
  vaultFile: Uint8Array | null;
  setVaultFile: (file: Uint8Array | null) => void;

  vaultHeader: IVaultFile["header"] | undefined;
  setVaultHeader: (vaultHeader: IVaultFile["header"]) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  vaultFile: null,
  setVaultFile: (file: Uint8Array | null) => set({ vaultFile: file }),

  vaultHeader: undefined,
  setVaultHeader: (vaultHeader: IVaultFile["header"]) => set({ vaultHeader }),
}));
