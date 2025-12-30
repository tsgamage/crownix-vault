import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, X, AlertCircle, ArrowRight } from "lucide-react";
import type { IPasswordItem } from "@/utils/types/global.types";
import { Card, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
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
      {/* Header */}
      <div className="p-6 border-b border-border/40 flex items-center justify-between bg-background shrink-0">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-lg", cardConfig?.bgClass, cardConfig?.colorClass)}>
            <HeaderIcon className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none capitalize tracking-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 font-medium flex items-center gap-1.5">
              {items.length} {items.length === 1 ? "item needs" : "items need"} attention
            </p>
          </div>
        </div>
        {!isSheet && (
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full hover:bg-muted transition-colors"
            onClick={onClose}
          >
            <X className="size-4 text-muted-foreground" />
          </Button>
        )}
      </div>

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
                  <Card key={item.id} className="p-4 gap-0 shadow-none hover:bg-muted/30 transition-colors">
                    <CardContent className="px-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm font-bold truncate">{item.title}</CardTitle>
                          <CardDescription className="truncate mt-1">{item.username || "No username"}</CardDescription>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-0 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs font-bold gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleResolveClick(item)}
                      >
                        Resolve
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </CardFooter>
                  </Card>
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
