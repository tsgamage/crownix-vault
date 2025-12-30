import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/DialogContext";
import { Trash2Icon, RotateCcw, Trash2, Folder, KeyRoundIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useUiStore } from "@/store/ui.store";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import type { IPasswordItem, IPasswordCategory } from "@/utils/types/global.types";

const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Folder;
};

export default function TrashDetails() {
  const { openDialog, closeDialog } = useDialog();

  const selectedId = useUiStore((state) => state.selectedTrashId);
  const selectedType = useUiStore((state) => state.selectedTrashType);
  const setSelectedTrashId = useUiStore((state) => state.setSelectedTrashId);

  const passwordItems = usePasswordStore((state) => state.passwordItems);
  const categoryItems = usePasswordCategoryStore((state) => state.passwordCategories);

  const updatePasswordItem = usePasswordStore((state) => state.updatePasswordItem);
  const deletePasswordItem = usePasswordStore((state) => state.deletePasswordItem);
  const updateCategory = usePasswordCategoryStore((state) => state.updatePasswordCategory);
  const deleteCategory = usePasswordCategoryStore((state) => state.deletePasswordCategory);

  const item =
    selectedType === "password"
      ? passwordItems.find((p) => p.id === selectedId)
      : categoryItems.find((c) => c.id === selectedId);

  if (!item || !item.isDeleted) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50">
            <Trash2Icon className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Select an item from trash to view details</p>
        </div>
      </div>
    );
  }

  const handleRestore = () => {
    if (selectedType === "password") {
      updatePasswordItem({ ...(item as IPasswordItem), isDeleted: false });
    } else {
      updateCategory({ ...(item as IPasswordCategory), isDeleted: false });
    }
    setSelectedTrashId(null);
  };

  const handleDeletePermanently = () => {
    openDialog({
      title: "Delete Permanently?",
      description: `Are you sure you want to delete this ${selectedType} permanently? This action cannot be undone.`,
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
            if (selectedType === "password") {
              deletePasswordItem(item.id);
            } else {
              deleteCategory(item.id);
            }
            setSelectedTrashId(null);
            closeDialog();
          },
        },
      ],
    });
  };

  const title = selectedType === "password" ? (item as any).title : (item as any).name;
  const description = selectedType === "password" ? (item as any).notes : (item as any).description;
  const IconComponent = selectedType === "password" ? KeyRoundIcon : getIcon((item as any).icon);

  return (
    <div className="h-full flex flex-col bg-background backdrop-blur-sm">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 rounded-3xl bg-muted/50 flex items-center justify-center mb-6 border-2 border-border/50 shadow-sm">
          <IconComponent className="w-10 h-10 text-muted-foreground/60" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-2 truncate w-full max-w-md px-6" title={title}>
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mb-8">This item is in the trash.</p>

        {description && (
          <div className="w-full max-w-md bg-muted/30 border border-border/40 rounded-2xl p-6 mb-8 text-left space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              {selectedType === "password" ? "Notes" : "Description"}
            </span>
            <p className="text-sm text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">{description}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button variant="outline" className="w-full h-11 shadow-sm transition-all" onClick={handleRestore}>
            <RotateCcw className="w-4 h-4 mr-2" /> Restore Item
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
            onClick={handleDeletePermanently}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Permanently
          </Button>
        </div>
      </div>
    </div>
  );
}
