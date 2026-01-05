import { PasswordCategoryService } from "@/services/password/passwordCategory.service";
import { create } from "zustand";
import { usePasswordStore } from "./password.store";
import type { IPasswordCategory } from "@/utils/types/vault";
import { useFileStore } from "../file.store";

interface IPasswordCategoryStore {
  passwordCategories: IPasswordCategory[];
  selectedCategoryId: string | null;
  totalPasswordCategories: number;

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
  totalPasswordCategories: 0,

  refresh: () => {
    const categories = PasswordCategoryService.getAllPasswordCategories();
    set({ passwordCategories: categories });
    set({ totalPasswordCategories: categories.filter((p) => !p.isDeleted).length });
  },

  setSelectedCategoryId: (id: string | null) => {
    set({ selectedCategoryId: id });
  },

  clearSelectedCategoryId: () => {
    set({ selectedCategoryId: null });
  },

  createPasswordCategory: (category: IPasswordCategory) => {
    PasswordCategoryService.createPasswordCategory(category);
    useFileStore.getState().saveFile();
  },

  updatePasswordCategory: (category: IPasswordCategory) => {
    PasswordCategoryService.updatePasswordCategory(category);
    useFileStore.getState().saveFile();
  },

  deletePasswordCategory: (id: string) => {
    PasswordCategoryService.deletePasswordCategory(id);
    const allPasswords = usePasswordStore.getState().passwordItems;

    // Removing the deleted category from all passwords if any password is associated with it
    allPasswords.forEach((password) => {
      if (password.categoryId === id) {
        usePasswordStore.getState().updatePasswordItem({ ...password, categoryId: undefined });
      }
    });

    useFileStore.getState().saveFile();
  },
}));
