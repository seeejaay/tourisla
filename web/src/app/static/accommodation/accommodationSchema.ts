import { z } from "zod";

const AccommodationSchema = z.object({
  id: z.number().optional(),
  name_of_establishment: z
    .string()
    .min(5, "Name of Establishment is required")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Name of Establishment must contain only letters, numbers, and spaces"
    ),
  type: z
    .string()
    .min(3, "Type of Accommodation is required")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Type of Accommodation must contain only letters and spaces"
    ),
  no_of_rooms: z.number().int().min(1, "Number of Rooms must be at least 1"),
  no_of_employees: z
    .number()
    .int()
    .min(1, "Number of Employees must be at least 1"),
  Year: z
    .number()
    .int()
    .min(1900, "Year of Establishment must be at least 1900")
    .max(
      new Date().getFullYear(),
      "Year of Establishment cannot be in the future"
    ),
  Region: z.literal("CEBU"),
  Province: z.literal("CEBU"),
  municipality: z.literal("BANTAYAN"),
});

export type Accommodation = z.infer<typeof AccommodationSchema>;
export type AccommodationSchema = z.infer<typeof AccommodationSchema>;
export { AccommodationSchema };
