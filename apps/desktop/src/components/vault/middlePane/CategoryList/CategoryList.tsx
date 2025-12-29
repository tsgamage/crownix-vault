import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Folder, XIcon, RefreshCcw } from "lucide-react";
import CategoryListItem from "./CategoryListItem";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui.store";
import { toast } from "sonner";
import { usePasswordStore } from "@/store/vault/password.store";

export default function CategoryList() {
  const passwordCategories = usePasswordCategoryStore((state) => state.passwordCategories);
  const selectedId = usePasswordCategoryStore((state) => state.selectedCategoryId);
  const onSelect = usePasswordCategoryStore((state) => state.setSelectedCategoryId);
  const clearSelectedPasswordId = usePasswordStore((state) => state.clearSelectedPasswordId);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = passwordCategories.filter(
    (cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()) && !cat.isDeleted
  );

  const syncDB = useUiStore((state) => state.syncDB);
  return (
    <div className="h-full flex flex-col bg-background/50 border-r border-border/50">
      {/* Search Header */}
      <div className="p-4 border-b border-border/50 bg-background/95 sticky top-0 z-10 space-y-3">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-foreground/80">
            Categories <span className="text-muted-foreground font-normal ml-1">({filteredCategories.length})</span>
          </h2>
          <Button
            tabIndex={-1}
            variant="ghost"
            size="icon"
            className="h-7 w-7 group"
            title="Refresh"
            onClick={() => {
              try {
                syncDB();
                toast.success("Vault refreshed successfully");
              } catch (err) {
                toast.error("Failed to refresh vault");
              }
            }}
          >
            <RefreshCcw className="w-4 h-4 group-active:rotate-180 transition-transform text-muted-foreground group-active:text-emerald-600" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
          <Input
            tabIndex={-1}
            placeholder="Search categories..."
            className="pl-9 pr-8 h-9 bg-muted/40 border-transparent hover:bg-muted/60 focus:bg-background focus:border-emerald-500/30 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              tabIndex={-1}
              title="Clear search"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 cursor-pointer -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-1.5 p-2 pb-10">
          {filteredCategories.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              <Folder className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No categories found</p>
            </div>
          )}

          {filteredCategories.length > 0 &&
            filteredCategories.map((category) => (
              <CategoryListItem
                key={category.id}
                category={category}
                isSelected={selectedId === category.id}
                onSelect={(id) => {
                  // clearing password selection when category is selected so we can remove the password details pane from screen
                  clearSelectedPasswordId();
                  onSelect(id);
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
