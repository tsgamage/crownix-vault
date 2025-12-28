import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ListFilter, Plus } from "lucide-react";
import type {
  IPasswordItem,
  IPasswordCategory,
} from "@/utils/types/global.types";
import { PasswordListItem } from "./PasswordListItem";
import { PasswordListSkeleton } from "./PasswordListSkeleton";
import { useMemo, useState } from "react";
import { useUiStore } from "@/store/ui.store";
import AllTabEmptyState from "./EmptyStates/AllTabEmptyState";
import FavoritesTabEmptyState from "./EmptyStates/FavoritesTabEmptyState";
import TrashTabEmptyState from "../LeftPane/TrashTabEmptyState";

// You might fetch categories from a store in a real app
const CATEGORIES: IPasswordCategory[] = [
  { id: "1", name: "Social", color: "bg-blue-500" },
  { id: "2", name: "Work", color: "bg-orange-500" },
  { id: "3", name: "Finance", color: "bg-green-500" },
  { id: "4", name: "Entertainment", color: "bg-purple-500" },
];

type SortOption = "name" | "recent" | "oldest";

interface PasswordListProps {
  items: IPasswordItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNew: () => void;
  onUpdate: (data: IPasswordItem) => void;
  clearSelectedId: () => void;
}

export function PasswordList({
  selectedId,
  onSelect,
  items,
  searchQuery,
  onSearchChange,
  onAddNew,
  onUpdate,
  clearSelectedId,
}: PasswordListProps) {
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const isLoadingPasswords = useUiStore((state) => state.isLoadingPasswords);
  const activeTabId = useUiStore((state) => state.activeTabId);

  // Handle Sorting
  const sortedItems = useMemo(() => {
    // Create a shallow copy to sort
    const sorted = [...items];
    switch (sortOption) {
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "recent":
        return sorted.sort((a, b) => b.updatedAt - a.updatedAt);
      case "oldest":
        return sorted.sort((a, b) => a.updatedAt - b.updatedAt);
      default:
        return sorted;
    }
  }, [items, sortOption]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCategoryColor = (catId?: string) => {
    return CATEGORIES.find((c) => c.id === catId)?.color;
  };


  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm border-r border-border/50">
      {/* --- HEADER --- */}
      <div className="p-4 border-b border-border/50 bg-background/95 sticky top-0 z-10 space-y-3">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-foreground/80">
            Items{" "}
            <span className="text-muted-foreground font-normal ml-1">
              ({items.length})
            </span>
          </h2>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ListFilter className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={(v) => setSortOption(v as SortOption)}
              >
                <DropdownMenuRadioItem value="name">
                  Name (A-Z)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="recent">
                  Recently Updated
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">
                  Oldest First
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
          <Input
            placeholder="Search vault..."
            className="pl-9 h-9 bg-muted/40 border-transparent hover:bg-muted/60 focus:bg-background focus:border-emerald-500/30 transition-all"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* --- LIST CONTENT --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoadingPasswords ? (
          <PasswordListSkeleton />
        ) : (
          <div className="flex flex-col gap-1 p-2 pb-10">
            {sortedItems.length === 0 && activeTabId === "all" && (
              <AllTabEmptyState onAddNew={onAddNew} searchQuery={searchQuery} />
            )}
            {sortedItems.length === 0 && activeTabId === "favorites" && (
              <FavoritesTabEmptyState />
            )}
            {sortedItems.length === 0 && activeTabId === "trash" && (
              <TrashTabEmptyState />
            )}
            {sortedItems.length > 0 &&
              sortedItems.map((item) => (
                <PasswordListItem
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onSelect={onSelect}
                  onCopy={handleCopy}
                  categoryColor={getCategoryColor(item.categoryId)}
                  onUpdate={onUpdate}
                  clearSelectedId={clearSelectedId}
                />
              ))}
          </div>
        )}
      </div>

      {/* Optional: Bottom Gradient Fade for scrolling indication */}
      <div className="h-6 bg-linear-to-t from-background to-transparent pointer-events-none sticky bottom-0" />
    </div>
  );
}
