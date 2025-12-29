import { useEffect, useState } from "react";
import { VaultSidebar } from "@/components/vault/LeftPane/VaultSidebar";
import { PasswordList } from "@/components/vault/middlePane/PasswordList";
import { PasswordDetail } from "@/components/vault/RightPane/PasswordDetail";
import { useNavigate } from "react-router-dom";
import { downloadVaultFile } from "@/utils/utils";
import { SessionService } from "@/services/session.service";
import { useSessionStore } from "@/store/session.store";
import { VaultService } from "@/services/vault.service";
import type { IPasswordItem } from "@/utils/types/global.types";
import { CreatePassword } from "@/components/vault/RightPane/CreatePassword";
import { useUiStore } from "@/store/ui.store";
import { VaultFileService } from "@/services/vaultFile.service";
import { Toaster } from "sonner";

export default function VaultScreen() {
  const navigate = useNavigate();

  const isUnlocked = useSessionStore((state) => state.isUnlocked);
  const setIsUnlocked = useSessionStore((state) => state.setIsUnlocked);
  const vaultHeader = useSessionStore((state) => state.vaultHeader);
  const [pwItems, setPwItems] = useState<IPasswordItem[]>([]);

  const activeTabId = useUiStore((state) => state.activeTabId);
  const setIsLoadingPasswords = useUiStore(
    (state) => state.setIsLoadingPasswords
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  function refresh() {
    setIsLoadingPasswords(true);
    setPwItems(VaultService.getAllItems());
    setIsLoadingPasswords(false);
  }

  useEffect(() => {
    setIsCreating(false);
  }, [selectedId]);

  useEffect(() => {
    if (!isUnlocked) {
      navigate("/", { replace: true });
    }
    setSelectedId(null);
    refresh();
  }, [isUnlocked]);

  const handleLock = async () => {
    if (!vaultHeader) return;

    const vaultData = VaultService.exportVault();
    const key = SessionService.getKey();
    const vaultFile = await VaultFileService.buildVaultFileWithKey(
      vaultData,
      key,
      vaultHeader
    );

    downloadVaultFile(vaultFile);

    SessionService.lock();
    setIsUnlocked(false);
  };

  const filteredItems = pwItems.filter((item) => {
    const matchesTab =
      (activeTabId === "all" && !item.isDeleted) ||
      (activeTabId === "favorites" && item.isFavorite && !item.isDeleted) ||
      (activeTabId === "trash" && item.isDeleted);

    if (!matchesTab) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.username?.toLowerCase().includes(query) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(query.trim().toLowerCase())
        )
      );
    }

    return true;
  });

  useEffect(() => {
    setSelectedId(null);
    setIsCreating(false);
  }, [activeTabId]);

  const selectedItem = pwItems.find((item) => item.id === selectedId) || null;

  const handleCreatePasswordData = (data: IPasswordItem) => {
    VaultService.createItem(data);
    refresh();
    setIsCreating(false);
  };

  const handleUpdatePasswordData = (data: IPasswordItem) => {
    VaultService.updateItem(data);
    refresh();
  };

  const hanleDeletePasswordData = (id: string) => {
    VaultService.deleteItem(id);
    refresh();
  };

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
            onNewClick={() => setIsCreating(true)}
            onSettingsClick={() => navigate("/settings")}
          />
        </div>

        {/* List */}
        <div className="w-[30%] min-w-[300px] h-full">
          <PasswordList
            items={filteredItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddNew={() => setIsCreating(true)}
            onUpdate={handleUpdatePasswordData}
            clearSelectedId={() => setSelectedId(null)}
          />
        </div>

        {/* Detail */}
        <div className="flex-1 h-full">
          {isCreating ? (
            <CreatePassword
              onSave={handleCreatePasswordData}
              onCancel={() => setIsCreating(false)}
            />
          ) : (
            <PasswordDetail
              item={selectedItem}
              onSave={handleUpdatePasswordData}
              clearSelectedId={() => setSelectedId(null)}
              onPermanentlyDelete={hanleDeletePasswordData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
