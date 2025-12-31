import { HealthScoreCard } from "./HealthScoreCard";
import { SecurityAnalysisCard } from "./SecurityAnalysisCard";
import { SECURITY_CARDS, type SecurityIssueType } from "../security.config";
import { analyzeVaultHealth } from "@/utils/Password/pwd.utils";
import { CheckCircle2, Info, Fingerprint, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SecurityDashboardProps {
  passwordsCount: number;
  healthScore: number;
  issueCounts: Record<SecurityIssueType, number>;
  selectedIssue: SecurityIssueType | null;
  onSelectIssue: (issue: SecurityIssueType) => void;
  vaultAnalysis?: ReturnType<typeof analyzeVaultHealth>;
}

export function SecurityDashboard({
  passwordsCount,
  healthScore,
  issueCounts,
  selectedIssue,
  onSelectIssue,
  vaultAnalysis,
}: SecurityDashboardProps) {
  return (
    <div className="p-8 space-y-10">
      {/* Health Score */}
      {passwordsCount > 0 && (
        <div className="space-y-10">
          <HealthScoreCard score={healthScore} />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Security Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECURITY_CARDS.map((card) => (
                <SecurityAnalysisCard
                  key={card.id}
                  config={card}
                  count={issueCounts[card.id as SecurityIssueType]}
                  selected={selectedIssue === card.id}
                  onClick={() => onSelectIssue(card.id as SecurityIssueType)}
                />
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {vaultAnalysis && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Health Insights</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Section */}
                <div className="lg:col-span-1">
                  <div className="p-6 rounded-3xl bg-card border border-border/40 h-full flex flex-col justify-center">
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                          <Activity className="w-6 h-6" />
                        </div>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Quality
                              </p>
                              <p className="text-2xl font-black leading-none">
                                {Math.round(vaultAnalysis.averagePasswordScore)}%
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Overall strength of all passwords</TooltipContent>
                        </Tooltip>
                      </div>

                      <Tooltip>
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 shrink-0">
                            <Fingerprint className="w-6 h-6" />
                          </div>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                  Unique
                                </p>

                                <p className="text-2xl font-black leading-none">
                                  {Math.round(vaultAnalysis.uniquenessPercentage)}%
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Rate of non-reused passwords</TooltipContent>
                          </Tooltip>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Suggestions Section */}
                <div className="lg:col-span-2">
                  <div className="p-5 rounded-3xl bg-card border border-border/40 h-full">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-1">
                      Actionable Recommendations
                    </p>
                    <div className="grid gap-2">
                      {vaultAnalysis.suggestions.map((s, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex gap-3 p-3 rounded-2xl items-start transition-all duration-300",
                            s.includes("Excellent") || s.includes("Good")
                              ? "bg-emerald-500/5 border border-emerald-500/10"
                              : "bg-amber-500/5 border border-amber-500/10"
                          )}
                        >
                          {s.includes("Excellent") || s.includes("Good") ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={cn(
                              "text-xs font-semibold leading-relaxed",
                              s.includes("Excellent") || s.includes("Good")
                                ? "text-emerald-700/80"
                                : "text-amber-700/80"
                            )}
                          >
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
