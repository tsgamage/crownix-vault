import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { VaultSidebar } from "@/components/vault/LeftPane/VaultSidebar";
import { PasswordList } from "@/components/vault/middlePane/PasswordList/PasswordList";
import CategoryList from "@/components/vault/middlePane/CategoryList/CategoryList";
import { PasswordDetail } from "@/components/vault/RightPane/Password/PasswordDetail";
import { CreatePassword } from "@/components/vault/RightPane/Password/CreatePassword";
import Settings from "./Settings";

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
import { useBlurAutoLock } from "@/hooks/use-blur-auto-lock";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";
import { useFileStore } from "@/store/file.store";
import useRegisterAllShortcuts from "@/hooks/use-register-all-shortcuts";
import { AppRoutes } from "@/app/AppRouter";
let permissionGranted = false;

export default function VaultScreen() {
  useRegisterAllShortcuts();
  const navigate = useNavigate();

  const isUnlocked = useSessionStore((state) => state.isUnlocked);
  const activeTabId = useUiStore((state) => state.activeTabId);

  const syncDB = useUiStore((state) => state.syncDB);
  const saveFile = useFileStore((state) => state.saveFile);
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
  const setIsUnlocked = useSessionStore((state) => state.setIsUnlocked);

  useEffect(() => {
    if (!isUnlocked) {
      navigate(AppRoutes.locked, { replace: true });
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

  useEffect(() => {
    async function permissionCheck() {
      permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
    }
    permissionCheck();
  }, []);

  const handleAutoLock = () => {
    saveFile();
    if (vaultConfig.autoLock.enabled) {
      setIsUnlocked(false);
      SessionService.lock();
      if (permissionGranted) {
        sendNotification({
          title: "Vault Locked",
          body: "Your vault has been locked due to inactivity",
        });
      }
    }
  };

  useIdleTimer({
    timeout: vaultConfig.autoLock.timeout,
    onIdle: handleAutoLock,
    startOnMount: true,
    crossTab: true,
    disabled: !isUnlocked || !vaultConfig.autoLock.enabled,
  });

  useBlurAutoLock(isUnlocked, handleAutoLock);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      className="h-screen w-full bg-background overflow-hidden"
    >
      <div className="flex h-full w-full">
        {isSettingsOpen && <Settings />}

        {/* Left Sidebar */}
        <div className="w-[18%] min-w-50 h-full min-h-0">
          <VaultSidebar />
        </div>

        {isSecurityTabActive && <SecurityPage />}

        {isToolsTabActive && <ToolsPage />}

        {!isSecurityTabActive && !isToolsTabActive && !isSettingsOpen && (
          <>
            {/* Middle Pane */}
            <div className="w-[30%] min-w-75 h-full min-h-0">
              {isOrganizeTabActive && <CategoryList />}
              {isAnyPasswordTabActive && <PasswordList />}
              {isTrashPasswordsTabActive && <TrashList />}
            </div>

            {/* Right Pane */}
            <div className="flex-1 h-full min-h-0">
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
