import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Star,
  Trash2,
  Plus,
  Lock,
  FolderLock,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VaultSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLock: () => void;
}

export function VaultSidebar({
  activeTab,
  onTabChange,
  onLock,
}: VaultSidebarProps) {
  const navItems = [
    { id: "all", label: "All Items", icon: LayoutGrid },
    { id: "favorites", label: "Favorites", icon: Star },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  return (
    <div className="h-full flex flex-col bg-muted/30 border-r border-border/50">
      {/* Sidebar Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center">
          <FolderLock className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="font-semibold tracking-tight text-sm">My Vault</span>
      </div>

      <div className="px-3 py-2">
        <Button
          className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          New Item
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-9 font-normal text-muted-foreground transition-colors",
              activeTab === item.id && "bg-muted text-foreground font-medium"
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-9 text-muted-foreground hover:text-foreground"
          onClick={() => console.log("Settings clicked")}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onLock}
        >
          <Lock className="w-4 h-4" />
          Lock Vault
        </Button>
      </div>
    </div>
  );
}
