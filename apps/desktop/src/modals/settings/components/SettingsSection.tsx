import { type SettingsSection as ISettingsSection } from "@/utils/types/global.types";
import { SettingsItem } from "./SettingsItem";
import { Separator } from "@/components/ui/separator";

interface SettingsSectionProps {
  section: ISettingsSection;
  onSettingChange: (id: string, value: any) => void;
  isLast?: boolean;
}

export function SettingsSection({
  section,
  onSettingChange,
  isLast,
}: SettingsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
          {section.title}
        </h3>
        <div className="divide-y divide-border/50">
          {section.items.map((item) => (
            <SettingsItem
              key={item.id}
              item={item}
              onChange={onSettingChange}
            />
          ))}
        </div>
      </div>
      {!isLast && <Separator className="my-6" />}
    </div>
  );
}
