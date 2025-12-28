import type { IPasswordItem } from "@/utils/types/global.types";
import { cn } from "@/lib/utils";
import {
  Copy,
  KeyRoundIcon,
  Star,
  User,
  Trash2,
  ExternalLink,
  StarOff,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner"; // Assuming you use sonner or similar for toasts
import { useUiStore } from "@/store/ui.store";

interface PasswordListItemProps {
  item: IPasswordItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onCopy: (text: string, type: "username" | "password") => void;
  onUpdate: (data: IPasswordItem) => void;
  clearSelectedId: () => void;
  categoryColor?: string; // We will pass this from parent
}

export function PasswordListItem({
  item,
  isSelected,
  onSelect,
  onCopy,
  onUpdate,
  categoryColor,
  clearSelectedId,
}: PasswordListItemProps) {
  const activeTabId = useUiStore((state) => state.activeTabId);

  const handleQuickCopy = (
    e: React.MouseEvent,
    type: "username" | "password"
  ) => {
    e.stopPropagation();
    const value = type === "username" ? item.username : item.password;
    if (value) {
      onCopy(value, type);
      toast.success(`Copied ${type} to clipboard`);
    } else {
      toast.error(`No ${type} available`);
    }
  };

  const handleFavorite = () => {
    onUpdate({
      ...item,
      isFavorite: !item.isFavorite,
    });
    isSelected && activeTabId === "favorites" && clearSelectedId();
  };

  const handleDelete = () => {
    onUpdate({ ...item, isDeleted: true });
    isSelected && clearSelectedId();
  };

  const handleRestore = () => {
    onUpdate({ ...item, isDeleted: false });
    isSelected && clearSelectedId();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent",
            isSelected
              ? "bg-emerald-500/10 border-emerald-500/20 shadow-xs"
              : "hover:bg-muted/60 hover:border-border/40"
          )}
          onClick={() => onSelect(item.id)}
        >
          {/* Icon Section */}
          <div className="relative">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                isSelected
                  ? "bg-background text-emerald-600 border-emerald-500/30"
                  : "bg-muted/50 border-border/50 text-muted-foreground group-hover:bg-background group-hover:border-border"
              )}
            >
              <span className="text-xl">
                {item.icon || <KeyRoundIcon className="w-5 h-5" />}
              </span>
            </div>
            {/* Favorite Indicator */}
            {item.isFavorite && (
              <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 shadow-sm border border-border/50">
                <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
              </div>
            )}
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "font-medium text-sm truncate pr-2",
                  isSelected
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-foreground"
                )}
              >
                {item.title}
              </h3>
            </div>

            <p className="text-xs text-muted-foreground truncate h-4 flex items-center gap-1.5">
              {categoryColor && (
                <span className={`w-1.5 h-1.5 rounded-full ${categoryColor}`} />
              )}
              <span className="truncate opacity-80">
                {item.username || "No username"}
              </span>
            </p>
          </div>

          {/* Quick Copy */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm border border-border/40">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => handleQuickCopy(e, "username")}
              title="Copy Username"
            >
              <User className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => handleQuickCopy(e, "password")}
              title="Copy Password"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </ContextMenuTrigger>

      {/* Context Menu Content */}
      <ContextMenuContent className="w-56">
        {(activeTabId === "all" || activeTabId === "favorites") && (
          <>
            <ContextMenuItem
              onClick={(e) => handleQuickCopy(e as any, "password")}
            >
              <Copy /> Copy Password
            </ContextMenuItem>

            <ContextMenuItem
              onClick={(e) => handleQuickCopy(e as any, "username")}
            >
              <User /> Copy Username
            </ContextMenuItem>
            <ContextMenuItem disabled={!item.urls || item.urls.length === 0}>
              <ExternalLink /> Open Website
            </ContextMenuItem>
            <ContextMenuItem onClick={handleFavorite}>
              {item.isFavorite ? (
                <>
                  <StarOff /> Remove from Favorites
                </>
              ) : (
                <>
                  <Star /> Add to Favorites
                </>
              )}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2 /> Delete
            </ContextMenuItem>
          </>
        )}
        {activeTabId === "trash" && (
          <ContextMenuItem onClick={handleRestore}>
            <RotateCcw /> Restore
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
