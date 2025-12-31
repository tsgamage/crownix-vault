import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Eye, EyeOff, Save, ChevronLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDialog } from "@/context/DialogContext";
import { type IPasswordItem } from "@/utils/types/global.types";

import { PasswordIconPicker } from "./components/PasswordIconPicker";
import { UrlManager } from "./components/UrlManager";
import { TagManager } from "./components/TagManager";
import { CustomFieldManager } from "./components/CustomFieldManager";
import {
  calculatePasswordScore,
  generateExcellentPasswordWithCharCount,
  getPasswordStrength,
} from "@/utils/Password/pwd.utils";
import { MOCK_PASSWORD_CATEGORIES } from "@/data/initial-vault";
import { usePasswordStore } from "@/store/vault/password.store";
import { useUiStore } from "@/store/ui.store";

export function CreatePassword() {
  const createPassword = usePasswordStore((state) => state.createPasswordItem);
  const setSelectedPasswordId = usePasswordStore((state) => state.setSelectedPasswordId);
  const setIsPasswordCreateShown = useUiStore((state) => state.setIsPasswordCreateShown);

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

    createPassword(newItem);
    setSelectedPasswordId(newItemId);
    handleCancelClick();
  };

  const handleGeneratePassword = async () => {
    setIsGenerating(true);
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

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm animate-in">
      {/* --- HEADER --- */}
      <div className="p-6 pb-4 border-b border-border/40">
        <div className="flex items-center mb-4 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 -ml-2 gap-1 text-xs"
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
          <span className="mx-2 opacity-20">/</span>
          <span className="text-xs font-medium uppercase tracking-wider">Create New Item</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5 min-w-0 flex-1">
            {/* Icon Picker (Always in Edit Mode here) */}
            <PasswordIconPicker
              icon={formData.icon}
              isEditing={true}
              onChange={(icon) => setFormData({ ...formData, icon })}
            />

            <div className="flex-1 min-w-0 space-y-2">
              <Input
                autoFocus
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-lg font-bold h-10 border-transparent hover:border-input focus:border-emerald-500/50 transition-all px-0 pl-2 -ml-2 bg-transparent"
                placeholder="Item Name (e.g. Facebook)"
              />

              <Select
                value={formData.categoryId}
                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
              >
                <SelectTrigger tabIndex={-1} className="h-8 w-[200px] text-xs">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PASSWORD_CATEGORIES.map((cat) => (
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

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" tabIndex={-1}>
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
                className="min-h-[120px] resize-none text-sm bg-background"
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
      </div>
    </div>
  );
}
