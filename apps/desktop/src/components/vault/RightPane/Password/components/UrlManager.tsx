import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Copy, ExternalLink, Plus, Trash2, Globe } from "lucide-react";
import { useState } from "react";

interface UrlManagerProps {
  urls: string[];
  isEditing: boolean;
  onChange: (urls: string[]) => void;
}

export function UrlManager({ urls = [], isEditing, onChange }: UrlManagerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const addUrl = () => onChange([...urls, ""]);
  const updateUrl = (index: number, val: string) => {
    const newUrls = [...urls];
    newUrls[index] = val;
    onChange(newUrls);
  };
  const removeUrl = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  // If viewing and no URLs, show fallback
  if (!isEditing && urls.length === 0) {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Website URL</Label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
          <Globe className="w-4 h-4 opacity-50" /> No website linked
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Website URLs</Label>
        {isEditing && (
          <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={addUrl}>
            <Plus className="w-3 h-3 mr-1" /> Add URL
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {urls.map((url, index) => (
          <div key={index} className="flex items-center gap-2 group">
            {isEditing ? (
              <>
                <Input
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  placeholder="https://example.com"
                  className="font-mono text-sm h-9"
                />
                <Button
                  tabIndex={-1}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeUrl(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1 flex items-center gap-2 overflow-hidden">
                  <div className="p-2 bg-blue-500/10 rounded-md text-blue-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={url}
                    className="text-sm text-blue-500 hover:underline truncate flex items-center gap-1 max-w-sm"
                  >
                    {url}
                    <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    copiedIndex === index && "opacity-100 text-emerald-600"
                  )}
                  onClick={() => handleCopy(url, index)}
                >
                  {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
