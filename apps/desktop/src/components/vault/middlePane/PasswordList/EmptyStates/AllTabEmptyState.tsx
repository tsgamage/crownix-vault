import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui.store";
import { PlusIcon, Search } from "lucide-react";

export default function AllTabEmptyState({ searchQuery }: { searchQuery?: string }) {
  const setIsPasswordCreateShown = useUiStore((state) => state.setIsPasswordCreateShown);
  return (
    <div className="flex flex-col items-center justify-center pt-20 text-center text-muted-foreground space-y-3 animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
        {searchQuery ? <Search className="h-8 w-8 opacity-20" /> : <PlusIcon className="h-8 w-8 opacity-20" />}
      </div>

      <div>
        <p className="text-sm font-medium">No items found</p>
        <p className="text-xs opacity-60">{searchQuery ? "Try adjusting your search terms" : "Add some items"}</p>
      </div>

      {!searchQuery && (
        <Button variant="outline" size="sm" onClick={() => setIsPasswordCreateShown(true)} className="mt-2">
          <PlusIcon className="w-3 h-3 mr-2" /> Add New Item
        </Button>
      )}
    </div>
  );
}
