import type { IAppSettings, IVaultSettings } from "@/utils/types/vault";

export const VaultSettings: IVaultSettings = {
  vaultName: "Crownix Vault",
  isNewUser: true,
};

export const AppSettings: IAppSettings = {
  appName: "Crownix Vault",
  appVersion: "1.0.0",
  language: "en",
  defaultGroupBy: "none",
  defaultSortBy: "name",
  autoLock: true,
};
