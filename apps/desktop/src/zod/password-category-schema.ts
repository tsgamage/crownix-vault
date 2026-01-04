import { z } from "zod";

export const passwordCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").max(30, "Name must be at most 30 characters long"),
  icon: z.string(),
  color: z.string(),
  description: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
  isDeleted: z.boolean(),
});

export type PasswordCategoryType = z.infer<typeof passwordCategorySchema>;
