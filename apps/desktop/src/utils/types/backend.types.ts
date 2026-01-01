export type PickVaultFolderResult =
  | { success: true; file_path: string; found: boolean; multiple: boolean }
  | { success: false; message: string };

export type CreateVaultFileResult = { success: true } | { success: false; message: string };

export type PickExistingVaultFileResult =
  | { success: true; buffer: number[]; path: string }
  | { success: false; message: string };

export type SaveVaultFileResult = { success: true } | { success: false; message: string };
