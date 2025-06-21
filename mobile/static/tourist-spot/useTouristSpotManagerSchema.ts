import { z } from "zod";
import barangays from "@/static/barangay.json";
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
  province: z.literal("CEBU", {
    message: "Province must be Cebu.",
  }),
  location: z
    .string()
    .min(5, { message: "Location is required." })
    .max(255, { message: "Location must be less than 255 characters." }) // URLs can be longer
    .regex(/^(https?:\/\/)?[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/, {
      message: "Please enter a valid location or URL.",
    }),
  opening_time: z
    .string()
    .min(5, { message: "Opening hours are required." })
    .max(100, { message: "Opening hours must be less than 100 characters." })
    .regex(/^[APM0-9:\.\s]+$/, {
      message:
        "Only A, P, M, numbers, colon (:), dot (.), and spaces are allowed.",
    }),
  closing_time: z
    .string()
    .min(5, { message: "Closing hours are required." })
    .max(100, { message: "Closing hours must be less than 100 characters." })
    .regex(/^[APM0-9:\.\s]+$/, {
      message:
        "Only A, P, M, numbers, colon (:), dot (.), and spaces are allowed.",
    }),
  days_open: z
    .string()
    .min(6, { message: "Days open information is required." })
    .max(100, { message: "Days open text is too long." })
    .regex(/^[a-zA-Z\s,]+$/, {
      message: "Days open can only contain letters, spaces, and commas.",
    }),

  entrance_fee: z
    .string()
    .min(2, { message: "Entrance fee is required." })
    .max(20, { message: "Entrance fee must be less than 20 characters." })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message:
        "Entrance fee must be a valid number with up to 2 decimal places.",
    })
    .or(z.literal("N/A")),
  other_fees: z
    .string()
    .max(100, { message: "Other fees must be less than 100 characters." })
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, {
      message:
        "Other fees can only contain letters, numbers, spaces, commas, periods, apostrophes, and hyphens.",
    })
    .or(z.literal("N/A")),
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
    .or(z.literal("N/A"))
    .or(z.literal(""))
    .optional(),
  rules: z
    .string()
    .max(1000, { message: "Rules must be less than 500 characters." })
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, {
      message:
        "Rules can only contain letters, numbers, spaces, commas, periods, apostrophes, and hyphens.",
    }),
  images: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Image must be less than 5MB.",
        })
        .refine((file) => file.type.startsWith("image/"), {
          message: "File must be an image.",
        }),
      z.array(
        z.object({
          id: z.number(),
          tourist_spot_id: z.number(),
          image_url: z.string(),
        })
      ),
      z.undefined(),
    ])
    .optional(),
});

export type TouristSpotImage = {
  id: number;
  tourist_spot_id: number;
  image_url: string;
};
export type TouristSpot = z.infer<typeof touristSpotSchema> & {
  images: TouristSpotImage[];
};
export type TouristSpotSchema = z.infer<typeof touristSpotSchema>;
export { touristSpotSchema };
