import { create } from "zustand";

export interface IUiStore {
  isLoadingPasswords: boolean;
  setIsLoadingPasswords: (isLoadingPasswords: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  activeTabId: "all" | "favorites" | "trash" | `cat-${string}`;
  setActiveTabId: (
    activeTabId: "all" | "favorites" | "trash" | `cat-${string}`
  ) => void;
}

export const useUiStore = create<IUiStore>((set) => ({
  isLoadingPasswords: false,
  setIsLoadingPasswords: (isLoadingPasswords: boolean) =>
    set({ isLoadingPasswords }),
  isDarkMode: false,
  setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
  activeTabId: "all",
  setActiveTabId: (
    activeTabId: "all" | "favorites" | "trash" | `cat-${string}`
  ) => set({ activeTabId }),
}));
