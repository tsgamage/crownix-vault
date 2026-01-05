import { SessionService } from "@/services/session.service";
import { useSessionStore } from "@/store/session.store";
import { useUiStore } from "@/store/ui.store";
import { useShortcut } from "./use-shortcuts";
import useSaveManually from "./use-save-manually";

export default function useRegisterAllShortcuts() {
  const activeTabId = useUiStore((state) => state.activeTabId);
  const setActiveTabId = useUiStore((state) => state.setActiveTabId);

  const isSettingsOpen = useUiStore((state) => state.isSettingsOpen);
  const setIsSettingsOpen = useUiStore((state) => state.setIsSettingsOpen);

  const setIsPasswordCreateShown = useUiStore((state) => state.setIsPasswordCreateShown);
  const setIsPasswordCategoryCreateShown = useUiStore((state) => state.setIsPasswordCategoryCreateShown);

  const isUnlocked = useSessionStore((state) => state.isUnlocked);
  const setIsUnlocked = useSessionStore((state) => state.setIsUnlocked);

  const { saveFile, isSaved } = useSaveManually();

  const handleLockVault = () => {
    SessionService.lock();
    setIsUnlocked(false);
  };

  // Shortcuts
  useShortcut(isUnlocked, "l", () => {
    handleLockVault();
  });
  useShortcut(isUnlocked, "a", () => {
    setActiveTabId("all");
    setIsSettingsOpen(false);
  });
  useShortcut(isUnlocked, "f", () => {
    setActiveTabId("favorites");
    setIsSettingsOpen(false);
  });
  useShortcut(isUnlocked, "d", () => {
    setActiveTabId("organize");
    setIsSettingsOpen(false);
  });
  useShortcut(isUnlocked, "e", () => {
    setActiveTabId("security");
    setIsSettingsOpen(false);
  });
  useShortcut(isUnlocked, "t", () => {
    setActiveTabId("trash");
    setIsSettingsOpen(false);
  });
  useShortcut(isUnlocked, "q", () => {
    setActiveTabId("tools");
    setIsSettingsOpen(false);
  });
  useShortcut(isUnlocked, "s", () => {
    if (!isSaved) {
      saveFile();
    }
  });
  useShortcut(isUnlocked, ",", () => {
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
    } else {
      setIsSettingsOpen(true);
    }
  });

  useShortcut(isUnlocked, "n", () => {
    if (activeTabId === "all" || activeTabId === "favorites") {
      setIsPasswordCreateShown(true);
    } else if (activeTabId === "organize") {
      setIsPasswordCategoryCreateShown(true);
    }
  });
}
