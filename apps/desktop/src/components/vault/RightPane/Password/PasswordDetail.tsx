import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  XIcon,
  RotateCcw,
  ChevronLeft,
  KeyRoundIcon,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useCallback } from "react";
import { useDialog } from "@/context/DialogContext";
import { RegeneratePasswordWarning } from "@/modals/RegeneratePasswordWarning";
import { cn } from "@/lib/utils";

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
} from "../../../ui/dropdown-menu";

import { PasswordStrengthCard } from "./components/PasswordStrengthCard";
import {
  calculatePasswordScore,
  generateExcellentPasswordWithCharCount,
  getPasswordStrength,
} from "@/utils/Password/pwd.utils";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { usePasswordStore } from "@/store/vault/password.store";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { useUiStore } from "@/store/ui.store";
import { Badge } from "@/components/ui/badge";
import type { IPasswordItem } from "@/utils/types/vault";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

interface Props {
  backButton?: {
    show: boolean;
    origin?: string;
  };
}

export function PasswordDetail({ backButton }: Props) {
  const isPasswordEditing = useUiStore((state) => state.isPasswordEditShown);
  const setIsPasswordEditing = useUiStore((state) => state.setIsPasswordEditShown);
  const setIsPasswordDetailsShown = useUiStore((state) => state.setIsPasswordDetailsShown);

  const [formData, setFormData] = useState<IPasswordItem | null>(null);
  const { openDialog, closeDialog } = useDialog();

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [length, setLength] = useState(16);
  const [isGenerating, setIsGenerating] = useState(false);

  const passwordItems = usePasswordStore((state) => state.passwordItems);
  const selectedPasswordId = usePasswordStore((state) => state.selectedPasswordId);
  const passwordCategories = usePasswordCategoryStore((state) => state.passwordCategories);
  const clearSelectedId = usePasswordStore((state) => state.clearSelectedPasswordId);
  const updatePasswordItem = usePasswordStore((state) => state.updatePasswordItem);
  const selectedPassword = passwordItems.find((p) => p.id === selectedPasswordId) || null;
  const activeTabId = useUiStore((state) => state.activeTabId);

  useEffect(() => {
    setFormData(selectedPassword);
    setIsPasswordEditing(false);
    setShowPassword(false);
  }, [selectedPassword]);

  useEffect(() => {
    setPasswordStrength(Math.floor(calculatePasswordScore(formData?.password || "")));
  }, [formData?.password]);

  // Handle escape key press
  const handleEscapePress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        selectedPassword &&
          (() => {
            clearSelectedId();
            setIsPasswordEditing(false);
            setIsPasswordDetailsShown(false);
          })();
      }
    },
    [selectedPassword, clearSelectedId]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleEscapePress);
    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, [handleEscapePress]);

  const handleCopy = async (text: string, field: string) => {
    await writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = () => {
    if (formData) {
      updatePasswordItem({ ...formData, updatedAt: Date.now() });
      setIsPasswordEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(selectedPassword);
    setIsPasswordEditing(false);
  };

  const handleDelete = () => {
    if (formData) {
      updatePasswordItem({
        ...formData,
        isDeleted: true,
        updatedAt: Date.now(),
      });
      setIsPasswordEditing(false);
      clearSelectedId();
    }
  };

  const handleFavorite = () => {
    if (formData) {
      updatePasswordItem({
        ...formData,
        isFavorite: !formData.isFavorite,
        updatedAt: Date.now(),
      });
      setIsPasswordEditing(false);
    }
  };

  const handleGeneratePassword = () => {
    if (formData) {
      openDialog({
        title: "Regenerate Password?",
        variant: "warning",
        content: <RegeneratePasswordWarning />,
        buttons: [
          {
            label: "Cancel",
            variant: "default",
            onClick: closeDialog,
          },
          {
            label: "Regenerate Anyway",
            variant: "secondary",
            onClick: async () => {
              closeDialog();
              setIsGenerating(true);
              try {
                const password = await generateExcellentPasswordWithCharCount(length);
                setFormData({ ...formData, password });
              } finally {
                setIsGenerating(false);
              }
            },
          },
        ],
      });
    }
  };

  if (!formData) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50">
            <KeyRoundIcon className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Select an item to view details</p>
        </div>
      </div>
    );
  }

  const currentCategory = passwordCategories.find((c) => c.id === formData.categoryId);

  const activeTabName = () => {
    switch (activeTabId) {
      case "all":
        return "All";
      case "favorites":
        return "Favorites";
      case "organize":
        return currentCategory?.name || "Organize";
      default:
        return "Other";
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* --- Breadcrumb with back button --- */}
      <div className="px-6 py-2">
        <div className="flex items-center text-muted-foreground">
          {backButton?.show && (
            <Button
              variant="ghost"
              size="lg"
              className="h-8 px-2 -ml-2 mr-2 gap-1 text-xs"
              onClick={() => {
                clearSelectedId();
                setIsPasswordDetailsShown(false);
              }}
            >
              <ChevronLeft className="w-3 h-3" /> Back
            </Button>
          )}
          <span className="text-xs font-medium uppercase tracking-wider truncate max-w-25" title={activeTabName()}>
            {backButton?.origin || activeTabName()}
          </span>
          <span className="mx-2 opacity-80">/</span>
          <span className="text-xs font-medium uppercase tracking-wider  truncate max-w-50">
            {formData.title || "View Password Details"}
          </span>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className={cn("pb-4 border-b border-border/40", backButton?.show ? "px-6 " : "p-6 ")}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-5 min-w-0 flex-1">
              {/* ICON */}
              <ContextMenu>
                <ContextMenuTrigger disabled={!isPasswordEditing}>
                  <PasswordIconPicker
                    icon={formData.icon}
                    isEditing={isPasswordEditing}
                    onChange={(icon) => setFormData({ ...formData, icon })}
                  />
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => setFormData({ ...formData, icon: "" })}>
                    <RotateCcw />
                    Reset Icon
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              <div className="flex-1 min-w-0 space-y-1 ">
                {/* NAME */}
                {isPasswordEditing ? (
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg font-bold h-9"
                    placeholder="Item Title"
                  />
                ) : (
                  <h2 className="text-2xl font-bold tracking-tight truncate pr-2 max-w-58.75" title={formData.title}>
                    {formData.title}
                  </h2>
                )}

                {/* Category Display / Selector */}
                {isPasswordEditing ? (
                  <Select
                    value={formData.categoryId}
                    onValueChange={(val) => setFormData({ ...formData, categoryId: val === "none" ? undefined : val })}
                  >
                    <SelectTrigger className="h-8 w-50 text-xs">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="none" value="none">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full`} />
                          None
                        </div>
                      </SelectItem>
                      {passwordCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} disabled={cat.isDeleted}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                            {cat.name}
                            {cat.isDeleted && (
                              <Badge className="h-5" variant="destructive">
                                Deleted
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {currentCategory ? (
                      <span className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-muted border border-border/50 text-xs font-medium">
                        <span className={`w-2 h-2 rounded-full ${currentCategory.color || "bg-gray-400"}`} />
                        {currentCategory.name}
                        {currentCategory.isDeleted && (
                          <Badge className="h-5" variant="destructive">
                            Deleted
                          </Badge>
                        )}
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
              {isPasswordEditing ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive  "
                    onClick={handleCancel}
                    title="Cancel"
                  >
                    <XIcon className="w-4 h-4" /> Cancel
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
                    onClick={() => setIsPasswordEditing(true)}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Export </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </div>
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
                    readOnly={!isPasswordEditing}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={cn("font-mono text-sm", !isPasswordEditing && "bg-muted/30 border-transparent")}
                  />
                </div>
                {!isPasswordEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "shrink-0 bg-background/50",
                      copiedField === "user" && "text-emerald-600 border-emerald-500/50 bg-emerald-500/10"
                    )}
                    onClick={() => handleCopy(formData.username || "", "user")}
                  >
                    {copiedField === "user" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Password</Label>
              <div className="flex gap-2 group">
                <div className="relative flex-1">
                  <Input
                    type={isPasswordEditing ? "text" : showPassword ? "text" : "password"}
                    value={formData.password || ""}
                    readOnly={!isPasswordEditing}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={cn("font-mono text-sm pr-10", !isPasswordEditing && "bg-muted/30 border-transparent")}
                    maxLength={100}
                  />
                  {/* Eye Toggle (Only in View Mode) */}
                  {!isPasswordEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                </div>

                {isPasswordEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    title="Generate Password"
                    disabled={isGenerating}
                    onClick={handleGeneratePassword}
                  >
                    <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                  </Button>
                )}

                {!isPasswordEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "shrink-0 bg-background/50",
                      copiedField === "pass" && "text-emerald-600 border-emerald-500/50 bg-emerald-500/10"
                    )}
                    onClick={() => handleCopy(formData.password || "", "pass")}
                  >
                    {copiedField === "pass" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>

              {/* Strength Meter */}
              {
                <div className="pt-2 flex items-center justify-between text-[10px] space-x-2">
                  <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 ease-out",
                        passwordStrength <= 25 && "bg-destructive",
                        passwordStrength > 25 && passwordStrength <= 50 && "bg-orange-500",
                        passwordStrength > 50 && passwordStrength <= 75 && "bg-yellow-500",
                        passwordStrength > 75 && "bg-emerald-500"
                      )}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <span className="font-medium">{passwordStrength}%</span>
                  <span>{getPasswordStrength(formData?.password || "").toUpperCase()}</span>
                </div>
              }

              {/* Password Length Slider */}
              {isPasswordEditing && (
                <div className="pt-4 space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Password Length
                    </Label>
                    <span className="text-sm font-bold text-emerald-600">{length}</span>
                  </div>
                  <Slider
                    value={[length]}
                    onValueChange={(v) => setLength(v[0])}
                    min={8}
                    max={32}
                    step={1}
                    className="py-2"
                  />
                </div>
              )}
            </div>
          </div>

          {passwordStrength < 75 && !isPasswordEditing && formData.password && (
            <PasswordStrengthCard passwordStrength={passwordStrength} />
          )}

          <Separator className="bg-border/60" />

          {/* Custom Fields */}
          <CustomFieldManager
            fields={formData.fields || []}
            isEditing={isPasswordEditing}
            onChange={(fields) => setFormData({ ...formData, fields })}
          />

          <Separator className="bg-border/60" />

          {/* URLs */}
          <UrlManager
            urls={formData.urls || []}
            isEditing={isPasswordEditing}
            onChange={(urls) => setFormData({ ...formData, urls })}
          />

          <Separator className="bg-border/60" />

          {/* Notes & Tags */}
          <div className="grid gap-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Notes</Label>
              {isPasswordEditing ? (
                <Textarea
                  placeholder="Add secure notes here..."
                  className="min-h-30 resize-none text-sm bg-background"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              ) : (
                <div className="text-sm text-foreground/80 py-3 px-4 rounded-md bg-muted/20 border border-border/30 min-h-25 whitespace-pre-wrap leading-relaxed">
                  {formData.notes || <span className="text-muted-foreground italic">No notes added</span>}
                </div>
              )}
            </div>

            <TagManager
              tags={formData.tags || []}
              isEditing={isPasswordEditing}
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
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
