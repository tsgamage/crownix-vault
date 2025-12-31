import { useTheme, type Theme } from "@/components/providers/ThemeProvider";
import { SettingsModal } from "@/modals/settings/Settings";
import { useSettingsStore } from "@/store/vault/settings.store";
import type { SettingsConfig } from "@/utils/types/global.types";
import type { ISettingsGroupByOptions, ISettingsSortByOptions } from "@/utils/types/vault";

export default function Settings() {
  const { appSettings, setAppSettings, vaultSettings, setVaultSettings } = useSettingsStore();
  const { setTheme, theme } = useTheme();

  const INITIAL_SETTINGS_CONFIG: SettingsConfig = {
    sections: [
      {
        id: "general",
        title: "General",
        items: [
          {
            id: "theme",
            type: "select",
            title: "Appearance",
            description: "Select your preferred theme",
            value: theme,
            options: [
              { label: "System", value: "system" },
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ],
          },
          {
            id: "language",
            type: "select",
            title: "Language",
            description: "Select your preferred language (not available yet)",
            value: appSettings.language,
            options: [
              { label: "Sinhala (සිංහල)", value: "si" },
              { label: "English", value: "en" },
              { label: "Tamil (தமிழ்)", value: "ta" },
            ],
            disabled: true,
          },
        ],
      },
      {
        id: "vault",
        title: "Vault",
        items: [
          {
            id: "vaultName",
            type: "input",
            title: "Vault Name",
            description: "Enter your vault name",
            value: vaultSettings.vaultName,
          },
          {
            id: "autoBackup",
            type: "toggle",
            title: "Auto Backup",
            description: "Automatically backup your vault (not available yet)",
            value: false,
            disabled: true,
          },
          {
            id: "autoLock",
            type: "toggle",
            title: "Auto Lock",
            description: "Lock the vault after a 15 minutes of inactivity",
            value: appSettings.autoLock,
          },
          {
            id: "defaultGroupBy",
            type: "select",
            title: "Default Group By",
            description: "Select the default grouping option for vault passwords",
            value: appSettings.defaultGroupBy,
            options: [
              { label: "None", value: "none" },
              { label: "Name", value: "name" },
              { label: "Category", value: "category" },
              { label: "Strength", value: "strength" },
            ] as Array<{ label: string; value: ISettingsGroupByOptions }>,
          },
          {
            id: "defaultSortBy",
            type: "select",
            title: "Default Sort By",
            description: "Select the default sorting option for vault passwords",
            value: appSettings.defaultSortBy,
            options: [
              { label: "Name", value: "name" },
              { label: "Oldest", value: "oldest" },
              { label: "Recent", value: "recent" },
            ] as Array<{ label: string; value: ISettingsSortByOptions }>,
          },
        ],
      },
    ],
  };

  const handleSettingsChange = (id: string, value: string) => {
    switch (id) {
      case "theme":
        setTheme(value as Theme);
        break;
      case "vaultName":
          setVaultSettings({ ...vaultSettings, [id]: value });
        break;
      default:
        setAppSettings({ ...appSettings, [id]: value });
    }
  };

  return <SettingsModal config={INITIAL_SETTINGS_CONFIG} onSettingChange={handleSettingsChange} />;
}
