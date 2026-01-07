import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WarningStep } from "./components/WarningStep";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { KeyRound } from "lucide-react";
import { VaultFileService } from "@/services/vaultFile.service";
import type { IVault } from "@/utils/types/vault";
import { PasswordService } from "@/services/password/password.service";
import { PasswordCategoryService } from "@/services/password/passwordCategory.service";
import { useSettingsStore } from "@/store/vault/settings.store";
import { useFileStore } from "@/store/file.store";
import { AppRoutes } from "@/app/AppRouter";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PasswordChangeProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PasswordChange({ isOpen, onOpenChange }: PasswordChangeProps) {
  const navigate = useNavigate();
  const setVaultFile = useFileStore((state) => state.setVaultFile);

  const [step, setStep] = useState<"warning" | "form">("warning");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Small delay to allow close animation to finish before resetting content
      setTimeout(() => {
        setStep("warning");
        setIsLoading(false);
      }, 300);
    }
    onOpenChange(open);
  };

  const handleConfirmWarning = () => {
    setStep("form");
  };

  const handleSubmit = async (password: string) => {
    setIsLoading(true);
    try {
      const passwordItems = PasswordService.exportPasswordItems();
      const passwordCategories = PasswordCategoryService.exportPasswordCategories();
      const vaultSettings = useSettingsStore.getState().vaultSettings;

      const currentVault: IVault = {
        passwordItems,
        passwordCategories,
        settings: vaultSettings,
      };
      const bufferWithChangedPassword = await VaultFileService.createVaultFile(password, currentVault);
      setVaultFile(bufferWithChangedPassword);
      toast.success("Password changed successfully, please unlock your vault again to apply changes");
      navigate(AppRoutes.unlock, { replace: true, state: { isChangedPassword: true } });
    } catch (error) {
      console.error("Failed to change password", error);
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden bg-background border-border/50 outline-none">
        <DialogHeader className="px-6 py-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 transition-colors duration-300 rounded-lg bg-primary/10">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-lg font-semibold tracking-tight transition-all duration-300">
              Change Password
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">Process to change your vault master password.</DialogDescription>
        </DialogHeader>

        <div className="bg-card">
          {step === "warning" ? (
            <WarningStep onCancel={() => handleOpenChange(false)} onConfirm={handleConfirmWarning} />
          ) : (
            <ChangePasswordForm
              onCancel={() => handleOpenChange(false)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
