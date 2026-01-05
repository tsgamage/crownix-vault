import { LayoutGrid, Star, Trash2, Plus, ShieldCheck, Settings, LockIcon, FolderIcon, WrenchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SidebarNavItem } from "./components/SidebarNavItem";
import { useUiStore, type IUiStore } from "@/store/ui.store";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import type { IPasswordCategory } from "@/utils/types/vault";
import { useSettingsStore } from "@/store/vault/settings.store";
import { SessionService } from "@/services/session.service";
import { useSessionStore } from "@/store/session.store";
import { appConfig } from "@/utils/constraints";

interface PinnedCategory extends IPasswordCategory {
  count?: number;
}

interface VaultSidebarProps {
  pinnedCategories?: PinnedCategory[];
}

export function VaultSidebar({ pinnedCategories = [] }: VaultSidebarProps) {
  const activeTabId = useUiStore((state) => state.activeTabId);
  const setActiveTabId = useUiStore((state) => state.setActiveTabId);

  const setIsSettingsOpen = useUiStore((state) => state.setIsSettingsOpen);

  const setIsPasswordCreateShown = useUiStore((state) => state.setIsPasswordCreateShown);
  const setIsPasswordCategoryCreateShown = useUiStore((state) => state.setIsPasswordCategoryCreateShown);

  const totalPasswords = usePasswordStore((state) => state.totalPasswords);
  const totalFavorites = usePasswordStore((state) => state.totalFavorites);
  const totalPasswordCategories = usePasswordCategoryStore((state) => state.totalPasswordCategories);

  const vaultSettings = useSettingsStore((state) => state.vaultSettings);
  const setIsUnlocked = useSessionStore((state) => state.setIsUnlocked);

  const mainNav = [
    { id: "all", label: "All Items", icon: LayoutGrid, count: totalPasswords },
    { id: "favorites", label: "Favorites", icon: Star, count: totalFavorites },
    {
      id: "organize",
      label: "Organize",
      icon: FolderIcon,
      count: totalPasswordCategories,
    },
  ];

  const handleNewClick = () => {
    if (activeTabId === "organize") {
      setIsPasswordCategoryCreateShown(true);
    } else if (activeTabId === "security" || activeTabId === "trash" || activeTabId === "tools") {
      setActiveTabId("all");
      setTimeout(() => {
        setIsPasswordCreateShown(true);
      }, 100);
    } else {
      setIsPasswordCreateShown(true);
    }
  };

  const handleLockVault = () => {
    SessionService.lock();
    setIsUnlocked(false);
  };

  return (
    <div className="h-full flex flex-col bg-background border-r border-border/50">
      {/* --- BRANDING / PROFILE --- */}
      <div className="p-4 mb-2" title={vaultSettings.vaultName}>
        <div className="flex items-center gap-3 p-2 rounded-xl bg-background border border-border/40 shadow-xs">
          <img className="mx-auto w-10 h-10 rounded-lg object-cover" src="/app_icon.png" alt="App Icon" />

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold truncate">{vaultSettings.vaultName || "Crownix Vault"}</h1>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTON --- */}
      <div className="px-4 mb-6">
        <Button
          onClick={handleNewClick}
          className="w-full justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10 h-10"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold">{activeTabId === "organize" ? "New Category" : "New Item"}</span>
        </Button>
      </div>

      {/* --- NAVIGATION --- */}
      <ScrollArea className="flex-1 min-h-0 px-3">
        <div className="space-y-6 pr-4 pb-10">
          {/* Main Section */}
          <div className="space-y-1">
            {mainNav.map((item) => (
              <SidebarNavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                count={item.count}
                isActive={activeTabId === item.id}
                onClick={() => setActiveTabId(item.id as IUiStore["activeTabId"])}
              />
            ))}
          </div>

          {/* Pinned Categories Section */}
          {pinnedCategories.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 flex items-center justify-between group">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pinned</span>
                <Button variant="ghost" size="icon" className="h-4 w-4 opacity-0 group-hover:opacity-100">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              {pinnedCategories.map((cat) => (
                <SidebarNavItem
                  key={cat.id}
                  label={cat.name}
                  color={cat.color}
                  count={cat.count}
                  isActive={activeTabId === `cat-${cat.id}`}
                  onClick={() => setActiveTabId(`cat-${cat.id}`)}
                />
              ))}
            </div>
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      {/* --- BOTTOM ACTIONS --- */}
      <div className="p-4 border-t border-border/40 bg-muted/10 space-y-1">
        <SidebarNavItem
          label="Lock Vault"
          icon={LockIcon}
          isActive={false}
          onClick={handleLockVault}
          variant="destructive"
        />
        <SidebarNavItem
          label="Security"
          icon={ShieldCheck}
          isActive={activeTabId === "security"}
          onClick={() => setActiveTabId("security")}
        />
        <SidebarNavItem
          label="Tools"
          icon={WrenchIcon}
          isActive={activeTabId === "tools"}
          onClick={() => setActiveTabId("tools")}
        />
        <SidebarNavItem
          label="Trash"
          icon={Trash2}
          isActive={activeTabId === "trash"}
          onClick={() => setActiveTabId("trash")}
        />

        <SidebarNavItem label="Settings" icon={Settings} isActive={false} onClick={() => setIsSettingsOpen(true)} />

        <div className="mt-2 px-2 flex items-center justify-between text-[10px] text-muted-foreground opacity-50">
          <span className="flex items-center gap-1">{appConfig.appName}</span>
          <span>v{appConfig.appVersion}</span>
        </div>
      </div>
    </div>
  );
}
