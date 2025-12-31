export interface IPasswordCustomField {
  id: string;
  label: string;
  type: "text" | "hidden" | "url" | "phone" | "email";
  value: string;
}

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
