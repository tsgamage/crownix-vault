import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MasterPasswordFormProps {
  onCreateVault: (password: string) => void;
}

export function MasterPasswordForm({ onCreateVault }: MasterPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const showConfirm = password.length > 0;
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit = passwordsMatch && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setLoading(true);
    // Simulate async operation for effect
    setTimeout(() => {
      onCreateVault(password);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="master-password"
            className="text-muted-foreground ml-1 mb-2 block"
          >
            Master Password
          </Label>
          <div className="relative">
            <Input
              id="master-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter master password"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-10 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground/60 ml-1 mt-1.5 font-normal">
            This password will encrypt your local vault. Do not lose it.
          </p>
        </div>

        <div
          className={cn(
            "space-y-2 overflow-hidden transition-all duration-500 ease-in-out",
            showConfirm ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <Label
            htmlFor="confirm-password"
            className="text-muted-foreground ml-1 mb-2 block"
          >
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Re-enter password"
            className="pr-10 mb-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div
          className={cn(
            "transition-all duration-500 ease-in-out",
            showConfirm
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5 pointer-events-none"
          )}
        >
          <Alert variant="destructive" className="py-2.5">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>No Recovery Option</AlertTitle>
            <AlertDescription className="text-xs mt-0.5">
              If you lose this password, your data cannot be recovered.
            </AlertDescription>
          </Alert>
        </div>

        <div
          className={cn(
            "pt-2 transition-all duration-500 delay-100",
            passwordsMatch
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <Button
            type="submit"
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground font-medium transition-colors"
            disabled={!canSubmit}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Create Vault
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
