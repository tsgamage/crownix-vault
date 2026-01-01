import { PasswordService } from "@/services/password/password.service";
import { PasswordCategoryService } from "@/services/password/passwordCategory.service";
import { VaultFileService, type IVaultFile } from "@/services/vaultFile.service";
import type { IVault } from "@/utils/types/vault";
import { create } from "zustand";
import { useSettingsStore } from "./vault/settings.store";
import { SessionService } from "@/services/session.service";
import { invoke } from "@tauri-apps/api/core";

interface FileStore {
  vaultFile: Uint8Array | null;
  setVaultFile: (file: Uint8Array | null) => void;

  vaultHeader: IVaultFile["header"] | undefined;
  setVaultHeader: (vaultHeader: IVaultFile["header"]) => void;

  vaultFilePath: string | null;
  setVaultFilePath: (vaultFilePath: string | null) => void;

  syncFile: () => void;
}

export const useFileStore = create<FileStore>((set, get) => ({
  vaultFile: null,
  setVaultFile: (file: Uint8Array | null) => set({ vaultFile: file }),

  vaultHeader: undefined,
  setVaultHeader: (vaultHeader: IVaultFile["header"]) => set({ vaultHeader }),

  vaultFilePath: null,
  setVaultFilePath: (vaultFilePath: string | null) => set({ vaultFilePath }),

  syncFile: async () => {
    console.log("Syncing file");
    const vaultHeader = get().vaultHeader;
    if (!vaultHeader) return;

    const passwordItems = PasswordService.exportPasswordItems();
    const passwordCategories = PasswordCategoryService.exportPasswordCategories();
    const vaultSettings = useSettingsStore.getState().vaultSettings;
    const vaultFilePath = get().vaultFilePath;

    const vault: IVault = {
      passwordItems,
      passwordCategories,
      settings: vaultSettings,
    };

    const key = SessionService.getKey();
    const vaultFile = await VaultFileService.buildVaultFileWithKey(vault, key, vaultHeader);

    await invoke("save_vault_file_atomic", {
      vaultPath: vaultFilePath,
      buffer: Array.from(vaultFile),
    });
  },
}));
