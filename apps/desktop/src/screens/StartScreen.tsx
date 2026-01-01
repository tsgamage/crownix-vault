import { Button } from "@/components/ui/button";
import { ArrowRightIcon, EyeIcon, EyeOffIcon, FolderIcon, ImportIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFileStore } from "@/store/file.store";
import { VaultFileService } from "@/services/vaultFile.service";
import { InitialVault } from "@/data/initial-vault";
import { invoke } from "@tauri-apps/api/core";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import type {
  CreateVaultFileResult,
  PickExistingVaultFileResult,
  PickVaultFolderResult,
} from "@/utils/types/backend.types";

export default function StartScreen() {
  const navigate = useNavigate();

  const vaultFile = useFileStore((state) => state.vaultFile);
  const setVaultFile = useFileStore((state) => state.setVaultFile);
  const vaultFilePath = useFileStore((state) => state.vaultFilePath);
  const setVaultFilePath = useFileStore((state) => state.setVaultFilePath);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (vaultFile) {
      navigate("/unlock", { replace: true });
    }
  }, [vaultFile]);

  const handleImportVault = async () => {
    const response: PickExistingVaultFileResult = await invoke("pick_existing_vault_file");
    if (!response.success) return console.log(response.message);
    if (!response.buffer) return console.log("Vault file not found");
    setVaultFilePath(response.path);
    setVaultFile(new Uint8Array(response.buffer));
    navigate("/unlock", { replace: true });
  };

  const handleSelectFolder = async () => {
    setVaultFilePath(null);
    const response: PickVaultFolderResult = await invoke("pick_vault_folder");

    if (!response.success) {
      return console.log("Folder selection failed");
    }
    if (response.found && !response.multiple) {
      return alert("Vault file found in same location, please import it by selecting import below");
    }
    if (response.found && response.multiple) {
      return alert("Multiple vault files found in same location, please import one by selecting import below");
    }

    setVaultFilePath(response.file_path);
  };

  const handleCreateVault = async () => {
    const newVaultCreateData = InitialVault;
    const newVaultBuffer = await VaultFileService.createVaultFile(password, newVaultCreateData);
    setVaultFile(newVaultBuffer);

    const response: CreateVaultFileResult = await invoke("create_vault_file", {
      filePath: vaultFilePath,
      fileName: "CrownixVault.cxv",
      buffer: Array.from(newVaultBuffer),
    });
    if (!response.success) return alert("Vault file creation failed");
    navigate("/unlock", { replace: true });
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-background"
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
    >
      <main className="w-full max-w-md px-6 flex flex-col items-center gap-10">
        {/* Branding Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-4xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-md ring-1 ring-black/5">
            C
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Crownix Vault</h1>
            <p className="text-base text-muted-foreground/80 font-normal">Your digital fortress.</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full max-w-md space-y-6">
            <Label htmlFor="folder" className="text-muted-foreground ml-1 mb-2 block">
              Master Password
            </Label>
            <InputGroup>
              <InputGroupInput
                placeholder="Enter master password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <p className="text-[11px] text-muted-foreground/60 ml-1 -mt-5 font-normal">
              This password will encrypt your local vault. Do not lose it.
            </p>

            <Label htmlFor="folder" className="text-muted-foreground ml-1 mb-2 block">
              Select a folder
            </Label>
            <InputGroup>
              <InputGroupInput placeholder={"Select a folder"} value={vaultFilePath ? vaultFilePath : ""} readOnly />
              <InputGroupAddon>
                <FolderIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton onClick={handleSelectFolder}>Browse</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            <div className={"pt-2 transition-all duration-500 delay-100"}>
              <Button
                type="submit"
                disabled={!password || !vaultFilePath}
                onClick={handleCreateVault}
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground font-medium transition-colors"
              >
                Create a new vault
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

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
              onClick={handleImportVault}
              className="h-10 px-6 rounded-lg text-sm font-medium transition-all"
            >
              <ImportIcon className="mr-2 h-4 w-4" />
              Import Existing Vault
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
