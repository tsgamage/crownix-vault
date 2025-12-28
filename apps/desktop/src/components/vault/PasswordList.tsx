import { Input } from "@/components/ui/input";
import { Search, KeyRound } from "lucide-react";
import type { IPasswordItem } from "@/utils/types/global.types";
import PasswordItem from "./PasswordItem";

interface PasswordListProps {
  items: IPasswordItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PasswordList({
  selectedId,
  onSelect,
  items,
  searchQuery,
  onSearchChange,
}: PasswordListProps) {
  return (
    <div className="h-full flex flex-col bg-background border-r border-border/50">
      {/* Search Bar */}
      <div className="p-4 border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vault..."
            className="pl-9 h-9 bg-muted/50 border-transparent focus:bg-background transition-colors"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 p-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <KeyRound className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">No items found</p>
            </div>
          ) : (
            items.map((item) => (
              <PasswordItem
                key={item.id}
                item={item}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
