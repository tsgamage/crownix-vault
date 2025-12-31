// --- Settings Modal Types ---
export type SettingType = "toggle" | "select" | "button" | "input" | "danger-button";

export interface SettingOption {
  label: string;
  value: string;
}

export interface SettingItem {
  id: string;
  type: SettingType;
  title: string;
  description?: string;
  value?: string | boolean;
  options?: SettingOption[];
  actionLabel?: string;
  placeholder?: string;
  danger?: boolean;
  disabled?: boolean;
}

export interface SettingsSection {
  id: string;
  title: string;
  items: SettingItem[];
}

export interface SettingsConfig {
  sections: SettingsSection[];
}

// --- Dialog Types ---
export type DialogButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export interface DialogButton {
  label: string;
  variant?: DialogButtonVariant;
  onClick: () => void;
  isLoading?: boolean;
}

export interface DialogConfig {
  title: string;
  description?: string;
  icon?: any; // Lucide icon or similar
  buttons: DialogButton[];
  variant?: "default" | "danger" | "success" | "warning"; // High-level variant for styling
  content?: React.ReactNode;
}
