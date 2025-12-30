import { create } from "zustand";
import { usePasswordStore } from "./vault/password.store";
import { usePasswordCategoryStore } from "./vault/passwordCategory.store";
import type { IPasswordCategory, IPasswordItem } from "@/utils/types/global.types";

type TabId = "all" | "favorites" | "trash" | "organize" | "security" | "tools" | `cat-${string}`;

export interface IUiStore {
  isLoadingPasswords: boolean;
  setIsLoadingPasswords: (isLoadingPasswords: boolean) => void;

  isLoadingPasswordCategories: boolean;
  setIsLoadingPasswordCategories: (isLoadingPasswordCategories: boolean) => void;

  filteredPasswords: IPasswordItem[];
  setFilteredPasswords: (filteredPasswords: IPasswordItem[]) => void;

  filteredPasswordCategories: IPasswordCategory[];
  setFilteredPasswordCategories: (filteredPasswordCategories: IPasswordCategory[]) => void;

  isPasswordListShown: boolean;
  setIsPasswordListShown: (isPasswordListShown: boolean) => void;

  isPasswordCreateShown: boolean;
  setIsPasswordCreateShown: (isPasswordCreateShown: boolean) => void;

  isPasswordDetailsShown: boolean;
  setIsPasswordDetailsShown: (isPasswordDetailsShown: boolean) => void;

  isPasswordEditShown: boolean;
  setIsPasswordEditShown: (isPasswordEditShown: boolean) => void;

  isPasswordCategoryListShown: boolean;
  setIsPasswordCategoryListShown: (isPasswordCategoryListShown: boolean) => void;

  isPasswordCategoryCreateShown: boolean;
  setIsPasswordCategoryCreateShown: (isPasswordCategoryCreateShown: boolean) => void;

  isPasswordCategoryEditShown: boolean;
  setIsPasswordCategoryEditShown: (isPasswordCategoryEditShown: boolean) => void;

  isPasswordCategoryDetailsShown: boolean;
  setIsPasswordCategoryDetailsShown: (isPasswordCategoryDetailsShown: boolean) => void;

  selectedTrashId: string | null;
  setSelectedTrashId: (id: string | null) => void;
  
  selectedTrashType: "password" | "category" | null;
  setSelectedTrashType: (type: "password" | "category" | null) => void;

  isTrashListShown: boolean;
  setIsTrashListShown: (isTrashListShown: boolean) => void;

  isTrashDetailsShown: boolean;
  setIsTrashDetailsShown: (isTrashDetailsShown: boolean) => void;

  isSettingsOpen: boolean;
  setIsSettingsOpen: (isSettingsOpen: boolean) => void;

  activeTabId: TabId;
  setActiveTabId: (activeTabId: TabId) => void;
  syncDB: () => void;
}

export const useUiStore = create<IUiStore>((set) => ({
  isLoadingPasswords: false,
  setIsLoadingPasswords: (isLoadingPasswords: boolean) => set({ isLoadingPasswords }),

  isLoadingPasswordCategories: false,
  setIsLoadingPasswordCategories: (isLoadingPasswordCategories: boolean) => set({ isLoadingPasswordCategories }),

  filteredPasswords: [],
  setFilteredPasswords: (filteredPasswords: IPasswordItem[]) => set({ filteredPasswords }),

  filteredPasswordCategories: [],
  setFilteredPasswordCategories: (filteredPasswordCategories: IPasswordCategory[]) =>
    set({ filteredPasswordCategories }),

  isPasswordListShown: false,
  setIsPasswordListShown: (isPasswordListShown: boolean) => set({ isPasswordListShown }),

  isPasswordCreateShown: false,
  setIsPasswordCreateShown: (isPasswordCreateShown: boolean) => set({ isPasswordCreateShown }),

  isPasswordDetailsShown: false,
  setIsPasswordDetailsShown: (isPasswordDetailsShown: boolean) => set({ isPasswordDetailsShown }),

  isPasswordEditShown: false,
  setIsPasswordEditShown: (isPasswordEditShown: boolean) => set({ isPasswordEditShown }),

  isPasswordCategoryListShown: false,
  setIsPasswordCategoryListShown: (isPasswordCategoryListShown: boolean) => set({ isPasswordCategoryListShown }),

  isPasswordCategoryCreateShown: false,
  setIsPasswordCategoryCreateShown: (isPasswordCategoryCreateShown: boolean) => set({ isPasswordCategoryCreateShown }),

  isPasswordCategoryEditShown: false,
  setIsPasswordCategoryEditShown: (isPasswordCategoryEditShown: boolean) => set({ isPasswordCategoryEditShown }),

  isPasswordCategoryDetailsShown: false,
  setIsPasswordCategoryDetailsShown: (isPasswordCategoryDetailsShown: boolean) =>
    set({ isPasswordCategoryDetailsShown }),

  selectedTrashId: null,
  setSelectedTrashId: (selectedTrashId: string | null) => set({ selectedTrashId }),
  selectedTrashType: null,
  setSelectedTrashType: (selectedTrashType: "password" | "category" | null) => set({ selectedTrashType }),

  isTrashListShown: false,
  setIsTrashListShown: (isTrashListShown: boolean) => set({ isTrashListShown }),

  isTrashDetailsShown: false,
  setIsTrashDetailsShown: (isTrashDetailsShown: boolean) => set({ isTrashDetailsShown }),

  activeTabId: "all",
  setActiveTabId: (activeTabId: TabId) => set({ activeTabId }),

  isSettingsOpen: false,
  setIsSettingsOpen: (isSettingsOpen: boolean) => set({ isSettingsOpen }),

  syncDB: () => {
    console.log("Syncing DB");
    usePasswordStore.getState().refresh();
    usePasswordCategoryStore.getState().refresh();
  },
}));
