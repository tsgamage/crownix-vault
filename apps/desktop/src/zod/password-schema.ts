import { boolean, string, url, z } from "zod";

export const passwordCustomFieldSchema = z.object({
  id: string(),
  label: string()
    .min(1, "Label is required for custom field")
    .max(30, "Label must be at most 30 characters long for custom field"),
  type: z.enum(["text", "hidden", "url", "phone", "email"]),
  value: string().min(1, "Value is required for custom field"),
});

export const passwordSchema = z.object({
  id: string(),
  title: string().min(1, "Title is required").max(30, "Title must be at most 30 characters long"),
  username: string().optional(),
  password: string(),
  isDeleted: boolean(),

  urls: z.array(url()).optional(),
  icon: string().optional(),
  notes: string().optional(),
  fields: z.array(passwordCustomFieldSchema).optional(),

  categoryId: string().optional(),
  tags: z.array(string()).optional(),
  isFavorite: boolean(),

  createdAt: z.number(),
  updatedAt: z.number(),
});

export type PasswordItemType = z.infer<typeof passwordSchema>;
export type PasswordCustomFieldType = z.infer<typeof passwordCustomFieldSchema>;
