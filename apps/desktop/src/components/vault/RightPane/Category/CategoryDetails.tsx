import { Button } from "@/components/ui/button";
import { Folder, Pencil, Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "../../common/SearchInput";
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
import { useUiStore } from "@/store/ui.store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Helper to get icon
const getIcon = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Folder;
};

export default function CategoryDetails() {
  const passwordItems = usePasswordStore((state) => state.passwordItems);
  const passwordCategories = usePasswordCategoryStore((state) => state.passwordCategories);
  const selectedCategoryId = usePasswordCategoryStore((state) => state.selectedCategoryId);
  const category = passwordCategories.find((c) => c.id === selectedCategoryId);

  const updatePasswordCategory = usePasswordCategoryStore((state) => state.updatePasswordCategory);
  const clearSelectedCategoryId = usePasswordCategoryStore((state) => state.clearSelectedCategoryId);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isPasswordDetailsShown = useUiStore((state) => state.isPasswordDetailsShown);
  const setIsPasswordCategoryEditShown = useUiStore((state) => state.setIsPasswordCategoryEditShown);
  const setIsPasswordCategoryCreateShown = useUiStore((state) => state.setIsPasswordCategoryCreateShown);

  // Handle escape key press
  const handleEscapePress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Doing this because if user is in password details mode, we don't want to clear the category.
        // So only the password details pane is closing
        category && !isPasswordDetailsShown && clearSelectedCategoryId();
      }
    },
    [category, clearSelectedCategoryId, isPasswordDetailsShown]
  );

  useEffect(() => {
    setSearchQuery("");
  }, [category?.id]);

  useEffect(() => {
    window.addEventListener("keydown", handleEscapePress);
    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, [handleEscapePress]);

  const handleEditClick = () => {
    // setting both to true will show the category create pane and activate its edit mode
    setIsPasswordCategoryEditShown(true);
    setIsPasswordCategoryCreateShown(true);
  };

  if (!category) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50">
            <Folder className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Select a category to view details</p>
        </div>
      </div>
    );
  }

  const categoryItems = passwordItems.filter((password) => password.categoryId === category.id && !password.isDeleted);

  const filteredItems = categoryItems.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      (item.username?.toLowerCase() || "").includes(searchLower) ||
      (item.notes?.toLowerCase() || "").includes(searchLower) ||
      (item.urls || []).some((u) => u.toLowerCase().includes(searchLower))
    );
  });

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
      <ScrollArea className="flex-1 min-h-0">
        <div className="relative">
          {/* --- HEADER --- */}
          <div className="p-6 pb-6 border-b border-border/40 bg-background/30">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-2 border-border"
                  )}
                >
                  <Icon className={cn("w-7 h-7")} />
                </div>
                <div className="flex-1 min-w-0 space-y-1 pt-0.5">
                  <h2 className="text-2xl font-bold tracking-tight truncate pr-2 max-w-[260px]" title={category.name}>
                    {category.name}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px] truncate line-clamp-2">
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
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleEditClick} title="Edit">
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

          {/* --- SEARCH & ACTIONS --- */}
          <div className="sticky top-0 z-10 p-4 px-6 flex items-center justify-between gap-4 border-b border-border/20 bg-background/95 backdrop-blur-sm shadow-sm transition-all duration-300">
            <div className="flex-1">
              <SearchInput placeholder="Search items in category..." value={searchQuery} onChange={setSearchQuery} />
            </div>
            <Button
              size="sm"
              variant="default"
              className="h-9 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              onClick={() => setIsAddSheetOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" /> Add Password
            </Button>
          </div>

          {/* --- ITEMS --- */}
          <div className="p-4 px-6 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/20 m-2">
                <p className="text-muted-foreground text-sm">
                  {searchQuery ? "No items match your search." : "No passwords in this category yet."}
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <PasswordListItem
                  key={item.id}
                  item={item}
                  onCopy={(text) => handleCopy(text)}
                  categoryColor={category.color}
                />
              ))
            )}
          </div>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <AddPasswordsSheet isOpen={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} targetCategory={category} />
    </div>
  );
}
