import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { generatePassword, generatePassphrase } from "@/utils/pwd.utils";
import type { GeneratorType } from "../security.config";
import { toast } from "sonner";

interface GeneratorPaneProps {
  type: GeneratorType;
  onClose: () => void;
  isSheet?: boolean;
}

export function GeneratorPane({
  type,
  onClose,
  isSheet = false,
}: GeneratorPaneProps) {
  const [password, setPassword] = useState("");
  // Simple password options state
  const [length, setLength] = useState(16);
  const [passphraseWords, setPassphraseWords] = useState(4);

  // Handlers
  const handleGenerate = () => {
    if (type === "password") {
      setPassword(generatePassword({ length, strength: "strong" }));
    } else if (type === "passphrase") {
      setPassword(generatePassphrase(passphraseWords));
    } else {
      // OTP mock
      setPassword("123 456");
    }
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success("Copied to clipboard");
  };

  // Generate on mount or type change (optional, maybe better on manual click)
  // useEffect(() => handleGenerate(), [type]);

  const Content = (
    <>
      <div className="p-6 border-b border-border/40 flex items-center justify-between bg-background shrink-0">
        <div>
          <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
            {type === "password" && "Password Generator"}
            {type === "passphrase" && "Passphrase Generator"}
            {type === "otp" && "OTP Tools"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Generate secure secrets
          </p>
        </div>
        {!isSheet && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        {/* Output Area */}
        <div className="space-y-2">
          <div className="relative group">
            <Input
              value={password}
              readOnly
              placeholder="Click generate..."
              className="h-14 text-xl font-mono pr-20 bg-background border-primary/20 focus-visible:ring-primary/30"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9"
                onClick={handleGenerate}
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 bg-primary/10 text-primary hover:bg-primary/20"
                onClick={handleCopy}
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Options */}
        {type === "password" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Length</Label>
                <span className="text-sm font-medium">{length}</span>
              </div>
              <Slider
                value={[length]}
                onValueChange={(v) => setLength(v[0])}
                min={8}
                max={64}
                step={1}
              />
            </div>
            {/* Add more checkboxes for uppercase, numbers, etc later */}
          </div>
        )}

        {type === "passphrase" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Word Count</Label>
                <span className="text-sm font-medium">{passphraseWords}</span>
              </div>
              <Slider
                value={[passphraseWords]}
                onValueChange={(v) => setPassphraseWords(v[0])}
                min={3}
                max={10}
                step={1}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/40 bg-background/50 mt-auto">
        <Button className="w-full gap-2" size="lg" onClick={handleGenerate}>
          <RefreshCw className="w-4 h-4" /> Generate New
        </Button>
      </div>
    </>
  );

  if (isSheet) {
    return <div className="h-full flex flex-col">{Content}</div>;
  }

  return (
    <div className="h-full flex flex-col bg-muted/5 animate-in slide-in-from-right-10 duration-300 border-l border-border/40 w-[400px]">
      {Content}
    </div>
  );
}
