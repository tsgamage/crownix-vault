import { Input } from "@/components/ui/input";
import { Search, Globe, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data Type
export interface PasswordItem {
  id: string;
  name: string;
  username: string;
  password?: string;
  url?: string;
  notes?: string;
  icon?: string;
  category: "login" | "secure-note";
  isFavorite: boolean;
}

interface PasswordListProps {
  items: PasswordItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PasswordList({
  items,
  selectedId,
  onSelect,
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
              <button
                key={item.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50 focus:outline-none focus:bg-muted",
                  selectedId === item.id &&
                    "bg-emerald-500/10 hover:bg-emerald-500/15 ring-1 ring-emerald-500/20"
                )}
                onClick={() => onSelect(item.id)}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                    selectedId === item.id
                      ? "bg-background border-emerald-500/30 text-emerald-600"
                      : "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {item.icon ? (
                    <img src={item.icon} alt={item.name} className="w-5 h-5" />
                  ) : (
                    <Globe className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-medium text-sm truncate",
                      selectedId === item.id
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-foreground"
                    )}
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.username}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
