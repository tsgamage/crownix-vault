import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { type PasswordItem } from "./PasswordList";
import {
  Copy,
  RefreshCw,
  ExternalLink,
  MoreHorizontal,
  Eye,
  EyeOff,
  Check,
  Star,
  Pencil,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PasswordDetailProps {
  item: PasswordItem | null;
}

export function PasswordDetail({ item }: PasswordDetailProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!item) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <MoreHorizontal className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm font-medium">Select an item to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <span className="text-2xl font-bold">{item.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{item.name}</h2>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-emerald-500 flex items-center gap-1 transition-colors"
              >
                crownix.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Star className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsEditMode(!isEditMode)}
              title={isEditMode ? "Cancel Edit" : "Edit"}
            >
              {isEditMode ? (
                <X className="w-4 h-4" />
              ) : (
                <Pencil className="w-4 h-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-2">
        <div className="space-y-6 max-w-2xl">
          {/* Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Username
              </Label>
              {isEditMode ? (
                <div className="flex gap-2">
                  <Input value={item.username} className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "shrink-0",
                      copiedField === "username" &&
                        "text-emerald-600 border-emerald-500/50 bg-emerald-500/10"
                    )}
                    onClick={() => handleCopy(item.username, "username")}
                  >
                    {copiedField === "username" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <p className="font-mono text-sm py-2">{item.username}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      copiedField === "username" &&
                        "opacity-100 text-emerald-600"
                    )}
                    onClick={() => handleCopy(item.username, "username")}
                  >
                    {copiedField === "username" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Password
              </Label>
              {isEditMode ? (
                <div className="flex gap-2 group">
                  <div className="relative flex-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={item.password || ""}
                      className="font-mono text-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 hover:bg-transparent text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => console.log("Regenerate")}
                    title="Regenerate Password"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "shrink-0",
                      copiedField === "password" &&
                        "text-emerald-600 border-emerald-500/50 bg-emerald-500/10"
                    )}
                    onClick={() => handleCopy(item.password || "", "password")}
                  >
                    {copiedField === "password" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <p className="font-mono text-sm py-2">
                    {showPassword
                      ? item.password || ""
                      : "••••••••••••••••••••"}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      copiedField === "password" &&
                        "opacity-100 text-emerald-600"
                    )}
                    onClick={() => handleCopy(item.password || "", "password")}
                  >
                    {copiedField === "password" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
              {/* Password Strength Mock */}
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600 font-medium">
                    Strong Password
                  </span>
                  <span className="text-muted-foreground">42 bits</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Website URL
              </Label>
              {isEditMode ? (
                <div className="flex gap-2">
                  <Input value={item.url || ""} className="text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "shrink-0",
                      copiedField === "url" &&
                        "text-emerald-600 border-emerald-500/50 bg-emerald-500/10"
                    )}
                    onClick={() => handleCopy(item.url || "", "url")}
                  >
                    {copiedField === "url" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <a
                    href={item.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline py-2 flex items-center gap-1"
                  >
                    {item.url || "No website link"}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      copiedField === "url" && "opacity-100 text-emerald-600"
                    )}
                    onClick={() => handleCopy(item.url || "", "url")}
                  >
                    {copiedField === "url" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Notes
              </Label>
              {isEditMode ? (
                <Textarea
                  placeholder="Add secure notes here..."
                  className="min-h-[120px] resize-none text-sm"
                  defaultValue={item.notes || ""}
                />
              ) : (
                <p className="text-sm text-muted-foreground py-2 min-h-[120px] whitespace-pre-wrap">
                  {item.notes || "No notes added"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
