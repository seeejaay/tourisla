import { z } from "zod";
import barangays from "@/app/static/barangay.json";
const touristSpotSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(3, { message: "Name is required." })
    .max(100, { message: "Name must be less than 100 characters." })
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, {
      message:
        "Name can only contain letters, numbers, spaces, commas, periods, apostrophes, and hyphens.",
    }),
  type: z.enum([
    "ADVENTURE",
    "BEACH",
    "CAMPING",
    "CULTURAL",
    "HISTORICAL",
    "NATURAL",
    "RECREATIONAL",
    "RELIGIOUS",
    "OTHERS",
  ]),
  description: z
    .string()
    .min(10, { message: "Description is required." })
    .max(500, { message: "Description must be less than 500 characters." })
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, {
      message:
        " Description can only contain letters, numbers, spaces, commas, periods, apostrophes, and hyphens.",
    }),
  barangay: z.enum(
    barangays.map((barangay) => barangay.name) as [string, ...string[]],
    {
      message: "Invalid barangay selected.",
    }
  ),
  municipality: z.enum(["SANTA_FE", "BANTAYAN", "MADRIDEJOS"], {
    message: "Invalid municipality selected.",
  }),
  province: z.literal("Cebu", {
    message: "Province must be Cebu.",
  }),
  longitude: z
    .string()
    .min(1, { message: "Longitude is required." })
    .max(20, { message: "Longitude must be less than 20 characters." })
    .regex(/^-?\d+(\.\d+)?$/, {
      message: "Longitude must be a valid number.",
    }),
  latitude: z
    .string()
    .min(1, { message: "Latitude is required." })
    .max(20, { message: "Latitude must be less than 20 characters." })
    .regex(/^-?\d+(\.\d+)?$/, {
      message: "Latitude must be a valid number.",
    }),
  opening_hours: z
    .string()
    .min(5, { message: "Opening hours are required." })
    .max(100, { message: "Opening hours must be less than 100 characters." })
    .regex(/^[APM0-9:\.\s]+$/, {
      message:
        "Only A, P, M, numbers, colon (:), dot (.), and spaces are allowed.",
    }),
  closing_hours: z
    .string()
    .min(5, { message: "Closing hours are required." })
    .max(100, { message: "Closing hours must be less than 100 characters." })
    .regex(/^[APM0-9:\.\s]+$/, {
      message:
        "Only A, P, M, numbers, colon (:), dot (.), and spaces are allowed.",
    }),
  contact_number: z
    .string()
    .min(12, { message: "Contact number is required." })
    .max(15, { message: "Contact number must be less than 15 characters." })
    .regex(/^\+?[0-9]+$/, {
      message: "Contact number can only contain numbers.",
    }),
  facebook_page: z
    .string()
    .max(100, { message: "Facebook page must be less than 100 characters." })
    .regex(/^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9._%+-]+\/?$/, {
      message: "Invalid Facebook page URL.",
    })
    .optional(),
  rules: z
    .string()
    .max(1000, { message: "Rules must be less than 500 characters." })
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, {
      message:
        "Rules can only contain letters, numbers, spaces, commas, periods, apostrophes, and hyphens.",
    }),
  image: z
    .instanceof(File, { message: "Image is required." })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB.",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image.",
    })
    .optional(),
});

export type TouristSpot = z.infer<typeof touristSpotSchema>;
export type TouristSpotSchema = z.infer<typeof touristSpotSchema>;
export { touristSpotSchema };
