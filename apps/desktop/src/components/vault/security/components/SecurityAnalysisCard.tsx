import { cn } from "@/lib/utils";
import type { SecurityCardConfig, GeneratorCardConfig } from "../security.config";

interface SecurityAnalysisCardProps {
  config: SecurityCardConfig | GeneratorCardConfig;
  count?: number; // Optional count for issues
  selected: boolean;
  onClick: () => void;
  isGenerator?: boolean; // To distinct style if needed
}

export function SecurityAnalysisCard({ config, count, selected, onClick, isGenerator }: SecurityAnalysisCardProps) {
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col p-5 rounded-xl border transition-all text-left group h-full",
        selected
          ? cn(
              config.bgClass,
              (config as any).borderColorClass || "ring-emerald-500", // Fallback or strict type check
              (config as any).borderColorClass || "border-emerald-500"
            )
          : "bg-card hover:shadow-md border-border/50 hover:border-border/80"
      )}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <div className={cn("p-2.5 rounded-lg", config.bgClass, config.colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        {!isGenerator && typeof count === "number" && (
          <span className={cn("text-2xl font-bold", count > 0 ? config.colorClass : "text-muted-foreground")}>
            {count}
          </span>
        )}
      </div>
      <h4 className="font-semibold text-foreground">{config.title}</h4>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{config.description}</p>
    </button>
  );
}
