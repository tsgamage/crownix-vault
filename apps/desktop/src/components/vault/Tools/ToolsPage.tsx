import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GENERATOR_CARDS, type GeneratorType } from "../security/security.config";
import { SecurityAnalysisCard } from "../security/components/SecurityAnalysisCard";
import { GeneratorPane } from "../security/components/GeneratorPane";
import { WrenchIcon } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<GeneratorType | null>(null);

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId as GeneratorType);
  };

  const handleClose = () => {
    setSelectedTool(null);
  };

  return (
    <div className="h-full flex-1 flex flex-col bg-background  ">
      {/* --- HEADER --- */}
      <div className="px-8 py-6 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Vault Tools</h1>
            <p className="text-sm text-muted-foreground">Your security and cryptographic tools.</p>
          </div>
        </div>
      </div>
      <Separator className="opacity-50" />

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-8 space-y-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
              {GENERATOR_CARDS.map((card) => (
                <div key={card.id}>
                  <SecurityAnalysisCard
                    config={card}
                    selected={selectedTool === card.id}
                    onClick={() => handleToolClick(card.id)}
                    isGenerator
                  />
                </div>
              ))}
            </div>

            {/* Tips/Info Section */}
            <div>
              <div className="p-8 rounded-[2rem] bg-card border border-border/40 space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Security Architecture
                  </h3>
                  <Separator className="flex-1 opacity-20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold tracking-tight">Zero-Knowledge Generation</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      All secrets are generated locally on your device using cryptographically secure random number
                      generators. No data ever leaves your vault.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold tracking-tight">Cryptographic Entropy</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Our generators utilize high-entropy sources to ensure that every secret is unpredictable and
                      resistant to modern brute-force attacks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <Sheet open={!!selectedTool} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent className="w-[440px] sm:w-[540px] p-0 border-none flex flex-col h-full overflow-hidden">
          {selectedTool && <GeneratorPane type={selectedTool} onClose={handleClose} isSheet={true} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
