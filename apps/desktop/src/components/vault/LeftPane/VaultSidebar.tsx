import {
  LayoutGrid,
  Star,
  Trash2,
  Plus,
  Lock,
  ShieldCheck,
  Settings,
  HardDrive,
  LockIcon,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNavItem } from "./SidebarNavItem";
import { type IPasswordCategory } from "@/utils/types/global.types";
import { useUiStore, type IUiStore } from "@/store/ui.store";

interface PinnedCategory extends IPasswordCategory {
  count?: number;
}

interface VaultSidebarProps {
  onLock: () => void;
  onNewClick: () => void;
  onSettingsClick: () => void;
  pinnedCategories?: PinnedCategory[]; // Configurable categories
  totalItems?: number;
}

export function VaultSidebar({
  onLock,
  onNewClick,
  onSettingsClick,
  pinnedCategories = [],
  totalItems = 0,
}: VaultSidebarProps) {
  const activeTabId = useUiStore((state) => state.activeTabId);
  const setActiveTabId = useUiStore((state) => state.setActiveTabId);

  const mainNav = [
    { id: "all", label: "All Items", icon: LayoutGrid, count: totalItems },
    { id: "favorites", label: "Favorites", icon: Star },
    { id: "organized", label: "Organized", icon: Pin },
    { id: "secured", label: "Security", icon: ShieldCheck },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  return (
    <div className="h-full flex flex-col bg-muted/20 border-r border-border/50">
      {/* --- BRANDING / PROFILE --- */}
      <div className="p-4 mb-2">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-background border border-border/40 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold truncate">Personal Vault</h1>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTON --- */}
      <div className="px-4 mb-6">
        <Button
          onClick={onNewClick}
          className="w-full justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10 h-10"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold">New Entry</span>
        </Button>
      </div>

      {/* --- NAVIGATION --- */}
      <div className="flex-1 px-3 space-y-6 overflow-y-auto custom-scrollbar">
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
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Pinned
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 opacity-0 group-hover:opacity-100"
              >
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

      {/* --- BOTTOM SECTION --- */}
      <div className="p-4 border-t border-border/40 bg-muted/10 space-y-1">
        <SidebarNavItem
          label="Vault Settings"
          icon={Settings}
          isActive={false}
          onClick={onSettingsClick}
        />
        <SidebarNavItem
          label="Lock Vault"
          icon={LockIcon}
          isActive={false}
          onClick={onLock}
          kbd="L"
          variant="destructive"
        />
        <div className="mt-2 px-2 flex items-center justify-between text-[10px] text-muted-foreground opacity-50">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" /> 1.2 MB
          </span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
