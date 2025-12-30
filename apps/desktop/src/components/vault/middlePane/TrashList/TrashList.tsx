import { Trash2Icon, ListFilter } from "lucide-react";
import TrashListItem from "./TrashListItem";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { useState, useMemo } from "react";
import { SearchInput } from "../../common/SearchInput";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type SortOption = "name" | "recent";

export default function TrashList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  const passwords = usePasswordStore((state) => state.passwordItems).filter((p) => p.isDeleted);
  const categories = usePasswordCategoryStore((state) => state.passwordCategories).filter((c) => c.isDeleted);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const items = [
      ...passwords.map((p) => ({ ...p, trashType: "password" as const })),
      ...categories.map((c) => ({ ...c, trashType: "category" as const })),
    ];

    const filtered = items.filter((item) => {
      const title = item.trashType === "password" ? item.title : item.name;
      return (
        title.toLowerCase().includes(q) ||
        (item.trashType === "password" &&
          (item.username?.toLowerCase().includes(q) || item.notes?.toLowerCase().includes(q)))
      );
    });

    if (sortOption === "name") {
      filtered.sort((a, b) => {
        const titleA = a.trashType === "password" ? a.title : a.name;
        const titleB = b.trashType === "password" ? b.title : b.name;
        return titleA.localeCompare(titleB);
      });
    } else {
      filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    return filtered;
  }, [passwords, categories, searchQuery, sortOption]);

  const passwordItems = filteredItems.filter((item) => item.trashType === "password");
  const categoryItems = filteredItems.filter((item) => item.trashType === "category");

  return (
    <div className="h-full flex flex-col bg-background/50 border-r border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-background/95 sticky top-0 z-10 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-foreground/80">
            Trash <span className="text-muted-foreground font-normal ml-1">({filteredItems.length})</span>
          </h2>

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
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1">
          <SearchInput placeholder="Search trash..." value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-1.5 p-2 pb-10">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl m-2 bg-muted/20">
              <Trash2Icon className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">{searchQuery ? "No matching items in trash" : "Trash is empty"}</p>
            </div>
          ) : (
            <>
              {categoryItems.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1 mt-2 first:mt-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Categories
                    </span>
                  </div>
                  {categoryItems.map((item) => (
                    <TrashListItem key={item.id} item={item} type="category" />
                  ))}
                </div>
              )}
              {passwordItems.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1 mt-2 first:mt-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Passwords
                    </span>
                  </div>
                  {passwordItems.map((item) => (
                    <TrashListItem key={item.id} item={item} type="password" />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
