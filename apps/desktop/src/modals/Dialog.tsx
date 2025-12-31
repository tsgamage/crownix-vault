import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DialogConfig } from "@/utils/types/global.types";
import { Loader2 } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: DialogConfig | null;
}

export function Dialog({ isOpen, onClose, config }: DialogProps) {
  if (!config) return null;

  const { title, description, icon: Icon, buttons, variant = "default" } = config;

  return (
    <ShadcnDialog open={isOpen} onOpenChange={onClose}>
      <ShadcnDialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              {Icon && (
                <div
                  className={cn(
                    "w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-inner transition-transform duration-300 hover:rotate-6 border",
                    variant === "danger"
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : variant === "warning"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : variant === "success"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
              )}
              <div className="space-y-1.5 flex-1 min-w-0">
                <DialogHeader className="p-0 text-left">
                  <DialogTitle className="text-xl font-bold tracking-tight text-foreground leading-tight">
                    {title}
                  </DialogTitle>
                  {description && (
                    <DialogDescription className="text-muted-foreground text-[13px] font-medium leading-relaxed opacity-80">
                      {description}
                    </DialogDescription>
                  )}
                </DialogHeader>
              </div>
            </div>

            {config.content && <div>{config.content}</div>}
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 sm:justify-end gap-3 bg-muted/5">
          {buttons.map((btn, index) => (
            <Button
              key={index}
              variant={btn.variant || "default"}
              onClick={btn.onClick}
              disabled={btn.isLoading}
              className={cn(
                "h-11 px-6 font-bold rounded-xl transition-all duration-300",
                (btn.variant === "default" || !btn.variant) &&
                  "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 ",
                btn.variant === "ghost" && "hover:bg-muted/50",
                btn.variant === "destructive" && "shadow-lg shadow-destructive/20 "
              )}
            >
              {btn.isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {btn.label}
            </Button>
          ))}
        </DialogFooter>
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
}

const ShadcnDialogContent = DialogContent;
