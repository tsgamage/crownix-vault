import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupButton, InputGroupAddon } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, Lock, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChangePasswordFormProps {
  onCancel: () => void;
  onSubmit: (password: string) => Promise<void>;
  isLoading: boolean;
}

export function ChangePasswordForm({ onCancel, onSubmit, isLoading }: ChangePasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) {
      setError("Please fill in both fields");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    await onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground ml-1">NEW PASSWORD</Label>
          <InputGroup className={cn(error && "border-destructive ring-destructive/20")}>
            <InputGroupAddon>
              <KeyRound className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="pl-2"
              disabled={isLoading}
            />
            <InputGroupButton onClick={() => setShowPassword(!showPassword)} type="button" tabIndex={-1}>
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </InputGroupButton>
          </InputGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground ml-1">CONFIRM PASSWORD</Label>
          <InputGroup className={cn(error && "border-destructive ring-destructive/20")}>
            <InputGroupAddon>
              <Lock className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="pl-2"
              disabled={isLoading}
            />
          </InputGroup>
        </div>

        {error && <p className="text-sm font-medium text-destructive animate-in slide-in-from-top-1">{error}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading || !password || !confirm}>
          {isLoading && <Spinner className="mr-2" />}
          {isLoading ? "Changing..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}
