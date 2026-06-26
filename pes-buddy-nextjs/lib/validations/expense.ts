import { z } from "zod";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Study Materials",
  "Miscellaneous",
] as const;

export const addExpenseSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must not exceed 200 characters"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must not exceed 50 characters"),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0"),
  date: z.string().optional(),
});

export type AddExpenseInput = z.infer<typeof addExpenseSchema>;
