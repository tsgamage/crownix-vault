import { cn } from "@/lib/utils";
import { ChevronRightIcon, ShieldCheckIcon } from "lucide-react";

interface PasswordStrengthCardProps {
  passwordStrength: number;
}

export function PasswordStrengthCard({
  passwordStrength,
}: PasswordStrengthCardProps) {
  return (
    <div className="px-3 pt-4 animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 space-y-4 shadow-sm">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <div className="p-1.5 rounded-full bg-destructive/10">
              <ShieldCheckIcon className="w-4 h-4 text-destructive" />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-destructive">
                Security Recommendation
              </p>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                {passwordStrength}% strength
              </span>
            </div>
            <p className="text-sm text-destructive/80 leading-relaxed">
              For better security, consider using a stronger password with a mix
              of letters, numbers, and special characters.
            </p>
          </div>
        </div>

        {/* Progress bar with labels */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground font-medium">
              Password strength
            </span>
            <span className="font-semibold text-foreground">
              {passwordStrength <= 25
                ? "Weak"
                : passwordStrength <= 50
                ? "Fair"
                : passwordStrength <= 75
                ? "Good"
                : "Strong"}
            </span>
          </div>
          <div className="h-2 w-full bg-destructive/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out rounded-full",
                passwordStrength <= 25 && "bg-destructive",
                passwordStrength > 25 &&
                  passwordStrength <= 50 &&
                  "bg-orange-500/70",
                passwordStrength > 50 &&
                  passwordStrength <= 75 &&
                  "bg-yellow-500/70",
                passwordStrength > 75 && "bg-emerald-500/70"
              )}
              style={{
                width: `${passwordStrength}%`,
                boxShadow:
                  passwordStrength <= 25
                    ? "0 0 8px rgba(239,68,68,0.3)"
                    : "none",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Less secure</span>
            <span>More secure</span>
          </div>
        </div>

        {/* Action button */}
        {/*
        <div className="pt-2">
          <button
            className="inline-flex items-center gap-1 text-sm font-medium text-destructive hover:text-destructive/90 transition-colors group"
            onClick={() => {
            }}
          >
            Show password requirements
            <ChevronRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        */}
      </div>
    </div>
  );
}
