import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Eye, EyeOff, Save, ChevronLeft, RotateCcw, CheckIcon, CopyIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDialog } from "@/context/DialogContext";
import { PasswordIconPicker } from "./components/PasswordIconPicker";
import { UrlManager } from "./components/UrlManager";
import { TagManager } from "./components/TagManager";
import { CustomFieldManager } from "./components/CustomFieldManager";
import {
  calculatePasswordScore,
  generateExcellentPasswordWithCharCount,
  getPasswordStrength,
} from "@/utils/Password/pwd.utils";
import { usePasswordStore } from "@/store/vault/password.store";
import { useUiStore } from "@/store/ui.store";
import type { IPasswordItem } from "@/utils/types/vault";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { passwordSchema } from "@/zod/password-schema";
import { toast } from "sonner";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

export function CreatePassword() {
  const createPassword = usePasswordStore((state) => state.createPasswordItem);
  const setSelectedPasswordId = usePasswordStore((state) => state.setSelectedPasswordId);
  const setIsPasswordCreateShown = useUiStore((state) => state.setIsPasswordCreateShown);

  const passwordCategories = usePasswordCategoryStore((state) => state.passwordCategories);

  const handleCancelClick = () => {
    setIsPasswordCreateShown(false);
  };

  const { openDialog, closeDialog } = useDialog();
  const [formData, setFormData] = useState<Partial<IPasswordItem>>({
    title: "",
    username: "",
    password: "",
    urls: [],
    fields: [],
    tags: [],
    notes: "",
    icon: "",
    isFavorite: false,
    categoryId: "",
  });
  const [length, setLength] = useState(16);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPasswordCopied, setIsPasswordCopied] = useState(false);

  const isFormEmpty = (formData: Partial<IPasswordItem>) => {
    if (formData.title || formData.username || formData.password || formData.notes) {
      return false;
    }

    if (formData.urls?.length !== 0 || formData.fields?.length !== 0) {
      return false;
    }

    return true;
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    if (!formData.title) return;

    const newItemId = crypto.randomUUID();

    const newItem: IPasswordItem = {
      id: newItemId,
      title: formData.title || "Untitled",
      username: formData.username || "",
      password: formData.password || "",
      urls: formData.urls || [],
      icon: formData.icon || "",
      notes: formData.notes || "",
      fields: formData.fields || [],
      categoryId: formData.categoryId,
      tags: formData.tags || [],
      isFavorite: formData.isFavorite || false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    };

    const result = passwordSchema.safeParse(newItem);

    if (!result.success) {
      result.error.issues.forEach((error) => toast.error(error.message));
      return;
    }

    createPassword(newItem);
    setSelectedPasswordId(newItemId);
    handleCancelClick();
  };

  const handleGeneratePassword = async () => {
    setIsGenerating(true);
    setIsPasswordCopied(false);
    try {
      const password = await generateExcellentPasswordWithCharCount(length);
      setFormData((prev) => ({ ...prev, password }));
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    setPasswordStrength(Math.floor(calculatePasswordScore(formData?.password || "")));
  }, [formData?.password]);

  const handleEscapePress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFormEmpty(formData)) {
          handleCancelClick();
        } else {
          openDialog({
            title: "Discard Changes?",
            description: "Are you sure you want to cancel? Unsaved changes will be lost.",
            variant: "warning",
            buttons: [
              { label: "Keep Editing", variant: "ghost", onClick: closeDialog },
              {
                label: "Discard",
                variant: "destructive",
                onClick: () => {
                  closeDialog();
                  handleCancelClick();
                },
              },
            ],
          });
        }
      }
    },
    [handleCancelClick, formData, openDialog, closeDialog]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEscapePress);
    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, [handleEscapePress]);

  const handleCopy = async (text: string) => {
    await writeText(text);
    setIsPasswordCopied(true);
    setTimeout(() => setIsPasswordCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm animate-in">
      {/* --- Breadcrumb with back button (match PasswordDetail style) --- */}
      <div className="px-6 py-2">
        <div className="flex items-center text-muted-foreground">
          <Button
            variant="ghost"
            size="lg"
            className="h-8 px-2 -ml-2 mr-2 gap-1 text-xs"
            onClick={() => {
              if (isFormEmpty(formData)) {
                handleCancelClick();
              } else {
                openDialog({
                  title: "Discard Changes?",
                  description: "Are you sure you want to cancel? Unsaved changes will be lost.",
                  variant: "warning",
                  buttons: [
                    {
                      label: "Keep Editing",
                      variant: "ghost",
                      onClick: closeDialog,
                    },
                    {
                      label: "Discard",
                      variant: "destructive",
                      onClick: () => {
                        closeDialog();
                        handleCancelClick();
                      },
                    },
                  ],
                });
              }
            }}
          >
            <ChevronLeft className="w-3 h-3" /> Back
          </Button>
          <span className="text-xs font-medium uppercase tracking-wider truncate max-w-50">Create</span>
          <span className="mx-2 opacity-80">/</span>
          <span className="text-xs font-medium uppercase tracking-wider truncate max-w-50">Create New Item</span>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT using ScrollArea (shadcn) --- */}
      <ScrollArea className="flex-1 overflow-y-auto">
        {/* Header area inside scrollable (icon, title, category, actions) */}
        <div className="pb-4 border-b border-border/40 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-5 min-w-0 flex-1">
              {/* ICON - with context menu to reset like in PasswordDetail */}
              <ContextMenu>
                <ContextMenuTrigger>
                  <PasswordIconPicker
                    icon={formData.icon}
                    isEditing={true}
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

              <div className="flex-1 min-w-0 space-y-2">
                <Input
                  autoFocus
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-lg font-bold h-9 border-transparent hover:border-input focus:border-emerald-500/50 transition-all px-0 pl-2 -ml-2 bg-transparent"
                  placeholder="Item Name (e.g. Facebook)"
                />

                <Select
                  value={formData.categoryId}
                  onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                >
                  <SelectTrigger tabIndex={-1} className="h-8 w-50 text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {passwordCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex gap-2">
              <Button
                tabIndex={-1}
                variant="default"
                size="sm"
                className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 gap-2"
                onClick={handleSave}
                disabled={!formData.title}
              >
                <Save className="w-4 h-4" /> Save Item
              </Button>
            </div>
          </div>
        </div>

        {/* Main scrollable body */}
        <div className="p-6 space-y-8 max-w-3xl mx-auto">
          {/* Main Credentials */}
          <div className="space-y-5 p-5 rounded-xl border border-border/40 bg-card/50 shadow-xs">
            {/* Username */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Username / Email / Phone
              </Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="user@example.com"
                className="font-mono text-sm"
                autoComplete="one-time-code"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Password</Label>
                <Button
                  tabIndex={-1}
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs text-emerald-600 disabled:opacity-50"
                  onClick={handleGeneratePassword}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Strong Password"}
                </Button>
              </div>
              <div className="flex gap-2 group relative">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Required"
                    className="font-mono text-sm pr-10"
                  />
                  <Button
                    tabIndex={-1}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={handleGeneratePassword}
                  disabled={isGenerating}
                  title="Regenerate"
                >
                  <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "shrink-0 bg-background/50",
                    isPasswordCopied && "text-emerald-600 border-emerald-500/50 bg-emerald-500/10"
                  )}
                  onClick={() => handleCopy(formData.password || "")}
                >
                  {isPasswordCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </Button>
              </div>

              {/* Strength Meter (Visual only) */}
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

              {/* Password Length Slider */}
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
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Custom Fields */}
          <CustomFieldManager
            fields={formData.fields || []}
            isEditing={true}
            onChange={(fields) => setFormData({ ...formData, fields })}
          />

          {/* URLs */}
          <UrlManager
            urls={formData.urls || []}
            isEditing={true} // Always editing in create mode
            onChange={(urls) => setFormData({ ...formData, urls })}
          />

          <Separator className="bg-border/60" />

          {/* Notes & Tags */}
          <div className="grid gap-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Notes</Label>
              <Textarea
                placeholder="Add secure notes, security questions, or PINs here..."
                className="min-h-30 resize-none text-sm bg-background"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <TagManager
              tags={formData.tags || []}
              isEditing={true}
              onSave={(tags) => setFormData({ ...formData, tags })}
            />
          </div>
        </div>

        {/* scrollbar */}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
