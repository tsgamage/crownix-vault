import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ListFilter, X, LayoutGrid, RefreshCcw } from "lucide-react";
import type { IPasswordItem } from "@/utils/types/global.types";
import { PasswordListItem } from "./PasswordListItem";
import { PasswordListSkeleton } from "./PasswordListSkeleton";
import { useMemo, useState } from "react";
import { useUiStore } from "@/store/ui.store";
import { getPasswordStrength } from "@/utils/pwd.utils";
import AllTabEmptyState from "./EmptyStates/AllTabEmptyState";
import FavoritesTabEmptyState from "./EmptyStates/FavoritesTabEmptyState";
import TrashTabEmptyState from "./EmptyStates/TrashTabEmptyState";
import { MOCK_PASSWORD_CATEGORIES } from "@/data/seed";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { toast } from "sonner";

type SortOption = "name" | "recent" | "oldest";
type GroupOption = "none" | "category" | "strength" | "name";

interface PasswordListProps {
  onAddNew: () => void;
}

export function PasswordList({ onAddNew }: PasswordListProps) {
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [groupOption, setGroupOption] = useState<GroupOption>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const isLoadingPasswords = useUiStore((state) => state.isLoadingPasswords);
  const activeTabId = useUiStore((state) => state.activeTabId);

  const passwordItems = usePasswordStore((state) => state.passwordItems);
  const passwordCategories = usePasswordCategoryStore((state) => state.passwordCategories);

  const filteredPasswords = passwordItems.filter((item) => {
    const matchesTab =
      (activeTabId === "all" && !item.isDeleted) ||
      (activeTabId === "favorites" && item.isFavorite && !item.isDeleted) ||
      (activeTabId === "trash" && item.isDeleted);

    if (!matchesTab) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.username?.toLowerCase().includes(query) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(query.trim().toLowerCase()))
      );
    }

    return true;
  });

  // Handle Sorting
  const sortedPasswords = useMemo(() => {
    // Create a shallow copy to sort
    const sorted = [...filteredPasswords];
    switch (sortOption) {
      case "name":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
        sorted.sort((a, b) => b.updatedAt - a.updatedAt);
        break;
      case "oldest":
        sorted.sort((a, b) => a.updatedAt - b.updatedAt);
        break;
    }
    return sorted;
  }, [filteredPasswords, sortOption]);

  // Handle Grouping
  const groupedPasswords = useMemo(() => {
    if (groupOption === "none") return { All: sortedPasswords };

    const groups: Record<string, IPasswordItem[]> = {};

    sortedPasswords.forEach((item) => {
      let groupName = "Other";

      if (groupOption === "category") {
        const category = MOCK_PASSWORD_CATEGORIES.find((c) => c.id === item.categoryId);
        groupName = category ? category.name : "Uncategorized";
      } else if (groupOption === "strength") {
        const strength = getPasswordStrength(item.password);
        groupName = strength.charAt(0).toUpperCase() + strength.slice(1);
      } else if (groupOption === "name") {
        const firstChar = item.title.charAt(0).toUpperCase();
        groupName = /^[A-Z]$/.test(firstChar) ? firstChar : "#";
      }

      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    });

    return groups;
  }, [sortedPasswords, groupOption]);

  // Sort groups alphabetically if grouping by name
  const groupEntries = useMemo(() => {
    const entries = Object.entries(groupedPasswords);
    if (groupOption === "name") {
      return entries.sort(([a], [b]) => {
        if (a === "#") return 1;
        if (b === "#") return -1;
        return a.localeCompare(b);
      });
    }
    return entries;
  }, [groupedPasswords, groupOption]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCategoryColor = (catId?: string) => {
    return passwordCategories.find((c) => c.id === catId)?.color;
  };

  const syncDB = useUiStore((state) => state.syncDB);

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm border-r border-border/50">
      {/* --- HEADER --- */}
      <div className="p-4 border-b border-border/50 bg-background/95 sticky top-0 z-10 space-y-3">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-foreground/80">
            Passwords <span className="text-muted-foreground font-normal ml-1">({filteredPasswords.length})</span>
          </h2>

          <div className="flex items-center gap-1">
            {/* Group By Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  tabIndex={-1}
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 ${groupOption !== "none" ? "bg-emerald-500/30 text-emerald-600" : ""}`}
                  title="Group By"
                >
                  <LayoutGrid className="w-4 h-4 text-muted-foreground group-active:text-emerald-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Group By</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={groupOption} onValueChange={(v) => setGroupOption(v as GroupOption)}>
                  <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="category">Category</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="strength">Strength</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button tabIndex={-1} variant="ghost" size="icon" className="h-7 w-7" title="Sort By">
                  <ListFilter className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
                  <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="recent">Recently Updated</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

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
                } catch (error) {
                  toast.error("Failed to refresh vault");
                }
              }}
            >
              <RefreshCcw className="w-4 h-4 group-active:rotate-180 transition-transform text-muted-foreground group-active:text-emerald-600" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
          <Input
            tabIndex={-1}
            placeholder="Search vault..."
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
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* --- LIST CONTENT --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoadingPasswords ? (
          <PasswordListSkeleton />
        ) : (
          <div className="flex flex-col gap-1 p-2 pb-10">
            {sortedPasswords.length === 0 && activeTabId === "all" && (
              <AllTabEmptyState onAddNew={onAddNew} searchQuery={searchQuery} />
            )}
            {sortedPasswords.length === 0 && activeTabId === "favorites" && (
              <FavoritesTabEmptyState searchQuery={searchQuery} />
            )}
            {sortedPasswords.length === 0 && activeTabId === "trash" && (
              <TrashTabEmptyState searchQuery={searchQuery} />
            )}
            {sortedPasswords.length > 0 &&
              groupEntries.map(([groupName, groupItems]) => (
                <div key={groupName} className="flex flex-col gap-1.5">
                  {groupOption !== "none" && (
                    <div className="px-2 py-1 mt-2 first:mt-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        {groupName}
                      </span>
                    </div>
                  )}
                  {groupItems.map((item) => (
                    <PasswordListItem
                      key={item.id}
                      item={item}
                      onCopy={handleCopy}
                      categoryColor={getCategoryColor(item.categoryId) || ""}
                    />
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Optional: Bottom Gradient Fade for scrolling indication */}
      <div className="h-6 bg-linear-to-t from-background to-transparent pointer-events-none sticky bottom-0" />
    </div>
  );
}
