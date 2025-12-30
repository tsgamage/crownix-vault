import { SettingsModal } from "@/modals/settings/Settings";

import type { SettingsConfig } from "@/utils/types/global.types";

export default function Settings() {
  const INITIAL_SETTINGS_CONFIG: SettingsConfig = {
    sections: [
      {
        id: "vault",
        title: "Vault",
        items: [
          {
            id: "vaultName",
            type: "input",
            title: "Vault Name",
            description: "Enter your vault name",
            value: "My Vault",
          },
          {
            id: "autoBackup",
            type: "toggle",
            title: "Auto Backup",
            description: "Automatically backup your vault",
            value: false,
          },
          {
            id: "autoLock",
            type: "toggle",
            title: "Auto Lock",
            description: "Lock the vault after a period of inactivity",
            value: false,
          },
          {
            id: "autoLockInterval",
            type: "input",
            title: "Auto Lock Interval (in minutes)",
            description: "App will lock after this interval of inactivity",
            value: "10",
          },
          {
            id: "fileLocation",
            type: "input",
            title: "Vault File Location",
            description: "Location of the vault file",
            value: "",
          },
        ],
      },
      {
        id: "general",
        title: "General",
        items: [
          {
            id: "theme",
            type: "select",
            title: "Appearance",
            description: "Select your preferred theme",
            value: "system",
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
            value: "en",
            options: [
              { label: "English", value: "en" },
              { label: "Sinhala (සිංහල)", value: "si" },
              { label: "Tamil (தமிழ்)", value: "ta" },
            ],
          },
        ],
      },
    ],
  };

  return <SettingsModal config={INITIAL_SETTINGS_CONFIG} onSettingChange={(id, value) => console.log(id, value)} />;
}
