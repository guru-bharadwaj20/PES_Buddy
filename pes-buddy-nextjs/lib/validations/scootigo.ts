import { z } from "zod";

export const bookScooterSchema = z.object({
  scooterId: z.string().min(1, "Scooter ID is required"),
  pickup: z.string().min(1, "Pickup location is required"),
  destination: z.string().min(1, "Destination is required"),
  distance: z.number().min(0.1, "Distance must be at least 0.1 km"),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]),
});

export const scooterSchema = z.object({
  scooterId: z.string().min(1, "Scooter ID is required"),
  driverName: z.string().min(1, "Driver name is required").optional(),
  vehicleNumber: z.string().optional(),
  route: z.string().optional(),
  farePerKm: z.number().min(0.01, "Fare must be positive").default(5),
  available: z.boolean().default(true),
  maintenance: z.boolean().default(false),
});

export type BookScooterInput = z.infer<typeof bookScooterSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type ScooterInput = z.infer<typeof scooterSchema>;
