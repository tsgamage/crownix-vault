import { Button } from "@/components/ui/button";
import { MasterPasswordForm } from "@/components/start/MasterPasswordForm";
import { DownloadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useFileStore } from "@/store/file.store";
import { VaultFileService } from "@/services/vaultFile.service";
import { MOCK_VAULT } from "@/data/seed";

export default function StartScreen() {
  const navigate = useNavigate();
  const [isLoadingImport, setIsLoadingImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const vaultFile = useFileStore((state) => state.vaultFile);
  const setVaultFile = useFileStore((state) => state.setVaultFile);

  useEffect(() => {
    if (vaultFile) {
      navigate("/unlock", { replace: true });
    }
  }, [vaultFile]);

  const handleCreateVault = async (password: string) => {
    const newVaultCreateData = MOCK_VAULT;
    const newVaultFile = await VaultFileService.createVaultFile(password, newVaultCreateData);
    setVaultFile(newVaultFile);
  };

  const handleImportVault = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-background selection:bg-emerald-500/30"
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
    >
      <main className="w-full max-w-md px-6 flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Branding Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-[1.25rem] bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-md ring-1 ring-black/5">
            C
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Crownix Vault</h1>
            <p className="text-base text-muted-foreground/80 font-normal">Your digital fortress.</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="w-full flex flex-col items-center gap-6">
          <MasterPasswordForm onCreateVault={handleCreateVault} />

          <div className="relative w-full py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground/60 font-medium tracking-wider">Or</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              onClick={isLoadingImport ? undefined : handleImportVault}
              className="h-10 px-6 rounded-lg text-sm font-medium transition-all"
            >
              {isLoadingImport ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Importing...
                </>
              ) : (
                <>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Import Existing Vault
                </>
              )}
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              accept=".cxv"
              readOnly
              className="hidden"
              onChange={async (e) => {
                setIsLoadingImport(true);

                const file = e.target.files?.[0];
                if (!file) return;
                const buffer = new Uint8Array(await file.arrayBuffer());

                setVaultFile(buffer);
                setIsLoadingImport(false);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
