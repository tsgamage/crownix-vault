type AppLanguages = "en" | "si" | "ta";

export type ISettingsGroupByOptions = "none" | "name" | "category" | "strength";
export type ISettingsSortByOptions = "name" | "recent" | "oldest";

export interface IVaultSettings {
  vaultName: string;
  isNewUser: boolean;
}

export interface IAppSettings {
  language: AppLanguages;
  defaultGroupBy: ISettingsGroupByOptions;
  defaultSortBy: ISettingsSortByOptions;
  autoLock: boolean;
}
