import { useTheme, type Theme } from "@/components/providers/ThemeProvider";
import useDebounce from "@/hooks/use-debounce";
import { SettingsModal } from "@/modals/settings/Settings";
import { useFileStore } from "@/store/file.store";
import { useSettingsStore } from "@/store/vault/settings.store";
import type { SaveAppSettingsResult } from "@/utils/types/backend.types";
import type { SettingsConfig } from "@/utils/types/global.types";
import type { ISettingsGroupByOptions, ISettingsSortByOptions } from "@/utils/types/vault";
import { invoke } from "@tauri-apps/api/core";
import { message } from "@tauri-apps/plugin-dialog";
import { useEffect } from "react";
import KeyboardModal from "@/modals/Keyboard/Keyboard";
import { useKeyboardShortcutsModal } from "@/hooks/use-keyboard-shortcuts-modal";
import PasswordChange from "@/modals/PasswordChange/PasswordChange";
import { usePasswordChangeModal } from "@/hooks/use-password-change-modal";

export default function Settings() {
  const { appSettings, setAppSettings, vaultSettings, setVaultSettings } = useSettingsStore();
  const {
    isOpen: isKeyboardOpen,
    open: openKeyboard,
    onOpenChange: onKeyboardOpenChange,
  } = useKeyboardShortcutsModal();
  const {
    isOpen: isPasswordChangeOpen,
    open: openPasswordChange,
    onOpenChange: setIsPasswordChangeOpen,
  } = usePasswordChangeModal();

  const { setTheme, theme } = useTheme();
  const debouncedVaultName = useDebounce(vaultSettings.vaultName, 1000);
  const debouncedAppSettings = useDebounce(appSettings as any, 1000);

  useEffect(() => {
    async function saveAppSettings() {
      const response: SaveAppSettingsResult = await invoke("save_app_settings", { settings: debouncedAppSettings });
      if (!response.success) {
        message("Failed to save settings", { title: "Error", kind: "error" });
      }
    }
    saveAppSettings();
  }, [debouncedAppSettings]);

  const saveFile = useFileStore((state) => state.saveFile);

  useEffect(() => {
    saveFile();
  }, [debouncedVaultName]);

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
          {
            id: "shortcuts",
            type: "button",
            title: "Keyboard Shortcuts",
            description: "Customize keyboard shortcuts",
            actionLabel: "Open Keyboard Shortcuts",
          },
          {
            id: "changePassword",
            type: "button",
            title: "Change Password",
            description: "Change your vault password",
            actionLabel: "Change Password",
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
      case "shortcuts":
        openKeyboard();
        break;
      case "changePassword":
        openPasswordChange();
        break;
      default:
        setAppSettings({ ...appSettings, [id]: value });
    }
  };

  return (
    <>
      <SettingsModal config={INITIAL_SETTINGS_CONFIG} onSettingChange={handleSettingsChange} />
      <KeyboardModal
        isOpen={isKeyboardOpen}
        onOpenChange={onKeyboardOpenChange}
        onSave={(_shortcuts) => {
          // console.log("Saving shortcuts:", shortcuts);
        }}
      />
      <PasswordChange isOpen={isPasswordChangeOpen} onOpenChange={setIsPasswordChangeOpen} />
    </>
  );
}
