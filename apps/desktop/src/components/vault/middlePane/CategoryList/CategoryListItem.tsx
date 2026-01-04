import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import type { IPasswordCategory } from "@/utils/types/vault";

export default function CategoryListItem({
  isSelected,
  category,
  onSelect,
}: {
  category: IPasswordCategory;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Folder;
  };
  const passwords = usePasswordStore((state) => state.passwordItems);

  const Icon = getIcon(category.icon);
  const categoryItemsCount = passwords.filter(
    (password) => password.categoryId === category.id && !password.isDeleted
  ).length;
  const updateCategory = usePasswordCategoryStore((state) => state.updatePasswordCategory);
  const clearSelectedCategoryId = usePasswordCategoryStore((state) => state.clearSelectedCategoryId);

  const handleDeleteCategory = () => {
    updateCategory({ ...category, isDeleted: true });
    isSelected && clearSelectedCategoryId();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "w-full group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent",
            isSelected
              ? "bg-emerald-500/10 border-emerald-500/20 shadow-xs"
              : "hover:bg-muted/60 hover:border-border/40"
          )}
        >
          <div
            className={cn(
              `w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${category.color} hover:${category.color}/10`
            )}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 relative max-w-[200px]">
            <div className="flex items-center justify-between mb-0.5">
              <span className={cn("font-medium truncate", isSelected ? "text-foreground" : "text-foreground/90")}>
                {category.name}
              </span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              {category.description && <span className="truncate pr-2">{category.description}</span>}
            </div>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-muted rounded-full px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
              {categoryItemsCount}
            </span>
          </div>
        </button>
        {/* Context Menu Content */}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem variant="destructive" onClick={handleDeleteCategory}>
          <LucideIcons.Trash2 /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
