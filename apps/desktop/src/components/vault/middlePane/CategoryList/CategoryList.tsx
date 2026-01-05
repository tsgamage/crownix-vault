import { useState } from "react";
import CategoryListItem from "./CategoryListItem";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { usePasswordStore } from "@/store/vault/password.store";
import { SearchInput } from "../../common/SearchInput";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ManuallySaveButton from "../../common/ManuallySaveButton";
import { FolderIcon } from "lucide-react";

export default function CategoryList() {
  const passwordCategories = usePasswordCategoryStore((state) => state.passwordCategories);
  const selectedId = usePasswordCategoryStore((state) => state.selectedCategoryId);
  const onSelect = usePasswordCategoryStore((state) => state.setSelectedCategoryId);
  const clearSelectedPasswordId = usePasswordStore((state) => state.clearSelectedPasswordId);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = passwordCategories.filter(
    (cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()) && !cat.isDeleted
  );

  return (
    <div className="h-full flex flex-col bg-background border-r border-border/50">
      {/* Search Header */}
      <div className="p-4 border-b border-border/50 bg-background sticky top-0 z-10 space-y-3">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-foreground/80">
            Categories <span className="text-muted-foreground font-normal ml-1">({filteredCategories.length})</span>
          </h2>
          <ManuallySaveButton />
        </div>

        <div className="flex-1">
          <SearchInput placeholder="Search categories..." value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-1.5 p-2 pb-10 pr-4">
          {filteredCategories.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              <FolderIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
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
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
