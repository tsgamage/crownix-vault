import { HealthScoreCard } from "./HealthScoreCard";
import { SecurityAnalysisCard } from "./SecurityAnalysisCard";
import {
  SECURITY_CARDS,
  GENERATOR_CARDS,
  type SecurityIssueType,
  type GeneratorType,
} from "../security.config";

interface SecurityDashboardProps {
  healthScore: number;
  issueCounts: Record<SecurityIssueType, number>;
  selectedIssue: SecurityIssueType | null;
  selectedGenerator: GeneratorType | null;
  onSelectIssue: (issue: SecurityIssueType) => void;
  onSelectGenerator: (gen: GeneratorType) => void;
}

export function SecurityDashboard({
  healthScore,
  issueCounts,
  selectedIssue,
  selectedGenerator,
  onSelectIssue,
  onSelectGenerator,
}: SecurityDashboardProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
      {/* Health Score */}
      <HealthScoreCard score={healthScore} />

      {/* Analysis Section */}
      <div className="mb-10">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Security Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Tools Section */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Tools & Generators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GENERATOR_CARDS.map((card) => (
            <SecurityAnalysisCard
              key={card.id}
              config={card}
              selected={selectedGenerator === card.id}
              onClick={() => onSelectGenerator(card.id as GeneratorType)}
              isGenerator
            />
          ))}
        </div>
      </div>
    </div>
  );
}
