import React from "react";
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

  const {
    title,
    description,
    icon: Icon,
    buttons,
    variant = "default",
  } = config;

  return (
    <ShadcnDialog open={isOpen} onOpenChange={onClose}>
      <ShadcnDialogContent className="sm:max-w-[500px] bg-background border-border shadow-lg gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 text-center sm:text-left">
          {Icon && (
            <div
              className={cn(
                "w-10 h-10 shrink-0 rounded-full flex items-center justify-center mx-auto sm:mx-0 mt-1",
                variant === "danger"
                  ? "bg-destructive/10 text-destructive"
                  : variant === "warning"
                  ? "bg-orange-500/10 text-orange-500"
                  : variant === "success"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-primary/10 text-primary"
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          <DialogHeader className="p-0 space-y-2 mt-0">
            <DialogTitle className="text-lg leading-6">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          {buttons.map((btn, index) => (
            <Button
              key={index}
              variant={btn.variant || "default"}
              onClick={btn.onClick}
              disabled={btn.isLoading}
            >
              {btn.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {btn.label}
            </Button>
          ))}
        </DialogFooter>
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
}

// Alias for internal use to avoid naming conflict with the recursive component name if not careful
const ShadcnDialogContent = DialogContent;
