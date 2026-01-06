import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShortcutList } from "./components/ShortcutList";
import type { Shortcut } from "./types";
import { Keyboard as KeyboardIcon } from "lucide-react";

const DUMMY_SHORTCUTS: Shortcut[] = [
  { id: "1", label: "All Passwords", modifier: "ctrl", key: "A", disabled: false },
  { id: "2", label: "Favorites", modifier: "ctrl", key: "F", disabled: false },
  { id: "3", label: "Organize", modifier: "ctrl", key: "D", disabled: false },
  { id: "4", label: "Trash", modifier: "ctrl", key: "T", disabled: false },
  { id: "5", label: "Security Dashboard", modifier: "ctrl", key: "E", disabled: false },
  { id: "6", label: "Tools", modifier: "ctrl", key: "Q", disabled: false },
  { id: "7", label: "Add New Password / Category", modifier: "ctrl", key: "N", disabled: false },
  { id: "8", label: "Lock Vault", modifier: "ctrl", key: "L", disabled: false },
  { id: "9", label: "Save Vault", modifier: "ctrl", key: "S", disabled: false },
  { id: "10", label: "Open Settings", modifier: "ctrl", key: ",", disabled: false },
];

export interface KeyboardModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (shortcuts: Shortcut[]) => void;
  initialShortcuts?: Shortcut[];
}

export default function KeyboardModal({ isOpen, onOpenChange, onSave, initialShortcuts }: KeyboardModalProps) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(initialShortcuts || DUMMY_SHORTCUTS);

  useEffect(() => {
    if (initialShortcuts) {
      setShortcuts(initialShortcuts);
    }
  }, [initialShortcuts]);

  const handleUpdateShortcut = (updated: Shortcut) => {
    setShortcuts((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSave = () => {
    onSave?.(shortcuts);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 py-6 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-sm mt-1">
              <KeyboardIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold tracking-tight">Keyboard Shortcuts</DialogTitle>
              <DialogDescription className="text-destructive">
                Sorry! Currently you cannot change any shortcut. This feature will be available in the next update.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 bg-card/50">
          <ShortcutList shortcuts={shortcuts} onUpdateShortcut={handleUpdateShortcut} />
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant={"default"}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
