import { create } from "zustand";

interface ISessionStore {
  isUnlocked: boolean;
  setIsUnlocked: (isUnlocked: boolean) => void;
}

export const useSessionStore = create<ISessionStore>((set) => ({
  isUnlocked: false,
  setIsUnlocked: (isUnlocked: boolean) => set({ isUnlocked }),
}));
