import { z } from "zod";

const tourGuideSchema = z.object({
  id: z.number().optional(),
  first_name: z
    .string()
    .min(1, { message: "First name is required." })
    .max(50, { message: "First name must be less than 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "First name can only contain letters and spaces.",
    }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required." })
    .max(50, { message: "Last name must be less than 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Last name can only contain letters and spaces.",
    }),
  birth_date: z.date({
    required_error: "Birth date is required.",
    invalid_type_error: "Birth date must be a valid date",
  }),
  sex: z.enum(["MALE", "FEMALE"], {
    message: "Sex is required.",
  }),
  mobile_number: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 characters." })
    .max(15, { message: "Mobile number must be less than 15 characters." })
    .regex(/^\+?[0-9]+$/, {
      message:
        "Mobile number can only contain numbers and an optional leading +.",
    }),
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .max(100, { message: "Email must be less than 100 characters." }),
  profile_picture: z
    .instanceof(File, {
      message: "Profile picture must be a valid file.",
    })
    .refine(
      (file) => {
        return file.size <= 5 * 1024 * 1024; // 5MB limit
      },
      {
        message: "Profile picture must be less than 5MB.",
      }
    )
    .refine((file) => file.type.startsWith("image/"), {
      message: "Profile picture must be an image file.",
    })
    .optional(),
  reason_for_applying: z
    .string()
    .min(10, { message: "Reason for applying is required." })
    .max(500, {
      message: "Reason for applying must be less than 500 characters.",
    })
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, {
      message:
        "Reason for applying can only contain letters, numbers, spaces, commas, periods, apostrophes, and hyphens.",
    }),
});

export type TourGuide = z.infer<typeof tourGuideSchema>;
export type TourGuideSchema = z.infer<typeof tourGuideSchema>;
export { tourGuideSchema };
