import { z } from "zod";

export const orderItemSchema = z.object({
  menuItem: z.string().min(1, "Menu item is required"),
  qty: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

export const createOrderSchema = z.object({
  canteenName: z.string().optional(),
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "PREPARING", "COMPLETED", "CANCELLED"]),
  rejectionReason: z.string().optional(),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z.number().min(0.01, "Price must be positive"),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  available: z.boolean().default(true),
  category: z.string().max(50).optional(),
  canteenId: z.string().min(1, "Canteen is required"),
});

export const canteenSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  location: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type CanteenInput = z.infer<typeof canteenSchema>;
