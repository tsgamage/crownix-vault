import { UnlockForm } from "@/components/unlock/UnlockForm";

export default function UnlockingScreen() {
  const handleUnlock = (password: string) => {
    console.log("Unlocking vault with password:", password);
    // TODO: Implement actual unlock logic
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
          <UnlockForm onUnlock={handleUnlock} />
        </div>
      </main>

      {/* Footer / Copyright */}
      <footer className="absolute bottom-6 text-[10px] text-muted-foreground/40 font-medium tracking-wider uppercase pointer-events-none">
        Crownix Security Systems © 2025
      </footer>
    </div>
  );
}
