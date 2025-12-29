import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, formatDistance } from "date-fns";
import {
  Copy,
  MoreHorizontal,
  Eye,
  EyeOff,
  Check,
  Star,
  Pencil,
  Save,
  RefreshCw,
  Folder,
  Trash2,
  X,
  RotateCcw,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  type IPasswordItem,
  type IPasswordCategory,
} from "@/utils/types/global.types";

import { PasswordIconPicker } from "./components/PasswordIconPicker";
import { UrlManager } from "./components/UrlManager";
import { TagManager } from "./components/TagManager";
import { CustomFieldManager } from "./components/CustomFieldManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import { PasswordStrengthCard } from "./components/PasswordStrengthCard";
import {
  calculatePasswordEntropy,
  generateVeryStrongPassword,
  getPasswordStrength,
} from "@/utils/pwd.utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const CATEGORIES: IPasswordCategory[] = [
  { id: "1", name: "Social", color: "bg-blue-500" },
  { id: "2", name: "Work", color: "bg-orange-500" },
  { id: "3", name: "Finance", color: "bg-green-500" },
  { id: "4", name: "Entertainment", color: "bg-purple-500" },
];

interface PasswordDetailProps {
  item: IPasswordItem | null;
  onSave: (item: IPasswordItem) => void;
  clearSelectedId: () => void;
  onPermanentlyDelete: (id: string) => void;
}

export function PasswordDetail({
  item,
  onSave,
  clearSelectedId,
  onPermanentlyDelete,
}: PasswordDetailProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<IPasswordItem | null>(null);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Sync local state when item changes
  useEffect(() => {
    setFormData(item);
    setIsEditMode(false);
    setShowPassword(false);
  }, [item]);

  useEffect(() => {
    setPasswordStrength(
      Math.floor(calculatePasswordEntropy(formData?.password || ""))
    );
  }, [formData?.password]);

  // Handle escape key press
  const handleEscapePress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        item && clearSelectedId();
      }
    },
    [item, clearSelectedId]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleEscapePress);
    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, [handleEscapePress]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = () => {
    if (formData) {
      onSave({ ...formData, updatedAt: Date.now() });
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    setFormData(item);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    if (formData) {
      onSave({ ...formData, isDeleted: true, updatedAt: Date.now() });
      setIsEditMode(false);
      clearSelectedId();
    }
  };

  const handleFavorite = () => {
    if (formData) {
      onSave({
        ...formData,
        isFavorite: !formData.isFavorite,
        updatedAt: Date.now(),
      });
      setIsEditMode(false);
    }
  };

  const handleRestore = () => {
    if (formData) {
      onSave({ ...formData, isDeleted: false, updatedAt: Date.now() });
      setIsEditMode(false);
      clearSelectedId();
    }
  };

  if (!formData) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50">
            <MoreHorizontal className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Select an item to view details
          </p>
        </div>
      </div>
    );
  }

  if (formData.isDeleted) {
    return (
      <>
        <div className="h-full flex items-center justify-center bg-background text-muted-foreground animate-in fade-in duration-500">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50">
              <Trash2 className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              This item has been deleted
            </p>
            {formData.notes && (
              <div className="text-sm text-muted-foreground/80 py-3 px-4 rounded-md bg-muted/30 border border-border/30 max-w-sm mx-auto whitespace-pre-wrap leading-relaxed text-left">
                <span className="text-xs font-semibold uppercase tracking-wider block mb-1 opacity-70">
                  Note:
                </span>
                {formData.notes}
              </div>
            )}
            <div className="flex flex-col items-center gap-2">
              <Button variant="outline" onClick={handleRestore}>
                Restore
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                onClick={() =>
                  confirm(
                    "Are you sure you want to delete this item permanently?"
                  ) && onPermanentlyDelete(formData.id)
                }
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentCategory = CATEGORIES.find((c) => c.id === formData.categoryId);

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm">
      {/* --- HEADER --- */}
      <div className="p-6 pb-4 border-b border-border/40">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5 min-w-0 flex-1">
            <ContextMenu>
              <ContextMenuTrigger>
                <PasswordIconPicker
                  icon={formData.icon}
                  isEditing={isEditMode}
                  onChange={(icon) => setFormData({ ...formData, icon })}
                />
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => setFormData({ ...formData, icon: "" })}
                >
                  <RotateCcw />
                  Reset Icon
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            <div className="flex-1 min-w-0 space-y-1 ">
              {isEditMode ? (
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="text-lg font-bold h-9"
                  placeholder="Item Title"
                />
              ) : (
                <h2
                  className="text-2xl font-bold tracking-tight truncate pr-2 max-w-[235px]"
                  title={formData.title}
                >
                  {formData.title}
                </h2>
              )}

              {/* Category Display / Selector */}
              {isEditMode ? (
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, categoryId: val })
                  }
                >
                  <SelectTrigger className="h-8 w-[200px] text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${cat.color}`}
                          />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {currentCategory ? (
                    <span className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-muted border border-border/50 text-xs font-medium">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          currentCategory.color || "bg-gray-400"
                        }`}
                      />
                      {currentCategory.name}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs opacity-60">
                      <Folder className="w-3 h-3" /> Uncategorized
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex gap-1">
            {isEditMode ? (
              <>
                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive  "
                  onClick={handleCancel}
                  title="Cancel"
                >
                  <X className="w-4 h-4" /> Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSave}
                  title="Save"
                >
                  <Save className="w-4 h-4" /> Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavorite}
                  className={cn(
                    "h-9 w-9",
                    formData.isFavorite &&
                      "text-yellow-500 fill-yellow-500/20 hover:bg-yellow-500/10 hover:text-yellow-500"
                  )}
                >
                  <Star className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsEditMode(true)}
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Export </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-8 max-w-3xl mx-auto">
          {/* Main Credentials */}
          <div className="space-y-5 p-5 rounded-xl border border-border/40 bg-card/50 shadow-xs">
            {/* Username */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Username / Email
              </Label>
              <div className="flex gap-2 group">
                <div className="relative flex-1">
                  <Input
                    value={formData.username || ""}
                    readOnly={!isEditMode}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className={cn(
                      "font-mono text-sm",
                      !isEditMode && "bg-muted/30 border-transparent"
                    )}
                  />
                </div>
                {!isEditMode && (
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "shrink-0 bg-background/50",
                      copiedField === "user" &&
                        "text-emerald-600 border-emerald-500/50 bg-emerald-500/10"
                    )}
                    onClick={() => handleCopy(formData.username || "", "user")}
                  >
                    {copiedField === "user" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Password
              </Label>
              <div className="flex gap-2 group">
                <div className="relative flex-1">
                  <Input
                    type={
                      isEditMode ? "text" : showPassword ? "text" : "password"
                    }
                    value={formData.password || ""}
                    readOnly={!isEditMode}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={cn(
                      "font-mono text-sm pr-10",
                      !isEditMode && "bg-muted/30 border-transparent"
                    )}
                    maxLength={100}
                  />
                  {/* Eye Toggle (Only in View Mode) */}
                  {!isEditMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>

                {isEditMode && (
                  <Button
                    variant="outline"
                    size="icon"
                    title="Generate Password"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        password: generateVeryStrongPassword(),
                      })
                    }
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}

                {!isEditMode && (
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "shrink-0 bg-background/50",
                      copiedField === "pass" &&
                        "text-emerald-600 border-emerald-500/50 bg-emerald-500/10"
                    )}
                    onClick={() => handleCopy(formData.password || "", "pass")}
                  >
                    {copiedField === "pass" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              {/* Strength Meter (Visual only) */}
              {isEditMode && (
                <div className="pt-2 flex items-center justify-between text-[10px] space-x-2">
                  <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 ease-out",
                        passwordStrength <= 25 && "bg-destructive",
                        passwordStrength > 25 &&
                          passwordStrength <= 50 &&
                          "bg-orange-500",
                        passwordStrength > 50 &&
                          passwordStrength <= 75 &&
                          "bg-yellow-500",
                        passwordStrength > 75 && "bg-emerald-500"
                      )}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <span className="font-medium">{passwordStrength}%</span>
                  <span>
                    {getPasswordStrength(
                      formData?.password || ""
                    ).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {passwordStrength < 75 && !isEditMode && formData.password && (
            <PasswordStrengthCard passwordStrength={passwordStrength} />
          )}

          <Separator className="bg-border/60" />

          {/* Custom Fields */}
          <CustomFieldManager
            fields={formData.fields || []}
            isEditing={isEditMode}
            onChange={(fields) => setFormData({ ...formData, fields })}
          />

          <Separator className="bg-border/60" />

          {/* URLs */}
          <UrlManager
            urls={formData.urls || []}
            isEditing={isEditMode}
            onChange={(urls) => setFormData({ ...formData, urls })}
          />

          <Separator className="bg-border/60" />

          {/* Notes & Tags */}
          <div className="grid gap-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Notes
              </Label>
              {isEditMode ? (
                <Textarea
                  placeholder="Add secure notes here..."
                  className="min-h-[120px] resize-none text-sm bg-background"
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              ) : (
                <div className="text-sm text-foreground/80 py-3 px-4 rounded-md bg-muted/20 border border-border/30 min-h-[100px] whitespace-pre-wrap leading-relaxed">
                  {formData.notes || (
                    <span className="text-muted-foreground italic">
                      No notes added
                    </span>
                  )}
                </div>
              )}
            </div>

            <TagManager
              tags={formData.tags || []}
              isEditing={isEditMode}
              onSave={(tags) => setFormData({ ...formData, tags })}
            />
          </div>

          {/* Footer Metadata */}
          <div className="pt-8 pb-4 text-xs text-muted-foreground/50 flex flex-col items-center gap-1">
            <p>Created on {format(formData.createdAt, "PPP")}</p>
            <p>
              Last updated{" "}
              {formatDistance(new Date(formData.updatedAt), new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
