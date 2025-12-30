import type { IPasswordItem } from "@/utils/types/global.types";
import { cn } from "@/lib/utils";
import { Copy, KeyRoundIcon, Star, User, Trash2, ExternalLink, StarOff, RotateCcw, Check, XIcon } from "lucide-react";
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
import { useState } from "react";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { Badge } from "@/components/ui/badge";

interface PasswordListItemProps {
  item: IPasswordItem;
  onCopy: (text: string, type: "username" | "password") => void;
  categoryColor: string;
}

export function PasswordListItem({ item, onCopy, categoryColor }: PasswordListItemProps) {
  const activeTabId = useUiStore((state) => state.activeTabId);

  const selectedPasswordId = usePasswordStore((state) => state.selectedPasswordId);
  const isSelected = selectedPasswordId === item.id;
  const passwordCategories = usePasswordCategoryStore((state) => state.passwordCategories);
  const setSelectedPasswordId = usePasswordStore((state) => state.setSelectedPasswordId);
  const setIsPasswordDetailsShown = useUiStore((state) => state.setIsPasswordDetailsShown);
  const clearSelectedId = usePasswordStore((state) => state.clearSelectedPasswordId);
  const updatePasswordItem = usePasswordStore((state) => state.updatePasswordItem);

  const [quickCopy, setQuickCopy] = useState({
    username: false,
    password: false,
  });

  const handleQuickCopy = (e: React.MouseEvent, type: "username" | "password") => {
    e.stopPropagation();
    const value = type === "username" ? item.username : item.password;
    if (value) {
      onCopy(value, type);
      setQuickCopy({
        username: type === "username",
        password: type === "password",
      });
      setTimeout(() => setQuickCopy({ username: false, password: false }), 1000);
    } else {
      toast.error(`No ${type} available`);
    }
  };

  const handleFavorite = () => {
    updatePasswordItem({
      ...item,
      isFavorite: !item.isFavorite,
    });
    isSelected && activeTabId === "favorites" && clearSelectedId();
  };

  const handleDelete = () => {
    updatePasswordItem({ ...item, isDeleted: true });
    isSelected && clearSelectedId();
  };

  const handleRestore = () => {
    updatePasswordItem({ ...item, isDeleted: false });
    isSelected && clearSelectedId();
  };

  const handleRemoveFromCategory = () => {
    updatePasswordItem({ ...item, categoryId: undefined });
    isSelected && clearSelectedId();
  };

  const itemCategory = passwordCategories.find((category) => category.id === item.categoryId);
  const itemCategoryName = itemCategory?.isDeleted ? itemCategory?.name + " (Deleted)" : itemCategory?.name;

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
          onClick={() => {
            setSelectedPasswordId(item.id);
            setIsPasswordDetailsShown(true);
          }}
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
              <span className="text-xl">{item.icon || <KeyRoundIcon className="w-5 h-5" />}</span>
            </div>
            {/* Favorite Indicator */}
            {item.isFavorite && (
              <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 shadow-sm border border-border/50">
                <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
              </div>
            )}
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center">
            <h3 className="font-medium text-sm truncate">{item.title}</h3>
            <p className="text-xs text-muted-foreground truncate flex items-center opacity-80">
              {item.username || "No username"}
            </p>
            {itemCategoryName && (
              <Badge
                variant="secondary"
                className={cn("h-4 opacity-80 text-xs truncate flex items-center", categoryColor)}
              >
                {itemCategoryName}
              </Badge>
            )}
          </div>

          {/* Quick Copy */}
          {activeTabId !== "trash" && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm border border-border/40">
              {item.username && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => handleQuickCopy(e, "username")}
                  title="Copy Username"
                >
                  {quickCopy.username && <Check className="w-3.5 h-3.5" />}
                  {!quickCopy.username && <User className="w-3.5 h-3.5" />}
                </Button>
              )}
              {item.password && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => handleQuickCopy(e, "password")}
                  title="Copy Password"
                >
                  {quickCopy.password && <Check className="w-3.5 h-3.5" />}
                  {!quickCopy.password && <Copy className="w-3.5 h-3.5" />}
                </Button>
              )}
            </div>
          )}
          {activeTabId === "trash" && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm border border-border/40">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRestore} title="Restore">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </ContextMenuTrigger>

      {/* Context Menu Content */}
      <ContextMenuContent className="w-56">
        {(activeTabId === "all" || activeTabId === "favorites") && (
          <>
            <ContextMenuItem disabled={!item.password} onClick={(e) => handleQuickCopy(e as any, "password")}>
              <Copy /> Copy Password
            </ContextMenuItem>

            <ContextMenuItem disabled={!item.username} onClick={(e) => handleQuickCopy(e as any, "username")}>
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
        {activeTabId === "organize" && (
          <ContextMenuItem onClick={handleRemoveFromCategory}>
            <XIcon /> Remove from Category
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
