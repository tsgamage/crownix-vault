import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface FixSecurityIssueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export function FixSecurityIssueDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Update Password Required",
  description,
  itemName,
}: FixSecurityIssueDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 border border-primary/10 transition-colors shadow-inner">
            <AlertTriangle className="size-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-center text-xl font-bold tracking-tight">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4 pt-2">
            {itemName && (
              <p className="font-bold text-foreground bg-muted p-2 rounded-xl inline-block shadow-inner text-sm px-4">
                {itemName}
              </p>
            )}
            <p className="text-muted-foreground leading-relaxed text-[13px] font-medium px-2">
              {description || (
                <>
                  To maintain your security, you must update this password on the service provider's website{" "}
                  <span className="text-primary font-bold underline underline-offset-4 decoration-primary/30">
                    before
                  </span>{" "}
                  changing it in your vault.
                </>
              )}
            </p>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl text-[11px] text-primary/80 flex gap-3 items-start text-left shadow-xs">
              <ExternalLink className="size-4 mt-0.5 shrink-0" />
              <span className="leading-normal font-semibold">
                Updating only in the vault without changing it on the service will cause you to lose access to your
                account.
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col gap-2 mt-6">
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
          >
            I've Updated on Service
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={onClose}
            className="w-full h-11 border-none hover:bg-muted font-bold rounded-xl transition-colors"
          >
            Go Back
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
