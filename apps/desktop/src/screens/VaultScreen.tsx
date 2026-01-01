import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { VaultSidebar } from "@/components/vault/LeftPane/VaultSidebar";
import { PasswordList } from "@/components/vault/middlePane/PasswordList/PasswordList";
import CategoryList from "@/components/vault/middlePane/CategoryList/CategoryList";
import { PasswordDetail } from "@/components/vault/RightPane/Password/PasswordDetail";
import { CreatePassword } from "@/components/vault/RightPane/Password/CreatePassword";
import Settings from "./Settings";
import { Toaster } from "sonner";

import { useUiStore } from "@/store/ui.store";
import { useSessionStore } from "@/store/session.store";

import CreateAndEditCategory from "@/components/vault/RightPane/Category/CreateAndEditCategory";
import CategoryDetails from "@/components/vault/RightPane/Category/CategoryDetails";
import SecurityPage from "@/components/vault/security/SecurityPage";

import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import TrashList from "@/components/vault/middlePane/TrashList/TrashList";
import TrashDetails from "@/components/vault/RightPane/Trash/TrashDetails";
import ToolsPage from "@/components/vault/Tools/ToolsPage";
import { SessionService } from "@/services/session.service";
import { useIdleTimer } from "react-idle-timer";
import { vaultConfig } from "@/utils/constraints";

export default function VaultScreen() {
  const navigate = useNavigate();

  const isUnlocked = useSessionStore((state) => state.isUnlocked);
  const activeTabId = useUiStore((state) => state.activeTabId);

  const syncDB = useUiStore((state) => state.syncDB);
  const resetUi = useUiStore((state) => state.resetUi);

  const selectedPasswordId = usePasswordStore((state) => state.selectedPasswordId);
  const selectedCategoryId = usePasswordCategoryStore((state) => state.selectedCategoryId);
  const clearSelectedPasswordId = usePasswordStore((state) => state.clearSelectedPasswordId);
  const clearSelectedCategoryId = usePasswordCategoryStore((state) => state.clearSelectedCategoryId);

  const isSettingsOpen = useUiStore((state) => state.isSettingsOpen);
  const isPasswordCreateShown = useUiStore((state) => state.isPasswordCreateShown);
  const isPasswordCategoryCreateShown = useUiStore((state) => state.isPasswordCategoryCreateShown);
  const setIsPasswordDetailsShown = useUiStore((state) => state.setIsPasswordDetailsShown);
  const setIsPasswordCreateShown = useUiStore((state) => state.setIsPasswordCreateShown);
  const setIsPasswordEditShown = useUiStore((state) => state.setIsPasswordEditShown);
  const setIsPasswordCategoryCreateShown = useUiStore((state) => state.setIsPasswordCategoryCreateShown);
  const setIsPasswordCategoryEditShown = useUiStore((state) => state.setIsPasswordCategoryEditShown);

  useEffect(() => {
    if (!isUnlocked) {
      navigate("/locked", { replace: true });
    } else {
      resetUi();
      syncDB();
    }
  }, [isUnlocked]);

  // Closing creating pane if user clicks on a password item
  useEffect(() => {
    setIsPasswordEditShown(false);
    setIsPasswordCategoryCreateShown(false);
    setIsPasswordCreateShown(false);
  }, [selectedPasswordId]);

  // Closing creating pane if user clicks on a category item
  useEffect(() => {
    setIsPasswordCreateShown(false);
    setIsPasswordCategoryCreateShown(false);
  }, [selectedCategoryId]);

  // Clearing all panes if user switches to another tab
  useEffect(() => {
    clearSelectedPasswordId();
    clearSelectedCategoryId();
    setIsPasswordCreateShown(false);
    setIsPasswordEditShown(false);
    setIsPasswordCategoryCreateShown(false);
    setIsPasswordCategoryEditShown(false);
    setIsPasswordDetailsShown(false);
  }, [activeTabId]);

  const isAllPasswordsTabActive = activeTabId === "all";
  const isFavoritesPasswordsTabActive = activeTabId === "favorites";
  const isTrashPasswordsTabActive = activeTabId === "trash";

  const isAnyPasswordTabActive = isAllPasswordsTabActive || isFavoritesPasswordsTabActive;
  const isOrganizeTabActive = activeTabId === "organize";
  const isSecurityTabActive = activeTabId === "security";
  const isToolsTabActive = activeTabId === "tools";

  const setIsUnlocked = useSessionStore((state) => state.setIsUnlocked);

  const handleOnIdle = () => {
    if (vaultConfig.autoLock.enabled) {
      setIsUnlocked(false);
      SessionService.lock();
    }
  };

  useIdleTimer({
    timeout: vaultConfig.autoLock.timeout,
    onIdle: handleOnIdle,
    startOnMount: true,
    crossTab: true,
  });

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      className="h-screen w-full bg-background overflow-hidden"
    >
      <Toaster theme="dark" richColors />
      <div className="flex h-full w-full">
        {isSettingsOpen && <Settings />}

        {/* Left Sidebar */}
        <div className="w-[18%] min-w-50 h-full">
          <VaultSidebar />
        </div>

        {isSecurityTabActive && <SecurityPage />}

        {isToolsTabActive && <ToolsPage />}

        {!isSecurityTabActive && !isToolsTabActive && !isSettingsOpen && (
          <>
            {/* Middle Pane */}
            <div className="w-[30%] min-w-75 h-full">
              {isOrganizeTabActive && <CategoryList />}
              {isAnyPasswordTabActive && <PasswordList />}
              {isTrashPasswordsTabActive && <TrashList />}
            </div>

            {/* Right Pane */}
            <div className="flex-1 h-full">
              {isAnyPasswordTabActive && (isPasswordCreateShown ? <CreatePassword /> : <PasswordDetail />)}
              {isOrganizeTabActive &&
                (isPasswordCategoryCreateShown ? (
                  <CreateAndEditCategory />
                ) : (
                  <>
                    {selectedPasswordId && <PasswordDetail backButton={{ show: true }} />}
                    <CategoryDetails />
                  </>
                ))}
              {isTrashPasswordsTabActive && <TrashDetails />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
