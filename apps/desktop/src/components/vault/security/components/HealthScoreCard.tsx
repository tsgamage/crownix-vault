import { cn } from "@/lib/utils";

interface HealthScoreCardProps {
  score: number;
}

export function HealthScoreCard({ score }: HealthScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "At Risk";
  };

  return (
    <div className="flex items-center gap-8 mb-10">
      <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
        {/* Simple SVG Circle Progress */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * score) / 100}
            className={cn(
              "transition-all duration-1000 ease-out",
              getScoreColor(score)
            )}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl font-bold", getScoreColor(score))}>
            {Math.round(score)}
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-xl font-semibold">Vault Health Score</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your score is calculated based on password strength, reuse frequency,
          and potential vulnerabilities. Improve your passwords to increase this
          score.
        </p>
      </div>
    </div>
  );
}
