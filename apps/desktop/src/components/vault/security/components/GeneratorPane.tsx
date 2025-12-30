import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, X, KeyRound, Type, Hash } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { generatePassword, generatePassphrase, generateOTP } from "@/utils/pwd.utils";
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

  // Handlers
  const handleGenerate = () => {
    if (type === "password") {
      setValue(generatePassword({ length, strength: "strong" }));
    } else if (type === "passphrase") {
      setValue(generatePassphrase(passphraseWords));
    } else if (type === "otp") {
      setValue(generateOTP(otpLength));
    }
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    handleGenerate();
  }, [type, length, passphraseWords, otpLength]);

  const configSection = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {type === "password" && (
        <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex justify-between items-center px-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password Length
            </Label>
            <span className="text-lg font-bold text-primary">{length}</span>
          </div>
          <Slider value={[length]} onValueChange={(v) => setLength(v[0])} min={8} max={64} step={1} className="py-2" />
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
            min={3}
            max={20}
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
      <div className="p-6 border-b border-border/40 flex items-center justify-between bg-background/95 backdrop-blur-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {type === "password" && <KeyRound className="w-5 h-5" />}
            {type === "passphrase" && <Type className="w-5 h-5" />}
            {type === "otp" && <Hash className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none">
              {type === "password" && "Password Generator"}
              {type === "passphrase" && "Passphrase Generator"}
              {type === "otp" && "OTP Generator"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Create cryptographically secure secrets</p>
          </div>
        </div>
        {!isSheet && (
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" onClick={onClose}>
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Output Display Area */}
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
              title="Regenerate"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 px-1">
            <span>Configuration</span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          {configSection}
        </div>
      </div>

      <div className="p-6 border-t border-border/40 bg-muted/10">
        <div className="flex gap-3 items-center text-xs text-muted-foreground/60 leading-normal">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p>Generated locally using cryptographically secure random numbers.</p>
        </div>
      </div>
    </>
  );

  if (isSheet) {
    return <div className="h-full flex flex-col bg-background">{Content}</div>;
  }

  return (
    <div className="h-full flex flex-col bg-background border-l border-border/40 w-[400px] animate-in slide-in-from-right-10 duration-500 shadow-2xl">
      {Content}
    </div>
  );
}
