import { AppRoutes } from "@/app/AppRouter";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/session.store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LockedScreen() {
  const navigate = useNavigate();
  const isUnlocked = useSessionStore((state) => state.isUnlocked);

  useEffect(() => {
    if (isUnlocked) {
      navigate(AppRoutes.vault, { replace: true });
    }
  }, [isUnlocked]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-background"
    >
      <main className="w-full max-w-md px-6 flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center gap-4">
          <img className="mx-auto w-52 h-52 object-cover" src="/app_icon.png" alt="App Icon" />

          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vault Locked</h1>
            <p className="text-sm text-muted-foreground/80 font-normal">
              Your vault was locked. Please unlock to continue.
            </p>
          </div>
        </div>

        <div className="w-full">
          <Button
            type="button"
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground font-medium transition-colors"
            onClick={() => navigate(AppRoutes.unlock, { replace: true })}
            aria-label="Navigate to unlock page"
          >
            Unlock Vault
          </Button>
        </div>
      </main>
    </div>
  );
}
