export interface IBaseField {
  id: string;
  label: string;
}

export interface ITextField extends IBaseField {
  type: "text";
  value: string;
}

export interface IHiddenField extends IBaseField {
  type: "hidden";
  value: string;
}

export interface IUrlField extends IBaseField {
  type: "url";
  value: string;
}

export interface IPhoneField extends IBaseField {
  type: "phone";
  value: string;
}

export interface IEmailField extends IBaseField {
  type: "email";
  value: string;
}

export interface IPasswordCategory {
  id: string;
  name: string;
  color: string;
}

export type IPasswordCustomField =
  | ITextField
  | IHiddenField
  | IUrlField
  | IEmailField
  | IPhoneField;

export interface IPasswordItem {
  id: string;
  title: string;
  username?: string;
  password: string;
  isDeleted: boolean;

  urls?: string[];
  icon?: string;
  notes?: string;
  fields?: IPasswordCustomField[];

  categoryId?: string;
  tags?: string[];
  isFavorite: boolean;

  createdAt: number;
  updatedAt: number;
}
