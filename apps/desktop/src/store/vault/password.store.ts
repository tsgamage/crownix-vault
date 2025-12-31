import { PasswordService } from "@/services/password/password.service";
import { create } from "zustand";
import { useUiStore } from "../ui.store";
import type { IPasswordItem } from "@/utils/types/vault";

interface IPasswordStore {
  passwordItems: IPasswordItem[];
  selectedPasswordId: string | null;

  refresh: () => void;
  setSelectedPasswordId: (id: string | null) => void;
  clearSelectedPasswordId: () => void;

  createPasswordItem: (passwordItem: IPasswordItem) => void;
  updatePasswordItem: (passwordItem: IPasswordItem) => void;
  deletePasswordItem: (id: string) => void;
}

export const usePasswordStore = create<IPasswordStore>((set) => ({
  passwordItems: [],
  selectedPasswordId: null,

  refresh: () => {
    const passwords = PasswordService.getAllPasswordItems();
    set({ passwordItems: passwords });
  },

  setSelectedPasswordId: (id: string | null) => {
    set({ selectedPasswordId: id });
  },

  clearSelectedPasswordId: () => {
    set({ selectedPasswordId: null });
  },

  createPasswordItem: (passwordItem: IPasswordItem) => {
    PasswordService.createPasswordItem(passwordItem);
    useUiStore.getState().syncDB();
  },

  updatePasswordItem: (passwordItem: IPasswordItem) => {
    PasswordService.updatePasswordItem(passwordItem);
    useUiStore.getState().syncDB();
  },

  deletePasswordItem: (id: string) => {
    PasswordService.deletePasswordItem(id);
    useUiStore.getState().syncDB();
  },
}));
