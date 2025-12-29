import { PasswordService } from "@/services/password/password.service";
import type { IPasswordItem } from "@/utils/types/global.types";
import { create } from "zustand";
import { useUiStore } from "../ui.store";

interface IPasswordStore {
  passwordItems: IPasswordItem[];
  selectedPasswordId: string | null;
  selectedPassword: IPasswordItem | null;

  refresh: () => void;
  setSelectedPasswordId: (id: string | null) => void;
  clearSelectedPasswordId: () => void;

  createPasswordItem: (passwordItem: IPasswordItem) => void;
  updatePasswordItem: (passwordItem: IPasswordItem) => void;
  deletePasswordItem: (id: string) => void;
}

export const usePasswordStore = create<IPasswordStore>((set, get) => ({
  passwordItems: [],
  selectedPasswordId: null,
  selectedPassword: null,

  refresh: () => {
    console.log("Refreshing password items");
    const passwords = PasswordService.getAllPasswordItems();
    set({
      passwordItems: passwords,
      selectedPassword:
        passwords.find((i) => i.id === get().selectedPasswordId) || null,
    });
  },

  setSelectedPasswordId: (id: string | null) => {
    set((state) => ({
      selectedPasswordId: id,
      selectedPassword:
        state.passwordItems.find((item) => item.id === id) || null,
    }));
  },

  clearSelectedPasswordId: () => {
    set({
      selectedPasswordId: null,
      selectedPassword: null,
    });
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
