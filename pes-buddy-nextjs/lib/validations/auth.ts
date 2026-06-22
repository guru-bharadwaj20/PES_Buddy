import { z } from "zod";

const SRN_REGEX = /^PES[12]UG\d{2}[A-Z]{2}\d{3}$/i;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces")
    .trim(),
  srn: z
    .string()
    .min(1, "SRN is required")
    .regex(SRN_REGEX, "Invalid SRN format (e.g., PES1UG21CS001)")
    .trim()
    .toUpperCase(),
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  role: z.enum(["CUSTOMER", "ADMIN"]).default("CUSTOMER"),
});

export const loginSchema = z.object({
  srn: z
    .string()
    .min(1, "SRN is required")
    .regex(SRN_REGEX, "Invalid SRN format")
    .trim()
    .toUpperCase(),
  password: z.string().min(1, "Password is required"),
  isAdmin: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .trim()
    .toLowerCase(),
});

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces")
    .trim()
    .optional(),
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal("")),
});

export const passwordResetSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
