import { AppSettings, VaultSettings } from "@/data/initial-vault/settings";
import type { IAppSettings, IVaultSettings } from "@/utils/types/vault";
import { create } from "zustand";

interface ISettingsStore {
  vaultSettings: IVaultSettings;
  setVaultSettings: (newSettings: IVaultSettings) => void;

  appSettings: IAppSettings;
  setAppSettings: (newSettings: IAppSettings) => void;
}

export const useSettingsStore = create<ISettingsStore>((set) => ({
  vaultSettings: VaultSettings,
  setVaultSettings: (newSettings: IVaultSettings) => {
    set({ vaultSettings: newSettings });
  },

  appSettings: AppSettings,
  setAppSettings: (newSettings: IAppSettings) => {
    set({ appSettings: newSettings });
  },
}));
