import { Button } from "@/components/ui/button";
import { MasterPasswordForm } from "@/components/start/MasterPasswordForm";
import { Download } from "lucide-react";

export default function StartScreen() {
  const handleCreateVault = (password: string) => {
    console.log("Creating vault with password length:", password.length);
    // TODO: Implement actual vault creation logic
  };

  const handleImportVault = () => {
    console.log("Importing existing vault...");
    // TODO: Implement import logic
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background selection:bg-emerald-500/30">
      <main className="w-full max-w-md px-6 flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Branding Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-[1.25rem] bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-md ring-1 ring-black/5">
            C
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Crownix Vault
            </h1>
            <p className="text-base text-muted-foreground/80 font-normal">
              Your digital fortress.
            </p>
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
              <span className="bg-background px-3 text-muted-foreground/60 font-medium tracking-wider">
                Or
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              onClick={handleImportVault}
              className="h-10 px-6 rounded-lg text-sm font-medium transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Import Existing Vault
            </Button>
          </div>
        </div>
      </main>

      {/* Footer / Copyright */}
      <footer className="absolute bottom-6 text-[10px] text-muted-foreground/40 font-medium tracking-wider uppercase pointer-events-none">
        Crownix Security Systems © 2025
      </footer>
    </div>
  );
}
