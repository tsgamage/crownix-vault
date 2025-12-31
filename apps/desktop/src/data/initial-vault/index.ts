import type { IVault } from "@/utils/types/vault";
import { MOCK_PASSWORD_CATEGORIES } from "./password-categories";
import { MOCK_PASSWORD_ITEMS } from "./passwords";
import { VaultSettings } from "./settings";

export const InitialVault: IVault = {
  passwordItems: MOCK_PASSWORD_ITEMS,
  passwordCategories: MOCK_PASSWORD_CATEGORIES,
  settings: VaultSettings,
};
