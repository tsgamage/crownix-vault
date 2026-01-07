import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface WarningStepProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function WarningStep({ onCancel, onConfirm }: WarningStepProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/20">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Change Vault Password?</h3>
        <p className="text-sm text-muted-foreground max-w-[320px] leading-relaxed mx-auto">
          Are you sure you really want to do this? Changing your password is a critical action. Ensure you remember the
          new password.
        </p>
      </div>

      <div className="flex w-full gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={"destructive"} className="flex-1" onClick={onConfirm}>
          Yes, Continue
        </Button>
      </div>
    </div>
  );
}
