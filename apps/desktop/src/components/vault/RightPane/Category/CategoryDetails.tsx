import { Button } from "@/components/ui/button";
import { Folder, Pencil, Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PasswordListItem } from "@/components/vault/middlePane/PasswordList/PasswordListItem";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { usePasswordStore } from "@/store/vault/password.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useEffect, useState } from "react";
import { AddPasswordsSheet } from "./AddPasswordsSheet";

// Helper to get icon
const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Folder;
};

interface CategoryDetailsProps {
  onEditing: () => void;
}

export default function CategoryDetails({ onEditing }: CategoryDetailsProps) {
  const passwords = usePasswordStore((state) => state.passwordItems);
  const category = usePasswordCategoryStore((state) => state.selectedCategory);
  const updatePasswordCategory = usePasswordCategoryStore((state) => state.updatePasswordCategory);
  const clearSelectedCategoryId = usePasswordCategoryStore((state) => state.clearSelectedCategoryId);

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  // Handle escape key press
  const handleEscapePress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        category && clearSelectedCategoryId();
      }
    },
    [category, clearSelectedCategoryId]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleEscapePress);
    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, [handleEscapePress]);

  if (!category) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50">
            <Folder className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Select a category to view details</p>
        </div>
      </div>
    );
  }

  const categoryItems = passwords.filter((password) => password.categoryId === category.id);
  const Icon = getIcon(category.icon);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDeleteCategory = () => {
    updatePasswordCategory({ ...category, isDeleted: true });
    clearSelectedCategoryId();
  };

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm">
      {/* --- HEADER --- */}
      <div className="p-6 pb-6 border-b border-border/40">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-2 border-border"
              )}
            >
              <Icon className="w-7 h-7" />
            </div>
            <div className="space-y-1 pt-0.5">
              <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md line-clamp-2">
                {category.description || "No description provided."}
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground/60">
                <span>{categoryItems.length} items</span>
                <span>•</span>
                <span>Created {format(category.createdAt, "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onEditing} title="Edit">
              <Pencil className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <LucideIcons.MoreHorizontalIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleDeleteCategory}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* --- ITEMS --- */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 px-6 flex items-center justify-between border-b border-border/20 bg-muted/5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items in Category</h3>
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setIsAddSheetOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" /> Add Password
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-1">
            {categoryItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/20 m-2">
                <p className="text-muted-foreground text-sm">No passwords in this category yet.</p>
              </div>
            ) : (
              categoryItems.map((item) => (
                <PasswordListItem item={item} onCopy={(text) => handleCopy(text)} categoryColor={category.color} />
              ))
            )}
          </div>
        </div>
      </div>
      <AddPasswordsSheet isOpen={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} targetCategory={category} />
    </div>
  );
}
