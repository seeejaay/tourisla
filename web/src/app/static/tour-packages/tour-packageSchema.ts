import { z } from "zod";

const tourPackageSchema = z.object({
  id: z.number().optional(),
  package_name: z
    .string()
    .min(3, { message: "Package name is required." })
    .max(100, { message: "Package name must be less than 100 characters." })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "Package name can only contain letters, numbers, and spaces.",
    }),
  location: z
    .string()
    .min(3, { message: "Location is required." })
    .max(100, { message: "Location must be less than 100 characters." })
    .regex(/^[a-zA-Z0-9\s,]+$/, {
      message:
        "Location can only contain letters, numbers, spaces, and commas.",
    }),
  description: z
    .string()
    .min(10, { message: "Description is required." })
    .max(500, { message: "Description must be less than 500 characters." })
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, {
      message:
        "Description can only contain letters, numbers, spaces, and common punctuation.",
    }),
  price: z
    .number()
    .min(0, { message: "Price must be a positive number." })
    .max(100000, { message: "Price must be less than 100,000." }),
  duration_days: z
    .number()
    .min(1, { message: "Duration must be at least 1 day." })
    .max(365, { message: "Duration must be less than 365 days." }),
  inclusions: z
    .string()
    .min(5, { message: "Inclusions are required." })
    .max(300, { message: "Inclusions must be less than 300 characters." })
    .regex(/^[a-zA-Z0-9\s,.'\-()/↔]+$/, {
      message:
        "Inclusions can only contain letters, numbers, spaces, and common punctuation.",
    }),
  exclusions: z
    .string()
    .min(5, { message: "Exclusions are required." })
    .max(300, { message: "Exclusions must be less than 300 characters." })
    .regex(/^[a-zA-Z0-9\s,.'\-()/↔]+$/, {
      message:
        "Exclusions can only contain letters, numbers, spaces, and common punctuation.",
    }),
  available_slots: z
    .number()
    .min(0, { message: "Available slots must be a non-negative number." })
    .max(1000, { message: "Available slots must be less than 1000." }),
  is_active: z.boolean().default(true).optional(),
  date_start: z
    .string()
    .min(10, { message: "Start date is required." })
    .max(10, { message: "Start date must be in YYYY-MM-DD format." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Start date must be in YYYY-MM-DD format.",
    }),
  date_end: z
    .string()
    .min(10, { message: "End date is required." })
    .max(10, { message: "End date must be in YYYY-MM-DD format." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "End date must be in YYYY-MM-DD format.",
    }),
  start_time: z
    .string()
    .min(5, { message: "Start time is required." })
    .max(5, { message: "Start time must be in HH:MM format." })
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Start time must be in HH:MM format.",
    }),
  end_time: z
    .string()
    .min(5, { message: "End time is required." })
    .max(5, { message: "End time must be in HH:MM format." })
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "End time must be in HH:MM format.",
    }),
  cancellation_days: z
    .number()
    .min(0, { message: "Cancellation days must be a non-negative number." })
    .max(365, { message: "Cancellation days must be less than 365." }),
  cancellation_note: z
    .string()
    .max(500, {
      message: "Cancellation policy must be less than 500 characters.",
    })
    .optional(),
});

export type TourPackage = z.infer<typeof tourPackageSchema>;
export default tourPackageSchema;
