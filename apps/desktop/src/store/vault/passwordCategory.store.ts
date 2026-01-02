import { PasswordCategoryService } from "@/services/password/passwordCategory.service";
import { create } from "zustand";
import { useUiStore } from "../ui.store";
import { usePasswordStore } from "./password.store";
import type { IPasswordCategory } from "@/utils/types/vault";

interface IPasswordCategoryStore {
  passwordCategories: IPasswordCategory[];
  selectedCategoryId: string | null;

  refresh: () => void;
  setSelectedCategoryId: (id: string | null) => void;
  clearSelectedCategoryId: () => void;

  createPasswordCategory: (category: IPasswordCategory) => void;
  updatePasswordCategory: (category: IPasswordCategory) => void;
  deletePasswordCategory: (id: string) => void;
}
export const usePasswordCategoryStore = create<IPasswordCategoryStore>((set) => ({
  passwordCategories: [],
  selectedCategoryId: null,

  refresh: () => {
    const categories = PasswordCategoryService.getAllPasswordCategories();
    set({ passwordCategories: categories });
  },

  setSelectedCategoryId: (id: string | null) => {
    set({ selectedCategoryId: id });
  },

  clearSelectedCategoryId: () => {
    set({ selectedCategoryId: null });
  },

  createPasswordCategory: (category: IPasswordCategory) => {
    PasswordCategoryService.createPasswordCategory(category);
    useUiStore.getState().syncDB();
  },

  updatePasswordCategory: (category: IPasswordCategory) => {
    PasswordCategoryService.updatePasswordCategory(category);
    useUiStore.getState().syncDB();
  },

  deletePasswordCategory: (id: string) => {
    PasswordCategoryService.deletePasswordCategory(id);
    const allPasswords = usePasswordStore.getState().passwordItems;

    allPasswords.forEach((password) => {
      if (password.categoryId === id) {
        usePasswordStore.getState().updatePasswordItem({ ...password, categoryId: undefined });
      }
    });

    useUiStore.getState().syncDB();
  },
}));
