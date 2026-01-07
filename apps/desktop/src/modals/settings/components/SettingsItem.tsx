import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type SettingItem as ISettingItem } from "@/utils/types/global.types";
import { cn } from "@/lib/utils";

interface SettingsItemProps {
  item: ISettingItem;
  onChange: (id: string, value: any) => void;
}

export function SettingsItem({ item, onChange }: SettingsItemProps) {
  const renderControl = () => {
    switch (item.type) {
      case "toggle":
        return (
          <Switch
            disabled={item.disabled}
            checked={item.value as boolean}
            onCheckedChange={(checked) => (item.disabled ? undefined : onChange(item.id, checked))}
          />
        );

      case "select":
        return (
          <Select
            value={item.value as string}
            onValueChange={(value) => (item.disabled ? undefined : onChange(item.id, value))}
            disabled={item.disabled}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {item.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "button":
        return (
          <Button
            variant="outline"
            onClick={() => (item.disabled ? undefined : onChange(item.id, undefined))}
            disabled={item.disabled}
          >
            {item.actionLabel || "Click me"}
          </Button>
        );

      case "danger-button":
        return (
          <Button
            variant="destructive"
            onClick={() => (item.disabled ? undefined : onChange(item.id, undefined))}
            disabled={item.disabled}
          >
            {item.actionLabel || "Delete"}
          </Button>
        );

      case "input":
        return (
          <Input
            value={item.value as string}
            onChange={(e) => (item.disabled ? undefined : onChange(item.id, e.target.value))}
            placeholder={item.placeholder}
            className="max-w-50"
            disabled={item.disabled}
            autoComplete="one-time-code"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn("flex items-center justify-between py-4", item.disabled ? "opacity-50" : "")}
      title={item.disabled ? "This option is not available yet" : undefined}
    >
      <div className="space-y-0.5 max-w-[70%]">
        <Label className="text-base font-medium">{item.title}</Label>
        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
      </div>
      <div className="shrink-0 ml-4">{renderControl()}</div>
    </div>
  );
}
