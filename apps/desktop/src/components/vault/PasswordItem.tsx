import type { IPasswordItem } from "@/utils/types/global.types";
import { cn } from "@/lib/utils";
import { KeyRoundIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface Props {
  item: IPasswordItem;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function PasswordItem({ item, selectedId, onSelect }: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full h-full">
        <button
          key={item.id}
          className={cn(
            "w-full h-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50 focus:outline-none ",
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
              <p>{item.icon}</p>
            ) : (
              <KeyRoundIcon className="w-5 h-5" />
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
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {item.username}
            </p>
          </div>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset>View Info</ContextMenuItem>
        <ContextMenuItem inset>Copy Password</ContextMenuItem>
        <ContextMenuItem inset>Copy Username</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuItem>Reload</ContextMenuItem>
            <ContextMenuItem>Export</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              variant="destructive"
              onClick={() => console.log("Deleting", item.title)}
            >
              Delete
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
