import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Save } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { usePasswordCategoryStore } from "@/store/vault/passwordCategory.store";
import { usePasswordStore } from "@/store/vault/password.store";
import { useUiStore } from "@/store/ui.store";
import type { IPasswordCategory } from "@/utils/types/vault";

const COLORS = [
  { name: "Green", class: "bg-green-900" },
  { name: "Blue", class: "bg-blue-900" },
  { name: "Purple", class: "bg-purple-900" },
  { name: "Orange", class: "bg-orange-900" },
  { name: "Red", class: "bg-red-900" },
  { name: "Pink", class: "bg-pink-900" },
  { name: "Teal", class: "bg-teal-900" },
  { name: "Cyan", class: "bg-cyan-900" },
];

const ICONS = [
  "Folder",
  "Globe",
  "Briefcase",
  "DollarSign",
  "Gamepad2",
  "Lock",
  "Key",
  "Shield",
  "Star",
  "Heart",
  "Mail",
  "User",
  "Smartphone",
  "Monitor",
];

export default function CreateAndEditCategory() {
  const passwordCategories = usePasswordCategoryStore((state) => state.passwordCategories);
  const selectedCategoryId = usePasswordCategoryStore((state) => state.selectedCategoryId);
  const editingData = passwordCategories.find((c) => c.id === selectedCategoryId);

  const createPasswordCategory = usePasswordCategoryStore((state) => state.createPasswordCategory);
  const updatePasswordCategory = usePasswordCategoryStore((state) => state.updatePasswordCategory);
  const clearSelectedPasswordId = usePasswordStore((state) => state.clearSelectedPasswordId);

  const isPasswordCategoryEditShown = useUiStore((state) => state.isPasswordCategoryEditShown);
  const isEditing = isPasswordCategoryEditShown;
  const setIsPasswordCategoryEditShown = useUiStore((state) => state.setIsPasswordCategoryEditShown);
  const setIsPasswordCategoryCreateShown = useUiStore((state) => state.setIsPasswordCategoryCreateShown);

  // const { openDialog } = useDialog();
  const [formData, setFormData] = useState<Pick<IPasswordCategory, "name" | "description" | "color" | "icon">>({
    name: "",
    description: "",
    color: "bg-green-900",
    icon: "Folder",
  });
  const IconComponent = (LucideIcons as any)[formData.icon || "Folder"];

  const hanleCancelCreateOrEditCategory = () => {
    setIsPasswordCategoryEditShown(false);
    setIsPasswordCategoryCreateShown(false);
    clearSelectedPasswordId();
  };

  useEffect(() => {
    if (isEditing && editingData) {
      setFormData({
        name: editingData.name,
        description: editingData.description,
        color: editingData.color,
        icon: editingData.icon,
      });
    }
  }, [isEditing, editingData]);

  const handleCreateCategory = () => {
    if (isEditing && editingData) {
      updatePasswordCategory({
        ...formData,
        id: editingData.id,
        isDeleted: false,
        createdAt: editingData.createdAt,
        updatedAt: Date.now(),
      });
      hanleCancelCreateOrEditCategory();
    } else {
      const id = crypto.randomUUID();
      createPasswordCategory({ ...formData, id, createdAt: Date.now(), updatedAt: Date.now(), isDeleted: false });
      hanleCancelCreateOrEditCategory();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-border/40">
        <div className="flex items-center mb-4 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 -ml-2 gap-1 text-xs"
            onClick={hanleCancelCreateOrEditCategory}
          >
            <ChevronLeft className="w-3 h-3" /> Back
          </Button>
          <span className="mx-2 opacity-20">/</span>
          <span className="text-xs font-medium uppercase tracking-wider">{isEditing ? "Edit" : "Create"} Category</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{isEditing ? "Edit" : "New"} Category</h2>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            disabled={!formData.name}
            onClick={handleCreateCategory}
          >
            <Save className="w-4 h-4" /> Save Category
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 max-w-2xl mx-auto w-full">
        <div className="space-y-6 p-6 rounded-xl border border-border/40 bg-card/50 shadow-xs">
          {/* Name */}
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input
              placeholder="e.g., Social Media"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-lg font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="What is this category for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="resize-none min-h-25"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-6 p-6 rounded-xl border border-border/40 bg-card/50 shadow-xs">
          <h3 className="font-medium text-sm text-foreground/80">Appearance</h3>

          {/* Color Picker */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Color</Label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setFormData({ ...formData, color: color.class })}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all ring-offset-background",
                    color.class,
                    formData.color === color.class
                      ? "ring-2 ring-emerald-500 ring-offset-2 scale-110"
                      : "hover:scale-105 opacity-80 hover:opacity-100"
                  )}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Icon</Label>
            <div className="grid grid-cols-7 gap-2">
              {ICONS.map((iconName) => {
                const Icon = (LucideIcons as any)[iconName];
                const isSelected = formData.icon === iconName;

                return (
                  <button
                    key={iconName}
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center border transition-all",
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-border/40">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">Preview</Label>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background/50 max-w-xs">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0",
                  formData.color
                )}
              >
                {IconComponent && <IconComponent className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-medium">{formData.name || "Category Name"}</div>
                <div className="text-xs text-muted-foreground">{formData.description || "Description"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
