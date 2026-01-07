import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsSection } from "./components/SettingsSection";
import { type SettingsConfig } from "@/utils/types/global.types";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui.store";
import { SettingsIcon } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

interface SettingsModalProps {
  config: SettingsConfig;
  onSettingChange: (id: string, value: any) => void;
}

export function SettingsModal({ config, onSettingChange }: SettingsModalProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(config.sections[0]?.id || "");

  const isSettingsOpen = useUiStore((state) => state.isSettingsOpen);
  const setIsSettingsOpen = useUiStore((state) => state.setIsSettingsOpen);

  // Update active section if config changes (e.g. initial load)
  useEffect(() => {
    if (config.sections.length > 0 && !activeSectionId) {
      setActiveSectionId(config.sections[0].id);
    }
  }, [config, activeSectionId]);

  const hasSidebar = config.sections.length > 1;
  const activeSection = config.sections.find((s) => s.id === activeSectionId);

  return (
    <Dialog open={isSettingsOpen} onOpenChange={() => setIsSettingsOpen(false)}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 py-6 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-sm mt-1">
              <SettingsIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold tracking-tight">Settings</DialogTitle>
            </div>
          </div>
          <DialogDescription className="sr-only">Settings</DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {hasSidebar && (
            <aside className="w-64 border-r border-border/50 bg-muted/10 flex flex-col p-4 space-y-2 overflow-y-auto">
              {config.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    "flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors text-left",
                    activeSectionId === section.id
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {activeSectionId === section.id && <div className="w-1 h-4 bg-emerald-500 rounded-full mr-2" />}
                  {section.title}
                </button>
              ))}
            </aside>
          )}

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="px-8 py-8 space-y-8 max-w-3xl">
              {hasSidebar
                ? activeSection && (
                    <SettingsSection section={activeSection} onSettingChange={onSettingChange} isLast={true} />
                  )
                : config.sections.map((section, index) => (
                    <SettingsSection
                      key={section.id}
                      section={section}
                      onSettingChange={onSettingChange}
                      isLast={index === config.sections.length - 1}
                    />
                  ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
