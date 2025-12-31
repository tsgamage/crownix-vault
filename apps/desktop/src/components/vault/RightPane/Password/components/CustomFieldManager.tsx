import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Plus,
  Type,
  EyeOff as HiddenIcon,
  Link as LinkIcon,
  Mail,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { IPasswordCustomField } from "@/utils/types/vault";

interface CustomFieldManagerProps {
  fields: IPasswordCustomField[];
  isEditing: boolean;
  onChange: (fields: IPasswordCustomField[]) => void;
}

export function CustomFieldManager({ fields = [], isEditing, onChange }: CustomFieldManagerProps) {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addField = (type: IPasswordCustomField["type"]) => {
    const newField: IPasswordCustomField = {
      id: crypto.randomUUID(),
      label: type.charAt(0).toUpperCase() + type.slice(1), // Default Label
      type: type as any,
      value: "",
    };
    onChange([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<IPasswordCustomField>) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "hidden":
        return <HiddenIcon className="w-3 h-3" />;
      case "url":
        return <LinkIcon className="w-3 h-3" />;
      case "email":
        return <Mail className="w-3 h-3" />;
      case "phone":
        return <Phone className="w-3 h-3" />;
      default:
        return <Type className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {isEditing && (
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Custom Fields</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <Plus className="w-3 h-3" /> Add Field
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => addField("text")}>
                <Type className="w-4 h-4 mr-2" /> Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addField("hidden")}>
                <HiddenIcon className="w-4 h-4 mr-2" /> Hidden
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addField("email")}>
                <Mail className="w-4 h-4 mr-2" /> Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addField("phone")}>
                <Phone className="w-4 h-4 mr-2" /> Phone
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="grid gap-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <Input
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  className="h-6 text-xs w-32 px-1 hover:border-input focus:border-ring transition-colors"
                />
              ) : (
                <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
                  {getIconForType(field.type)} {field.label}
                </Label>
              )}

              {isEditing && (
                <Button
                  tabIndex={-1}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => removeField(field.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="flex gap-2 group relative">
              <div className="relative flex-1">
                <Input
                  type={field.type === "hidden" && !revealedIds[field.id] ? "password" : "text"}
                  value={field.value}
                  readOnly={!isEditing}
                  onChange={(e) => updateField(field.id, { value: e.target.value })}
                  className={cn("font-mono text-sm pr-10", !isEditing && "bg-muted/30 border-transparent pl-3")}
                />
              </div>

              {/* Actions */}
              {field.type === "hidden" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-0 top-0 h-full w-8 text-muted-foreground hover:text-foreground",
                    revealedIds[field.id] && "text-destructive",
                    !isEditing && "right-11"
                  )}
                  onClick={() => toggleReveal(field.id)}
                >
                  {revealedIds[field.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              )}
              {!isEditing && (
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "shrink-0 bg-background/50",
                    copiedId === field.id && "text-emerald-600 border-emerald-500/50 bg-emerald-500/10"
                  )}
                  onClick={() => copyToClipboard(field.value, field.id)}
                >
                  {copiedId === field.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
