import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  RefreshCw,
  X,
  KeyRound,
  Type,
  Hash,
  ShieldCheck,
  Scan,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  generatePassphrase,
  generateOTP,
  generateRecoveryCode,
  calculatePasswordScore,
  getPasswordStrength,
  analyzePassword,
  analyzePasswordPatterns,
  type PasswordAnalysis,
  generatePassword,
} from "@/utils/Password/pwd.utils";
import type { GeneratorType } from "../security.config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GeneratorPaneProps {
  type: GeneratorType;
  onClose: () => void;
  isSheet?: boolean;
}

export function GeneratorPane({ type, onClose, isSheet = false }: GeneratorPaneProps) {
  const [value, setValue] = useState("");
  const [length, setLength] = useState(16);
  const [passphraseWords, setPassphraseWords] = useState(4);
  const [otpLength, setOtpLength] = useState(6);

  // Analyzer States
  const [analyzerValue, setAnalyzerValue] = useState("");
  const [analysisResults, setAnalysisResults] = useState<PasswordAnalysis | null>(null);
  const [patternResults, setPatternResults] = useState<ReturnType<typeof analyzePasswordPatterns> | null>(null);
  const [isAnalyzerVisible, setIsAnalyzerVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handlers
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      if (type === "password") {
        const pwd = await generatePassword({ length, strength: "excellent" });
        setValue(pwd);
      } else if (type === "passphrase") {
        setValue(generatePassphrase(passphraseWords));
      } else if (type === "otp") {
        setValue(generateOTP(otpLength));
      } else if (type === "recovery-code") {
        setValue(generateRecoveryCode());
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    if (type !== "analyzer") {
      handleGenerate();
    }
  }, [type]);

  const handleAnalyze = () => {
    if (!analyzerValue) return;
    const results = analyzePassword(analyzerValue);
    const patterns = analyzePasswordPatterns(analyzerValue);
    setAnalysisResults(results);
    setPatternResults(patterns);
  };

  const getStrengthColor = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-orange-500";
    return "bg-emerald-500";
  };

  const configSection = (
    <div className="space-y-6">
      {type === "password" && (
        <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex justify-between items-center px-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password Length
            </Label>
            <span className="text-lg font-bold text-primary">{length}</span>
          </div>
          <Slider value={[length]} onValueChange={(v) => setLength(v[0])} min={8} max={128} step={1} className="py-2" />
        </div>
      )}

      {type === "passphrase" && (
        <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex justify-between items-center px-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Word Count</Label>
            <span className="text-lg font-bold text-primary">{passphraseWords}</span>
          </div>
          <Slider
            value={[passphraseWords]}
            onValueChange={(v) => setPassphraseWords(v[0])}
            min={1}
            max={128}
            step={1}
            className="py-2"
          />
        </div>
      )}

      {type === "otp" && (
        <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex justify-between items-center px-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">OTP Digits</Label>
            <span className="text-lg font-bold text-primary">{otpLength}</span>
          </div>
          <Slider
            value={[otpLength]}
            onValueChange={(v) => setOtpLength(v[0])}
            min={4}
            max={10}
            step={1}
            className="py-2"
          />
        </div>
      )}
    </div>
  );

  const Content = (
    <>
      <div className="px-6 py-5 flex items-center justify-between bg-background shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            {type === "password" && <KeyRound className="w-5 h-5" />}
            {type === "passphrase" && <Type className="w-5 h-5" />}
            {type === "otp" && <Hash className="w-5 h-5" />}
            {type === "recovery-code" && <ShieldCheck className="w-5 h-5" />}
            {type === "analyzer" && <Scan className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight tracking-tight">
              {type === "password" && "Password Generator"}
              {type === "passphrase" && "Passphrase Generator"}
              {type === "otp" && "OTP Generator"}
              {type === "recovery-code" && "Recovery Codes"}
              {type === "analyzer" && "Password Analyzer"}
            </h3>
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
              Secure secret generation
            </p>
          </div>
        </div>
        {!isSheet && (
          <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator className="opacity-50" />

      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-8">
            {type !== "analyzer" ? (
              <div className="space-y-4">
                <div
                  className={cn(
                    "relative min-h-[160px] p-6 rounded-2xl bg-card border border-border/60 shadow-inner flex items-center justify-center text-center transition-all duration-300 group",
                    "hover:border-primary/30"
                  )}
                >
                  <div
                    className={cn(
                      "font-mono font-bold break-all leading-tight tracking-wide",
                      type === "otp" ? "text-5xl" : value.length > 24 ? "text-xl" : "text-3xl",
                      !value && "text-muted-foreground/30 italic text-xl"
                    )}
                  >
                    {value || "Generating..."}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 h-12 gap-2 shadow-lg" onClick={handleCopy}>
                    <Copy className="w-4 h-4" /> Copy Securely
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    title="Regenerate"
                  >
                    <RefreshCw className={cn("w-5 h-5", isGenerating && "animate-spin")} />
                  </Button>
                </div>

                {type === "password" && value && (
                  <div className="space-y-2 ">
                    <div className="flex justify-between items-end px-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Security Strength
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold uppercase tracking-tight",
                          calculatePasswordScore(value) < 40
                            ? "text-red-500"
                            : calculatePasswordScore(value) < 70
                            ? "text-orange-500"
                            : "text-emerald-500"
                        )}
                      >
                        {getPasswordStrength(value).replace("-", " ")} ({Math.round(calculatePasswordScore(value))}%)
                      </span>
                    </div>
                    <Progress
                      value={calculatePasswordScore(value)}
                      className="h-1.5"
                      indicatorClassName={getStrengthColor(calculatePasswordScore(value))}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Password to Analyze
                    </Label>
                    <div className="relative">
                      <Input
                        type={isAnalyzerVisible ? "text" : "password"}
                        placeholder="Enter password..."
                        value={analyzerValue}
                        onChange={(e) => setAnalyzerValue(e.target.value)}
                        className="pr-10 h-11 bg-card border-border/60"
                        autoComplete="one-time-code"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsAnalyzerVisible(!isAnalyzerVisible)}
                      >
                        {isAnalyzerVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-11 gap-2" onClick={handleAnalyze}>
                    <Scan className="w-4 h-4" /> Run Analysis
                  </Button>
                </div>

                {analysisResults && (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-card border border-border/60 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm tracking-tight">Analysis Result</h4>
                        <span
                          className={cn(
                            "text-xs font-black uppercase px-2 py-0.5 rounded-full",
                            analysisResults.score < 40
                              ? "bg-red-500/10 text-red-500"
                              : analysisResults.score < 70
                              ? "bg-orange-500/10 text-orange-500"
                              : "bg-emerald-500/10 text-emerald-500"
                          )}
                        >
                          {analysisResults.strength.replace("-", " ")}
                        </span>
                      </div>
                      <Progress
                        value={analysisResults.score}
                        className="h-2"
                        indicatorClassName={getStrengthColor(analysisResults.score)}
                      />
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase px-0.5">
                        <span>Weak</span>
                        <span>Score: {Math.round(analysisResults.score)}/100</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    {analysisResults.weaknesses.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                          Detected Weaknesses
                        </Label>
                        <div className="grid gap-2">
                          {analysisResults.weaknesses.map((w, i) =>
                            w === "Excellent password - no weaknesses detected" ? (
                              <div
                                key={i}
                                className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 items-start"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-xs text-emerald-700/80 font-medium leading-relaxed">{w}</span>
                              </div>
                            ) : (
                              <div
                                key={i}
                                className="flex gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10 items-start"
                              >
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-xs text-red-700/80 font-medium leading-relaxed">{w}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {analysisResults.suggestions.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                          Actionable Improvements
                        </Label>
                        <div className="grid gap-2">
                          {analysisResults.suggestions.map((s, i) => (
                            <div
                              key={i}
                              className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 items-start"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-xs text-emerald-700/80 font-medium leading-relaxed">{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {patternResults && patternResults.patterns.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                          Security Patterns
                        </Label>
                        <div className="grid gap-2">
                          {patternResults.patterns.map((p, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex gap-3 p-3 rounded-xl items-start",
                                p.includes("No problematic")
                                  ? "bg-primary/5 border border-primary/10"
                                  : "bg-orange-500/5 border border-orange-500/10"
                              )}
                            >
                              {p.includes("No problematic") ? (
                                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                              )}
                              <span
                                className={cn(
                                  "text-xs font-medium leading-relaxed",
                                  p.includes("No problematic") ? "text-primary/80" : "text-orange-700/80"
                                )}
                              >
                                {p}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {type !== "recovery-code" && type !== "analyzer" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1 shrink-0">
                    Configuration
                  </span>
                  <Separator className="flex-1 opacity-20" />
                </div>
                {configSection}
              </div>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </>
  );

  if (isSheet) {
    return <div className="h-full flex flex-col bg-background">{Content}</div>;
  }

  return (
    <div className="h-full flex flex-col bg-background border-l border-border/40 w-[400px] shadow-2xl">{Content}</div>
  );
}
