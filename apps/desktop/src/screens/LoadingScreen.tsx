import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Animated loader ring */}
        <div className="relative w-24 h-24">
          {/* Outer rotating ring */}
          <div
            className={cn(
              "absolute inset-0 rounded-full border-4 border-transparent",
              "border-t-primary border-r-primary/50",
              "animate-spin",
            )}
            style={{ animationDuration: "2s" }}
          />

          {/* Inner pulsing ring */}
          <div className={cn("absolute inset-2 rounded-full border-2 border-primary/30", "animate-pulse")} />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>

        {/* App name and loading text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Crownix Vault</h1>
          <p className="text-sm text-muted-foreground animate-pulse">Loading your vault...</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              style={{
                animation: `pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Subtle gradient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          style={{ animation: "float 6s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          style={{ animation: "float 8s ease-in-out infinite reverse" }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}
