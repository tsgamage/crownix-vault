import { PasswordCategoryService } from "@/services/password/passwordCategory.service";
import type { IPasswordCategory } from "@/utils/types/global.types";
import { create } from "zustand";
import { useUiStore } from "../ui.store";

interface IPasswordCategoryStore {
  passwordCategories: IPasswordCategory[];
  selectedCategoryId: string | null;
  selectedCategory: IPasswordCategory | null;

  refresh: () => void;
  setSelectedCategoryId: (id: string | null) => void;
  clearSelectedCategoryId: () => void;

  createPasswordCategory: (category: IPasswordCategory) => void;
  updatePasswordCategory: (category: IPasswordCategory) => void;
  deletePasswordCategory: (id: string) => void;
}
export const usePasswordCategoryStore = create<IPasswordCategoryStore>((set, get) => ({
  passwordCategories: [],
  selectedCategoryId: null,
  selectedCategory: null,

  refresh: () => {
    console.log("Refreshing password categories");
    const categories = PasswordCategoryService.getAllPasswordCategories();
    set({
      passwordCategories: categories,
      selectedCategory: categories.find((c) => c.id === get().selectedCategoryId) || null,
    });
  },

  setSelectedCategoryId: (id: string | null) => {
    set((state) => ({
      selectedCategoryId: id,
      selectedCategory: state.passwordCategories.find((cat) => cat.id === id) || null,
    }));
  },

  clearSelectedCategoryId: () => {
    set({
      selectedCategoryId: null,
      selectedCategory: null,
    });
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
    useUiStore.getState().syncDB();
  },
}));
