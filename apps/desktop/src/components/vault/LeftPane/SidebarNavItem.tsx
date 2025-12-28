import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  label: string;
  icon?: LucideIcon;
  emoji?: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  color?: string; // For categories
  kbd?: string;
  variant?: "default" | "destructive";
}

export function SidebarNavItem({
  label,
  icon: Icon,
  emoji,
  count,
  isActive,
  onClick,
  color,
  kbd,
  variant,
}: SidebarNavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 h-10 font-normal transition-all duration-200 group relative",
        isActive
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        variant === "destructive" && "text-destructive hover:bg-destructive/10 hover:text-destructive"
      )}
      onClick={onClick}
    >
      {/* Active Indicator Line */}
      {isActive && (
        <div className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full" />
      )}

      {/* Icon/Emoji Logic */}
      <div className="flex items-center justify-center shrink-0">
        {Icon && (
          <Icon className={cn("w-4 h-4", isActive && "text-emerald-600")} />
        )}
        {emoji && <span className="text-sm">{emoji}</span>}
        {color && !emoji && !Icon && (
          <div className={cn("w-2 h-2 rounded-full", color)} />
        )}
      </div>

      <span className="flex-1 truncate text-sm">{label}</span>

      {/* Count Badge */}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-full bg-muted group-hover:bg-background transition-colors",
            isActive &&
              "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
          )}
        >
          {count}
        </span>
      )}
      {kbd && (
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            {kbd}
          </kbd>
        </div>
      )}
    </Button>
  );
}
