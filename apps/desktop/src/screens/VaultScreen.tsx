import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IVault } from "@/utils/types/global.types";
import { downloadVaultFile } from "@/utils/utils";

import { VaultSidebar } from "@/components/vault/LeftPane/VaultSidebar";
import { PasswordList } from "@/components/vault/middlePane/PasswordList/PasswordList";
import CategoryList from "@/components/vault/middlePane/CategoryList/CategoryList";
import { PasswordDetail } from "@/components/vault/RightPane/Password/PasswordDetail";
import { CreatePassword } from "@/components/vault/RightPane/Password/CreatePassword";
import Settings from "./Settings";
import { Toaster } from "sonner";

import { useUiStore } from "@/store/ui.store";
import { useSessionStore } from "@/store/session.store";

import CreateCategory from "@/components/vault/RightPane/Category/CreateCategory";
import CategoryDetails from "@/components/vault/RightPane/Category/CategoryDetails";
import SecurityPage from "@/components/vault/security/SecurityPage";
import { useFileStore } from "@/store/file.store";

import { VaultFileService } from "@/services/vaultFile.service";
import { SessionService } from "@/services/session.service";
import { PasswordCategoryService } from "@/services/password/passwordCategory.service";
import { PasswordService } from "@/services/password/password.service";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";

export default function VaultScreen() {
  const navigate = useNavigate();

  const vaultHeader = useFileStore((state) => state.vaultHeader);
  const isUnlocked = useSessionStore((state) => state.isUnlocked);
  const activeTabId = useUiStore((state) => state.activeTabId);
  const setIsUnlocked = useSessionStore((state) => state.setIsUnlocked);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const syncDB = useUiStore((state) => state.syncDB);

  const selectedPasswordId = usePasswordStore((state) => state.selectedPasswordId);
  const selectedCategoryId = usePasswordCategoryStore((state) => state.selectedCategoryId);
  const clearSelectedPasswordId = usePasswordStore((state) => state.clearSelectedPasswordId);
  const clearSelectedCategoryId = usePasswordCategoryStore((state) => state.clearSelectedCategoryId);

  useEffect(() => {
    setIsCreating(false);
  }, [selectedPasswordId]);

  useEffect(() => {
    if (!isUnlocked) {
      navigate("/", { replace: true });
    }
    clearSelectedPasswordId();
    syncDB();
  }, [isUnlocked]);

  const handleLock = async () => {
    if (!vaultHeader) return;

    const passwordItems = PasswordService.exportPasswordItems();
    const passwordCategories = PasswordCategoryService.exportPasswordCategories();

    const vault: IVault = {
      passwordItems,
      passwordCategories,
      settings: {},
    };

    const key = SessionService.getKey();
    const vaultFile = await VaultFileService.buildVaultFileWithKey(vault, key, vaultHeader);

    downloadVaultFile(vaultFile);
    SessionService.lock();
    setIsUnlocked(false);
  };

  useEffect(() => {
    clearSelectedPasswordId();
    clearSelectedCategoryId();
    setIsCreating(false);
  }, [activeTabId]);

  // Handle Category Selection
  useEffect(() => {
    if (selectedCategoryId) {
      setIsCreating(false);
    }
  }, [selectedCategoryId]);

  const isAllTab = activeTabId === "all";
  const isFavoritesTab = activeTabId === "favorites";
  const isTrashTab = activeTabId === "trash";

  const isPasswordTab = isAllTab || isFavoritesTab || isTrashTab;
  const isOrganizeTab = activeTabId === "organize";
  const isSecurityTab = activeTabId === "security";

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
      className="h-screen w-full bg-background overflow-hidden"
    >
      <Toaster theme="dark" richColors />
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <div className="w-[18%] min-w-[200px] h-full">
          <VaultSidebar
            onLock={handleLock}
            onNewClick={() => {
              setIsCreating(true);
            }}
            onSettingsClick={() => setIsSettingsOpen(true)}
          />
        </div>

        {isSecurityTab && <SecurityPage />}

        {!isSecurityTab && (
          <>
            {/* Middle Pane */}
            <div className="w-[30%] min-w-[300px] h-full">
              {isPasswordTab && <PasswordList onAddNew={() => setIsCreating(true)} />}
              {isOrganizeTab && <CategoryList />}
            </div>

            {/* Right Pane */}
            <div className="flex-1 h-full">
              {isPasswordTab &&
                (isCreating ? <CreatePassword onCancel={() => setIsCreating(false)} /> : <PasswordDetail />)}
              {isOrganizeTab &&
                (isCreating ? (
                  <CreateCategory
                    onCancel={() => {
                      setIsCreating(false);
                      setIsEditingCategory(false);
                    }}
                    isEditing={isEditingCategory}
                  />
                ) : (
                  <>
                    {selectedPasswordId && <PasswordDetail showBackButton />}
                    <CategoryDetails
                      onEditing={() => {
                        setIsCreating(true);
                        setIsEditingCategory(true);
                      }}
                    />
                  </>
                ))}
            </div>
          </>
        )}
        {isSettingsOpen && <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
      </div>
    </div>
  );
}
