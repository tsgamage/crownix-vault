import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder, Check, KeyRoundIcon } from "lucide-react";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "../../common/SearchInput";
import type { IPasswordCategory } from "@/utils/types/vault";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface AddPasswordsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  targetCategory: IPasswordCategory;
}

export function AddPasswordsSheet({ isOpen, onOpenChange, targetCategory }: AddPasswordsSheetProps) {
  const passwords = usePasswordStore((state) => state.passwordItems);
  const categories = usePasswordCategoryStore((state) => state.passwordCategories);
  const updatePasswordItem = usePasswordStore((state) => state.updatePasswordItem);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) {
      setSelectedIds(new Set());
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredPasswords = useMemo(() => {
    return passwords
      .filter((p) => !p.isDeleted)
      .filter((p) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const urlString = p.urls?.join(" ") || "";
        return (
          p.title.toLowerCase().includes(q) ||
          (p.username || "").toLowerCase().includes(q) ||
          urlString.toLowerCase().includes(q)
        );
      });
  }, [passwords, searchQuery]);

  // Helper to get category name
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized";
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Uncategorized";
  };

  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return null;
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.color : null;
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSave = () => {
    selectedIds.forEach((id) => {
      const item = passwords.find((p) => p.id === id);
      if (item) {
        // Update the item's category to the target category
        updatePasswordItem({
          ...item,
          categoryId: targetCategory.id,
          updatedAt: Date.now(),
        });
      }
    });
    // Reset and close
    setSelectedIds(new Set());
    onOpenChange(false);
  };

  // Pre-calculate count to show in header
  const count = selectedIds.size;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full h-full flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-md">
        {/* HEADER */}
        <div className="p-6 border-b border-border/40 space-y-4">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl truncate">Add to {targetCategory.name}</SheetTitle>
              {count > 0 && <span className="text-sm font-medium text-emerald-500">{count} selected</span>}
            </div>
            <SheetDescription>Select passwords to move to this category.</SheetDescription>
          </SheetHeader>

          <SearchInput placeholder="Search passwords..." value={searchQuery} onChange={(e) => setSearchQuery(e)} />
        </div>

        {/* LIST */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col p-2 gap-1 pr-4">
            {filteredPasswords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No passwords found</div>
            ) : (
              filteredPasswords.map((item) => {
                const isCurrentCategory = item.categoryId === targetCategory.id;
                const categoryName = getCategoryName(item.categoryId);
                const categoryColor = getCategoryColor(item.categoryId);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border border-transparent transition-all cursor-pointer group",
                      selectedIds.has(item.id) ? "bg-emerald-500/10 border-emerald-500/20" : "hover:bg-muted/50",
                      isCurrentCategory && "opacity-50 pointer-events-none"
                    )}
                    onClick={() => !isCurrentCategory && toggleSelection(item.id)}
                  >
                    <Checkbox
                      checked={selectedIds.has(item.id) || isCurrentCategory}
                      disabled={isCurrentCategory}
                      className={cn(
                        "data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600",
                        isCurrentCategory && "opacity-50"
                      )}
                    />

                    <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center shrink-0 text-muted-foreground">
                      <span className="text-xl">{item.icon || <KeyRoundIcon className="w-5 h-5" />}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        {/* Current Category Tag */}
                        {item.categoryId && (
                          <div
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider"
                            style={{
                              backgroundColor: (categoryColor || "#71717a") + "20",
                              color: categoryColor || "#71717a",
                            }}
                          >
                            <Folder className="w-2.5 h-2.5" />
                            {categoryName}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{item.username || "No username"}</p>
                    </div>

                    {isCurrentCategory && (
                      <span className="text-[10px] text-muted-foreground italic pr-2">Already in</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {/* FOOTER */}
        <div className="p-4 border-t border-border/40 bg-muted/10">
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={count === 0}
              onClick={handleSave}
            >
              <Check className="w-4 h-4 mr-2" />
              Add {count > 0 ? `(${count})` : ""}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
