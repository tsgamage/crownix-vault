import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, X, AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { IPasswordItem } from "@/utils/types/global.types";
import { SECURITY_CARDS, type SecurityIssueType } from "../security.config";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui.store";
import { usePasswordStore } from "@/store/vault/password.store";

interface SecurityDetailsPaneProps {
  type: SecurityIssueType;
  title: string;
  items: IPasswordItem[];
  onClose: () => void;
  isSheet?: boolean;
}

export function SecurityDetailsPane({ type, title, items, onClose, isSheet = false }: SecurityDetailsPaneProps) {
  const cardConfig = useMemo(() => {
    return SECURITY_CARDS.find((c) => c.id === type);
  }, [type]);

  const setIsPasswordDetailsShown = useUiStore((state) => state.setIsPasswordDetailsShown);
  const setSelectedPasswordId = usePasswordStore((state) => state.setSelectedPasswordId);

  const HeaderIcon = cardConfig?.icon || AlertCircle;

  const handleResolveClick = (item: IPasswordItem) => {
    setSelectedPasswordId(item.id);
    setIsPasswordDetailsShown(true);
  };

  const Content = (
    <div className="flex flex-col h-full bg-background overflow-hidden font-sans">
      <div className="px-6 py-5 flex items-center justify-between bg-background shrink-0">
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded-xl", cardConfig?.bgClass, cardConfig?.colorClass)}>
            <HeaderIcon className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight tracking-tight">{title}</h3>
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
              {items.length} {items.length === 1 ? "issue" : "issues"} detected
            </p>
          </div>
        </div>
        {!isSheet && (
          <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={onClose}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      <Separator className="opacity-50" />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/10">
                  <CheckCircle2 className="size-8 text-primary" />
                </div>
                <h4 className="font-bold text-lg tracking-tight">Vault Secured</h4>
                <p className="text-sm text-muted-foreground max-w-[240px] mt-2 leading-relaxed">
                  No security issues found in this category.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-center justify-between p-4 rounded-2xl bg-card border border-border/40 hover:border-primary/20 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                        <ShieldAlert className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold truncate tracking-tight">{item.title}</h4>
                        <p className="text-[11px] text-muted-foreground truncate font-medium">
                          {item.username || "No username"}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
                      onClick={() => handleResolveClick(item)}
                    >
                      <ArrowRight className="size-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  if (isSheet) {
    return <div className="h-full flex flex-col bg-background">{Content}</div>;
  }

  return (
    <div className="h-full flex flex-col bg-background border-l border-border/40 w-[420px] relative z-20">
      {Content}
    </div>
  );
}
