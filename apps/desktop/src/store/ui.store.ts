import { create } from "zustand";
import { usePasswordStore } from "./vault/password.store";
import { usePasswordCategoryStore } from "./vault/passwordCategory.store";

type TabId = "all" | "favorites" | "trash" | "organize" | "security" | `cat-${string}`;

export interface IUiStore {
  isLoadingPasswords: boolean;
  setIsLoadingPasswords: (isLoadingPasswords: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  activeTabId: TabId;
  setActiveTabId: (activeTabId: TabId) => void;
  syncDB: () => void;
}

export const useUiStore = create<IUiStore>((set) => ({
  isLoadingPasswords: false,
  setIsLoadingPasswords: (isLoadingPasswords: boolean) => set({ isLoadingPasswords }),

  isDarkMode: false,
  setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),

  activeTabId: "all",
  setActiveTabId: (activeTabId: TabId) => set({ activeTabId }),

  syncDB: () => {
    console.log("Syncing DB");
    usePasswordStore.getState().refresh();
    usePasswordCategoryStore.getState().refresh();
  },
}));
