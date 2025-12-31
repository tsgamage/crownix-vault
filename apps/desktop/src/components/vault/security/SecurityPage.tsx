import { useMemo, useState } from "react";
import {
  findReusedPasswords,
  findWeakPasswords,
  findCommonPasswords,
  findPatternPasswords,
  analyzeVaultHealth,
} from "@/utils/Password/pwd.utils";
import { SecurityDashboard } from "./components/SecurityDashboard";
import { SecurityDetailsPane } from "./components/SecurityDetailsPane";
import { PasswordDetail } from "../RightPane/Password/PasswordDetail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { SecurityIssueType } from "./security.config";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePasswordStore } from "@/store/vault/password.store";
import { useUiStore } from "@/store/ui.store";

export default function SecurityPage() {
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssueType | null>(null);

  const allItems = usePasswordStore((state) => state.passwordItems).filter((i) => !i.isDeleted);
  const isPasswordDetailsShown = useUiStore((state) => state.isPasswordDetailsShown);
  const setIsPasswordDetailsShown = useUiStore((state) => state.setIsPasswordDetailsShown);
  const clearSelectedId = usePasswordStore((state) => state.clearSelectedPasswordId);

  const analysis = useMemo(() => {
    const active = allItems.filter((i) => !i.isDeleted);
    const vaultHealth = analyzeVaultHealth(active);

    return {
      healthScore: vaultHealth.score,
      reused: findReusedPasswords(active),
      weak: findWeakPasswords(active),
      common: findCommonPasswords(active),
      pattern: findPatternPasswords(active),
      compromised: [],
      vaultHealth, // Include the full analysis
    };
  }, [allItems]);

  const issueCounts: Record<SecurityIssueType, number> = {
    compromised: analysis.compromised.length,
    reused: analysis.reused.length,
    weak: analysis.weak.length,
    common: analysis.common.length,
    pattern: analysis.pattern.length,
  };

  const getItemsForIssue = (issue: SecurityIssueType) => {
    switch (issue) {
      case "compromised":
        return analysis.compromised;
      case "reused":
        return analysis.reused;
      case "weak":
        return analysis.weak;
      case "common":
        return analysis.common;
      case "pattern":
        return analysis.pattern;
      default:
        return [];
    }
  };

  const handleSelectIssue = (issue: SecurityIssueType) => {
    // Toggle if already selected
    if (selectedIssue === issue) {
      setSelectedIssue(null);
    } else {
      setSelectedIssue(issue);
    }
  };

  const handleCloseRightPane = () => {
    setSelectedIssue(null);
  };

  const isSheetOpen = !!selectedIssue;

  const handleClosePasswordDetailsSheet = () => {
    clearSelectedId();
    setIsPasswordDetailsShown(false);
  };

  return (
    <div className="h-full flex-1 flex flex-col bg-background">
      {/* --- HEADER --- */}
      <div className="px-8 py-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Security Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {allItems.length === 0
            ? "No vault items found."
            : "Overview of your vault's security health and vulnerabilities."}
        </p>
      </div>
      <Separator className="opacity-50" />

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <SecurityDashboard
            healthScore={analysis.healthScore}
            issueCounts={issueCounts}
            selectedIssue={selectedIssue}
            onSelectIssue={handleSelectIssue}
            vaultAnalysis={analysis.vaultHealth}
          />
        </ScrollArea>
      </div>

      <Sheet open={isPasswordDetailsShown} onOpenChange={(open) => !open && handleClosePasswordDetailsSheet()}>
        <SheetContent className="w-[50%] sm:max-w-none p-0 border-none">
          <PasswordDetail showBackButton />
        </SheetContent>
      </Sheet>

      <Sheet open={isSheetOpen} onOpenChange={(open) => !open && handleCloseRightPane()}>
        <SheetContent className="w-100 sm:w-135 p-0">
          {selectedIssue && (
            <SecurityDetailsPane
              type={selectedIssue}
              title={selectedIssue + " Items"}
              items={getItemsForIssue(selectedIssue)}
              onClose={handleCloseRightPane}
              isSheet
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
