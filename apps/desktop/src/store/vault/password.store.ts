import { PasswordService } from "@/services/password/password.service";
import { create } from "zustand";
import type { IPasswordItem } from "@/utils/types/vault";
import { useFileStore } from "../file.store";

interface IPasswordStore {
  passwordItems: IPasswordItem[];
  selectedPasswordId: string | null;
  totalPasswords: number;
  totalFavorites: number;

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
  totalPasswords: 0,
  totalFavorites: 0,

  refresh: () => {
    const passwords = PasswordService.getAllPasswordItems();
    set({ passwordItems: passwords });
    set({ totalPasswords: passwords.filter((p) => !p.isDeleted).length });
    set({ totalFavorites: passwords.filter((p) => p.isFavorite && !p.isDeleted).length });
  },

  setSelectedPasswordId: (id: string | null) => {
    set({ selectedPasswordId: id });
  },

  clearSelectedPasswordId: () => {
    set({ selectedPasswordId: null });
  },

  createPasswordItem: (passwordItem: IPasswordItem) => {
    PasswordService.createPasswordItem(passwordItem);
    useFileStore.getState().saveFile();
  },

  updatePasswordItem: (passwordItem: IPasswordItem) => {
    PasswordService.updatePasswordItem(passwordItem);
    useFileStore.getState().saveFile();
  },

  deletePasswordItem: (id: string) => {
    PasswordService.deletePasswordItem(id);
    useFileStore.getState().saveFile();
  },
}));
