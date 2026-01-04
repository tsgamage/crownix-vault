import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Hash } from "lucide-react";
import { useEffect, useState } from "react";

interface TagManagerProps {
  tags: string[];
  isEditing: boolean;
  onSave: (tags: string[]) => void;
}

export function TagManager({ tags = [], isEditing, onSave }: TagManagerProps) {
  const [tagText, setTagText] = useState("");

  useEffect(() => {
    setTagText(tags.join(", "));
  }, [tags]);

  const handleTextChange = (text: string) => {
    setTagText(text);
  };

  const handleOnBlur = () => {
    const newTags = tagText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave(newTags);
    setTagText("");
  };

  if (!isEditing && tags.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
        <Hash className="w-3 h-3" /> Tags
      </Label>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={tagText}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={handleOnBlur}
            placeholder="work, social, finance (comma separated)"
            className="min-h-[60px] max-w-md resize-none text-sm"
          />
          <p className="text-[10px] text-muted-foreground">
            Separate tags with commas
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 py-1">
          {tags.map((tag, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="px-2 py-0.5 text-xs font-normal bg-muted hover:bg-muted-foreground/20 text-muted-foreground"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
