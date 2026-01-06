import { UnlockForm } from "@/components/unlock/UnlockForm";
import { DatabaseService } from "@/services/db.service";
import { SessionService } from "@/services/session.service";
import { PasswordService } from "@/services/password/password.service";
import { PasswordCategoryService } from "@/services/password/passwordCategory.service";
import { VaultFileService } from "@/services/vaultFile.service";
import { useFileStore } from "@/store/file.store";
import { useSessionStore } from "@/store/session.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IVault } from "@/utils/types/vault";
import { useSettingsStore } from "@/store/vault/settings.store";
import { invoke } from "@tauri-apps/api/core";
import type { AutoLoadVaultResult, LoadAppSettingsResult } from "@/utils/types/backend.types";
import { Button } from "@/components/ui/button";
import { ask } from "@tauri-apps/plugin-dialog";
import { AppRoutes } from "@/app/AppRouter";

export default function UnlockScreen() {
  const navigate = useNavigate();

  const isUnlocked = useSessionStore((state) => state.isUnlocked);
  const setIsUnlocked = useSessionStore((state) => state.setIsUnlocked);

  const vaultFile = useFileStore((state) => state.vaultFile);
  const setVaultFile = useFileStore((state) => state.setVaultFile);
  const setVaultHeader = useFileStore((state) => state.setVaultHeader);
  const setVaultFilePath = useFileStore((state) => state.setVaultFilePath);
  const setVaultSettings = useSettingsStore((state) => state.setVaultSettings);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [isCheckingAutoLoadVault, setIsCheckingAutoLoadVault] = useState(true);

  const setAppSettings = useSettingsStore((state) => state.setAppSettings);

  useEffect(() => {
    if (isUnlocked) {
      navigate(AppRoutes.vault, { replace: true });
    }
  }, [navigate, isUnlocked]);

  useEffect(() => {
    const autoLoadVault = async () => {
      setIsCheckingAutoLoadVault(true);
      const response: AutoLoadVaultResult = await invoke("auto_load_vault");
      setIsCheckingAutoLoadVault(false);
      if (response.success) {
        setVaultFilePath(response.path);
        setVaultFile(new Uint8Array(response.buffer));
      } else if (response.backup) {
        navigate(AppRoutes.setup, { replace: true, state: { isBackup: true } });
      } else {
        await invoke("clear_vault_config");
        navigate(AppRoutes.setup, { replace: true });
      }
    };
    autoLoadVault();
  }, []);

  const handleUnlock = async (password: string) => {
    if (!vaultFile) return;

    try {
      const decryptedVaultFile = await VaultFileService.openVaultFile(password, vaultFile);
      SessionService.setKey(decryptedVaultFile.key);

      const vault: IVault = decryptedVaultFile.vault;

      await DatabaseService.init();

      PasswordService.loadPasswordItems(vault.passwordItems);
      PasswordCategoryService.loadPasswordCategories(vault.passwordCategories);
      setVaultSettings(vault.settings);

      setVaultHeader(decryptedVaultFile.header);
      setIsUnlocked(true);
    } catch (err) {
      setIsPasswordWrong(true);
    }

    const appSettingsResponse: LoadAppSettingsResult = await invoke("load_app_settings");
    if (appSettingsResponse.success) {
      setAppSettings(appSettingsResponse.data);
    }
  };

  const handleChangeVaultFile = async () => {
    const result = await ask("Are you sure you want to change the vault file?", {
      title: "Change vault file",
      kind: "warning",
    });

    if (result) {
      await invoke("clear_vault_config");
      setVaultFile(null);
      setVaultFilePath(null);
      navigate(AppRoutes.setup, { replace: true });
    }
  };

  if (isCheckingAutoLoadVault) return null;

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      className="min-h-screen -mt-5 w-full flex flex-col items-center justify-center bg-background "
    >
      <main className="w-full max-w-md px-6 flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <img className="mx-auto w-32 h-32 object-cover" src="/app_icon.png" alt="App Icon" />

          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground/80 font-normal">Enter your master password to unlock.</p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <UnlockForm onUnlock={handleUnlock} isError={isPasswordWrong} setIsError={setIsPasswordWrong} />
        </div>
      </main>
      <div tabIndex={-1} className="absolute bottom-6 flex w-full max-w-md px-6 flex-col border-t border-border pt-5">
        <Button
          tabIndex={-1}
          variant="link"
          className="w-full cursor-pointer justify-center gap-2"
          onClick={handleChangeVaultFile}
        >
          Change vault file
        </Button>
      </div>
    </div>
  );
}
