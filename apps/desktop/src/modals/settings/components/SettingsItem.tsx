import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type SettingItem as ISettingItem } from "@/utils/types/global.types";

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
            checked={item.value as boolean}
            onCheckedChange={(checked) => onChange(item.id, checked)}
          />
        );

      case "select":
        return (
          <Select
            value={item.value as string}
            onValueChange={(value) => onChange(item.id, value)}
          >
            <SelectTrigger className="w-[180px]">
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
            onClick={() => onChange(item.id, undefined)}
          >
            {item.actionLabel || "Click me"}
          </Button>
        );

      case "danger-button":
        return (
          <Button
            variant="destructive"
            onClick={() => onChange(item.id, undefined)}
          >
            {item.actionLabel || "Delete"}
          </Button>
        );

      case "input":
        return (
          <Input
            value={item.value as string}
            onChange={(e) => onChange(item.id, e.target.value)}
            placeholder={item.placeholder}
            className="max-w-[200px]"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-0.5 max-w-[70%]">
        <Label className="text-base font-medium">{item.title}</Label>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>
      <div className="shrink-0 ml-4">{renderControl()}</div>
    </div>
  );
}
