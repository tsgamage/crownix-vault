import type { IVaultFile } from "@/services/vaultFile.service";
import { create } from "zustand";

interface ISessionStore {
  isUnlocked: boolean;
  setIsUnlocked: (isUnlocked: boolean) => void;

  vaultHeader: IVaultFile["header"] | undefined;
  setVaultHeader: (vaultHeader: IVaultFile["header"]) => void;
}

export const useSessionStore = create<ISessionStore>((set) => ({
  isUnlocked: false,
  setIsUnlocked: (isUnlocked: boolean) => set({ isUnlocked }),

  vaultHeader: undefined,
  setVaultHeader: (vaultHeader: IVaultFile["header"]) => set({ vaultHeader }),
}));
