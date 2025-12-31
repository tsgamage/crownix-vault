import { Star } from "lucide-react";

export default function FavoritesTabEmptyState({
  searchQuery,
}: {
  searchQuery: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center pt-20 text-center text-muted-foreground space-y-3">
      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
        <Star className="h-8 w-8 opacity-20" />
      </div>
      <div>
        <p className="text-sm font-medium">No Favorites found</p>
        <p className="text-xs opacity-60">
          {searchQuery
            ? `No results for "${searchQuery}"`
            : "Add your first favorite"}
        </p>
      </div>
    </div>
  );
}
