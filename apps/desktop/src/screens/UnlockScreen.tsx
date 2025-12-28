import { UnlockForm } from "@/components/unlock/UnlockForm";
import { DatabaseService } from "@/services/db.service";
import { SessionService } from "@/services/session.service";
import { VaultService } from "@/services/vault.service";
import { VaultFileService } from "@/services/vaultFile.service";
import { useFileStore } from "@/store/file.store";
import { useSessionStore } from "@/store/session.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UnlockScreen() {
  const isUnlocked = useSessionStore((state) => state.isUnlocked);
  const setIsUnlocked = useSessionStore((state) => state.setIsUnlocked);
  const setVaultHeader = useSessionStore((state) => state.setVaultHeader);

  const vaultFile = useFileStore((state) => state.vaultFile);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);

  const navigate = useNavigate();

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
      const decryptedVaultFile = await VaultFileService.openVaultFile(
        password,
        vaultFile
      );
      SessionService.setKey(decryptedVaultFile.key);

      await DatabaseService.init();
      VaultService.loadVault(decryptedVaultFile.vault);

      setVaultHeader(decryptedVaultFile.header);
      setIsUnlocked(true);
    } catch (err) {
      setIsPasswordWrong(true);
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-background selection:bg-emerald-500/30"
    >
      <main className="w-full max-w-md px-6 flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Branding Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-[1.25rem] bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-md ring-1 ring-black/5">
            C
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground/80 font-normal">
              Enter your master password to unlock.
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="w-full flex flex-col items-center gap-6">
          <UnlockForm
            onUnlock={handleUnlock}
            isError={isPasswordWrong}
            setIsError={setIsPasswordWrong}
          />
        </div>
      </main>

      {/* Footer / Copyright */}
      <footer className="absolute bottom-6 text-[10px] text-muted-foreground/40 font-medium tracking-wider uppercase pointer-events-none">
        Crownix Security Systems © 2025
      </footer>
    </div>
  );
}
