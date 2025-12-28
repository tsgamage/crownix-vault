import { Trash2Icon } from "lucide-react";

export default function TrashTabEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 text-center text-muted-foreground space-y-3 animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
        <Trash2Icon className="h-8 w-8 opacity-20" />
      </div>
      <div>
        <p className="text-sm font-medium">No items found in Trash</p>
        <p className="text-xs opacity-60">
          Looks like you have no deleted items
        </p>
      </div>
    </div>
  );
}
