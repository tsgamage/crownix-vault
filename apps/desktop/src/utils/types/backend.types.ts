import type { IAppSettings } from "./vault";

export type PickVaultFolderResult =
  | { success: true; file_path: string; found: boolean; multiple: boolean }
  | { success: false; message: string };

export type CreateVaultFileResult = { success: true } | { success: false; message: string };

export type PickExistingVaultFileResult =
  | { success: true; buffer: number[]; path: string }
  | { success: false; message: string };

export type SaveVaultFileResult = { success: true } | { success: false; message: string };

export type AutoLoadVaultResult =
  | {
      success: true;
      buffer: number[];
      path: string;
    }
  | {
      success: false;
      backup: boolean;
    };

export type ExportBackupResult =
  | {
      success: true;
      backup_path: string;
    }
  | {
      success: false;
      message: string;
    };

export type LoadAppSettingsResult =
  | {
      success: true;
      data: IAppSettings;
    }
  | {
      success: false;
      message: string;
    };

export type SaveAppSettingsResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };
