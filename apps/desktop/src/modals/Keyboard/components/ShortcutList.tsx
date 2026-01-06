import type { Shortcut } from "../types";
import { ShortcutItem } from "./ShortcutItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShortcutListProps {
  shortcuts: Shortcut[];
  onUpdateShortcut: (updatedShortcut: Shortcut) => void;
}

export function ShortcutList({ shortcuts, onUpdateShortcut }: ShortcutListProps) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {shortcuts.map((shortcut) => (
          <ShortcutItem key={shortcut.id} shortcut={shortcut} onUpdate={onUpdateShortcut} />
        ))}
      </div>
    </ScrollArea>
  );
}
