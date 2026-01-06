export type ModifierKey = "ctrl" | "shift" | "ctrl+shift";

export interface Shortcut {
  id: string;
  label: string;
  modifier: ModifierKey;
  key: string;
  disabled: boolean;
}

export interface KeyboardModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (shortcuts: Shortcut[]) => void;
  initialShortcuts?: Shortcut[];
}
