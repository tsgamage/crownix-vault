import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, EyeOffIcon, EyeIcon, LockIcon } from "lucide-react";
import { useSessionStore } from "@/store/session.store";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

interface UnlockFormProps {
  isError: boolean;
  setIsError: (value: boolean) => void;
  onUnlock: (password: string) => void;
}

export function UnlockForm({ onUnlock, isError, setIsError }: UnlockFormProps) {
  const isUnlocked = useSessionStore((state) => state.isUnlocked);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const canSubmit = password.length > 0 && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);

    // Prevent spamming
    setTimeout(() => {
      onUnlock(password);
      setLoading(false);
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 50);
    }, 1000);
  };

  return (
    <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form onSubmit={isUnlocked ? undefined : handleSubmit} className="space-y-4">
        <Label htmlFor="folder" className="text-muted-foreground ml-1 mb-2 block">
          Master Password
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <LockIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            ref={passwordRef}
            id="unlock-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-9 pr-10"
            autoComplete="off"
            value={password}
            onBlur={() => {
              setIsError(false);
            }}
            onChange={(e) => {
              setIsError(false);
              setPassword(e.target.value);
            }}
            aria-invalid={isError}
            disabled={loading || isUnlocked}
            autoFocus
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton tabIndex={-1} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <Button
          type="submit"
          className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground font-medium transition-colors"
          disabled={!canSubmit || loading || isUnlocked}
        >
          {loading || isUnlocked ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              Unlock Vault
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
