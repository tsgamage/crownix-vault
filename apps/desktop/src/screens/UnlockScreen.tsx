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

export default function UnlockScreen() {
  const navigate = useNavigate();

  const isUnlocked = useSessionStore((state) => state.isUnlocked);
  const setIsUnlocked = useSessionStore((state) => state.setIsUnlocked);

  const vaultFile = useFileStore((state) => state.vaultFile);
  const setVaultHeader = useFileStore((state) => state.setVaultHeader);
  const setVaultSettings = useSettingsStore((state) => state.setVaultSettings);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);

  useEffect(() => {
    if (!vaultFile) {
      navigate("/", { replace: true });
    }
    if (isUnlocked) {
      navigate("/vault", { replace: true });
    }
  }, [vaultFile, navigate, isUnlocked]);

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
      console.log(err);
      setIsPasswordWrong(true);
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-background "
    >
      <main className="w-full max-w-md px-6 flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Branding Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-4xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-md ring-1 ring-black/5">
            C
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground/80 font-normal">Enter your master password to unlock.</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="w-full flex flex-col items-center gap-6">
          <UnlockForm onUnlock={handleUnlock} isError={isPasswordWrong} setIsError={setIsPasswordWrong} />
        </div>
      </main>
    </div>
  );
}
