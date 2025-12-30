import { useMemo, useState } from "react";
import {
  calculateVaultHealthScore,
  findReusedPasswords,
  findWeakPasswords,
  findCommonPasswords,
  getActiveItems,
} from "@/utils/pwd.utils";
import type { SecurityIssueType, GeneratorType } from "./security.config";
import { SecurityDashboard } from "./components/SecurityDashboard";
import { SecurityDetailsPane } from "./components/SecurityDetailsPane";
import { GeneratorPane } from "./components/GeneratorPane";
import { PasswordDetail } from "../RightPane/Password/PasswordDetail";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePasswordStore } from "@/store/vault/password.store";
import { useUiStore } from "@/store/ui.store";

export default function SecurityPage() {
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssueType | null>(null);
  const [selectedGenerator, setSelectedGenerator] = useState<GeneratorType | null>(null);

  const allItems = usePasswordStore((state) => state.passwordItems).filter((i) => !i.isDeleted);
  const isPasswordDetailsShown = useUiStore((state) => state.isPasswordDetailsShown);
  const setIsPasswordDetailsShown = useUiStore((state) => state.setIsPasswordDetailsShown);
  const clearSelectedId = usePasswordStore((state) => state.clearSelectedPasswordId);

  const analysis = useMemo(() => {
    const active = getActiveItems(allItems);
    return {
      healthScore: calculateVaultHealthScore(active),
      reused: findReusedPasswords(active),
      weak: findWeakPasswords(active),
      common: findCommonPasswords(active),
      compromised: [],
    };
  }, [allItems]);

  const issueCounts: Record<SecurityIssueType, number> = {
    compromised: analysis.compromised.length,
    reused: analysis.reused.length,
    weak: analysis.weak.length,
    common: analysis.common.length,
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
      setSelectedGenerator(null); // Deselect generator
    }
  };

  const handleSelectGenerator = (gen: GeneratorType) => {
    // Toggle
    if (selectedGenerator === gen) {
      setSelectedGenerator(null);
    } else {
      setSelectedGenerator(gen);
      setSelectedIssue(null); // Deselect issue
    }
  };

  const handleCloseRightPane = () => {
    setSelectedIssue(null);
    setSelectedGenerator(null);
  };

  const isSheetOpen = !!selectedIssue || !!selectedGenerator;

  const handleClosePasswordDetailsSheet = () => {
    clearSelectedId();
    setIsPasswordDetailsShown(false);
  };

  return (
    <div className="h-full flex-1 flex flex-col bg-background animate-in fade-in duration-300">
      {/* --- HEADER --- */}
      <div className="p-8 border-b border-border/40 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Security Dashboard</h1>
        <p className="text-muted-foreground">
          {allItems.length === 0
            ? "No vault items found."
            : "Overview of your vault's security health and vulnerabilities."}
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex min-h-0">
        <SecurityDashboard
          healthScore={analysis.healthScore}
          issueCounts={issueCounts}
          selectedIssue={selectedIssue}
          selectedGenerator={selectedGenerator}
          onSelectIssue={handleSelectIssue}
          onSelectGenerator={handleSelectGenerator}
          passwordsCount={allItems.length}
        />
      </div>

      <Sheet open={isPasswordDetailsShown} onOpenChange={(open) => !open && handleClosePasswordDetailsSheet()}>
        <SheetContent className="w-[50%] sm:max-w-none p-0 border-none">
          <PasswordDetail showBackButton />
        </SheetContent>
      </Sheet>

      <Sheet open={isSheetOpen} onOpenChange={(open) => !open && handleCloseRightPane()}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0">
          {selectedIssue && (
            <SecurityDetailsPane
              type={selectedIssue}
              title={selectedIssue + " Items"}
              items={getItemsForIssue(selectedIssue)}
              onClose={handleCloseRightPane}
              isSheet
            />
          )}

          {selectedGenerator && <GeneratorPane type={selectedGenerator} onClose={handleCloseRightPane} isSheet />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
