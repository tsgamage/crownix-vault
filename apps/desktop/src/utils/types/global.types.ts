// --- Password Types ---
export interface IPasswordCustomField {
  id: string;
  label: string;
  type: "text" | "hidden" | "url" | "phone" | "email";
  value: string;
}

export interface IPasswordItem {
  id: string;
  title: string;
  username?: string;
  password: string;
  isDeleted: boolean;

  urls?: string[];
  icon?: string;
  notes?: string;
  fields?: IPasswordCustomField[];

  categoryId?: string;
  tags?: string[];
  isFavorite: boolean;

  createdAt: number;
  updatedAt: number;
}

export interface IPasswordCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

// --- Settings Types ---
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

export interface ISettings {}

export interface IVault {
  passwordItems: IPasswordItem[];
  passwordCategories: IPasswordCategory[];
  settings: ISettings;
}
