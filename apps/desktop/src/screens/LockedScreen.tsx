import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/session.store";
import { Lock } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LockedScreen() {
  const navigate = useNavigate();
  const isUnlocked = useSessionStore((state) => state.isUnlocked);

  useEffect(() => {
    if (isUnlocked) {
      navigate("/vault", { replace: true });
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
          <div className="mx-auto w-28 h-28 rounded-4xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-4xl shadow-md ring-1 ring-black/5">
            <Lock className="h-12 w-12" aria-hidden />
          </div>

          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vault Locked</h1>
            <p className="text-sm text-muted-foreground/80 font-normal">
              Your vault was locked due to inactivity. Please unlock to continue.
            </p>
          </div>
        </div>

        <div className="w-full">
          <Button
            type="button"
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground font-medium transition-colors"
            onClick={() => navigate("/unlock")}
            aria-label="Navigate to unlock page"
          >
            Unlock Vault
          </Button>
        </div>
      </main>
    </div>
  );
}
