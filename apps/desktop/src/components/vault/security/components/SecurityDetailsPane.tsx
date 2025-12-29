import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Copy } from "lucide-react";
import type { IPasswordItem } from "@/utils/types/global.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SecurityDetailsPaneProps {
  title: string;
  items: IPasswordItem[];
  onClose: () => void;
  isSheet?: boolean;
}

export function SecurityDetailsPane({
  title,
  items,
  onClose,
  isSheet = false,
}: SecurityDetailsPaneProps) {
  const handleCopyOldPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd);
    toast.success("Password copied");
  };

  const Content = (
    <>
      <div className="p-6 border-b border-border/40 flex items-center justify-between bg-background shrink-0">
        <div>
          <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {items.length} items need attention
          </p>
        </div>
        {!isSheet && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No issues found in this category.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-card border border-border/50 rounded-lg shadow-xs hover:border-primary/30 transition-colors group relative"
              >
                <div className="font-medium text-sm mb-1">{item.title}</div>
                <div className="text-xs text-muted-foreground truncate mb-2">
                  {item.username}
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleCopyOldPassword(item.password)}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy Pwd
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs px-3 bg-emerald-600 hover:bg-emerald-700 text-white ml-auto"
                  >
                    Fix Now
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </>
  );

  if (isSheet) {
    return <div className="h-full flex flex-col">{Content}</div>;
  }

  return (
    <div className="w-[400px] border-l border-border/40 flex flex-col bg-muted/5 animate-in slide-in-from-right-10 duration-300">
      {Content}
    </div>
  );
}
