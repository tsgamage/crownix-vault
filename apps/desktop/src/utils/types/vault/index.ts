import type { IPasswordCategory } from "./password-category.types";
import type { IPasswordItem } from "./password.types";
import type { IVaultSettings } from "./settings.types";

export interface IVault {
  passwordItems: IPasswordItem[];
  passwordCategories: IPasswordCategory[];
  settings: IVaultSettings;
}

export * from "./password-category.types";
export * from "./password.types";
export * from "./settings.types";
