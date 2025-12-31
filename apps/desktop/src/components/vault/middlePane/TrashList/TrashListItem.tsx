import { cn } from "@/lib/utils";
import { KeyRoundIcon, RotateCcw, Trash2, Folder } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useUiStore } from "@/store/ui.store";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { useDialog } from "@/context/DialogContext";
import type { IPasswordCategory, IPasswordItem } from "@/utils/types/vault";

interface TrashListItemProps {
  item: IPasswordItem | IPasswordCategory;
  type: "password" | "category";
}

const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Folder;
};

export default function TrashListItem({ item, type }: TrashListItemProps) {
  const selectedTrashId = useUiStore((state) => state.selectedTrashId);
  const isSelected = selectedTrashId === item.id;

  const setSelectedTrashId = useUiStore((state) => state.setSelectedTrashId);
  const setSelectedTrashType = useUiStore((state) => state.setSelectedTrashType);
  const setIsTrashDetailsShown = useUiStore((state) => state.setIsTrashDetailsShown);

  const updatePasswordItem = usePasswordStore((state) => state.updatePasswordItem);
  const deletePasswordItem = usePasswordStore((state) => state.deletePasswordItem);
  const updateCategory = usePasswordCategoryStore((state) => state.updatePasswordCategory);
  const deleteCategory = usePasswordCategoryStore((state) => state.deletePasswordCategory);

  const { openDialog, closeDialog } = useDialog();

  const handleRestore = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (type === "password") {
      updatePasswordItem({ ...(item as IPasswordItem), isDeleted: false });
    } else {
      updateCategory({ ...(item as IPasswordCategory), isDeleted: false });
    }
  };

  const handleDeletePermanently = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    openDialog({
      title: "Delete Permanently?",
      description: `Are you sure you want to delete this ${type} permanently? This action cannot be undone.`,
      variant: "danger",
      icon: Trash2,
      buttons: [
        {
          label: "Cancel",
          variant: "ghost",
          onClick: closeDialog,
        },
        {
          label: "Delete",
          variant: "destructive",
          onClick: () => {
            if (type === "password") {
              deletePasswordItem(item.id);
            } else {
              deleteCategory(item.id);
            }
            closeDialog();
          },
        },
      ],
    });
  };

  const title = type === "password" ? (item as IPasswordItem).title : (item as IPasswordCategory).name;
  const subtitle = type === "password" ? (item as IPasswordItem).username || "No username" : "Category";
  const IconComponent = type === "password" ? KeyRoundIcon : getIcon((item as IPasswordCategory).icon);

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
            setSelectedTrashId(item.id);
            setSelectedTrashType(type);
            setIsTrashDetailsShown(true);
          }}
        >
          {/* Icon Section */}
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
              isSelected
                ? "bg-background text-emerald-600 border-emerald-500/30"
                : "bg-muted/50 border-border/50 text-muted-foreground group-hover:bg-background group-hover:border-border"
            )}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center">
            <h3 className="font-medium text-sm truncate">{title}</h3>
            <p className="text-xs text-muted-foreground truncate opacity-80">{subtitle}</p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm border border-border/40">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRestore} title="Restore">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleRestore}>
          <RotateCcw className="mr-2 h-4 w-4" /> Restore
        </ContextMenuItem>
        <ContextMenuItem variant="destructive" onClick={handleDeletePermanently}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
