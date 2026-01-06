import { useState } from "react";
import type { Shortcut, ModifierKey } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShortcutItemProps {
  shortcut: Shortcut;
  onUpdate: (updatedShortcut: Shortcut) => void;
}

export function ShortcutItem({ shortcut, onUpdate }: ShortcutItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedShortcut, setEditedShortcut] = useState(shortcut);

  const handleSave = () => {
    onUpdate(editedShortcut);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedShortcut(shortcut);
    setIsEditing(false);
  };

  // const handleToggleDisable = (checked: boolean) => {
  //   onUpdate({ ...shortcut, disabled: !checked });
  // };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 transition-colors">
      <div className="flex items-center gap-3">
        {!isEditing && (
          <Switch
            disabled
            title={shortcut.disabled ? "Enable" : "Disable"}
            className="cursor-pointer"
            checked={!shortcut.disabled}
            // onCheckedChange={handleToggleDisable}
          />
        )}
        <div className={cn("space-y-0.5", shortcut.disabled && "opacity-40")} title={shortcut.label}>
          <p className="text-sm font-medium pointer-events-none select-none leading-none">{shortcut.label}</p>
        </div>
      </div>

      <div className={cn("flex items-center gap-4", shortcut.disabled && "opacity-40")}>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Select
              value={editedShortcut.modifier}
              onValueChange={(val) => setEditedShortcut({ ...editedShortcut, modifier: val as ModifierKey })}
            >
              <SelectTrigger className="w-[110px] h-8 text-xs">
                <SelectValue placeholder="Modifier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ctrl">Ctrl</SelectItem>
                <SelectItem value="shift">Shift</SelectItem>
                <SelectItem value="ctrl+shift">Ctrl + Shift</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-muted-foreground">+</span>

            <Input
              value={editedShortcut.key}
              onChange={(e) => {
                const val = e.target.value.slice(-1).toUpperCase(); // Take last char and uppercase
                setEditedShortcut({ ...editedShortcut, key: val });
              }}
              className="w-10 h-8 text-center text-xs uppercase p-0"
              maxLength={1}
            />

            <div className="flex items-center gap-1 ml-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                onClick={handleSave}
              >
                <Check size={14} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleCancel}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded border border-border text-xs font-mono font-medium text-foreground">
              <span>
                {shortcut.modifier === "ctrl" ? "Ctrl" : shortcut.modifier === "shift" ? "Shift" : "Ctrl + Shift"}
              </span>
              <span>+</span>
              <span>{shortcut.key}</span>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              // onClick={() => setIsEditing(true)}
              // disabled={shortcut.disabled}
              disabled
            >
              <Pencil size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
