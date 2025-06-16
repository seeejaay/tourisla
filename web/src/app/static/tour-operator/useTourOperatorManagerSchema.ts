import { z } from "zod";

const tourOperatorSchema = z.object({
  id: z.number().optional(),
  first_name: z
    .string()
    .min(3, { message: "First name is required." })
    .max(50, { message: "First name must be less than 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "First name can only contain letters and spaces.",
    }),
  last_name: z
    .string()
    .min(2, { message: "Last name is required." })
    .max(50, { message: "Last name must be less than 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Last name can only contain letters and spaces.",
    }),
  operator_name: z
    .string()
    .min(5, { message: "Operator name is required." })
    .max(100, { message: "Operator name must be less than 100 characters." })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "Operator name can only contain letters, numbers, and spaces.",
    }),
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .max(100, { message: "Email must be less than 100 characters." }),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters." })
    .max(15, { message: "Phone number must be less than 15 characters." })
    .regex(/^\+?[0-9]+$/, {
      message:
        "Phone number can only contain numbers and an optional leading +.",
    }),
  mobile_number: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 characters." })
    .max(15, { message: "Mobile number must be less than 15 characters." })
    .regex(/^\+?[0-9]+$/, {
      message:
        "Mobile number can only contain numbers and an optional leading +.",
    }),
  office_address: z
    .string()
    .min(5, { message: "Office address is required." })
    .max(200, { message: "Office address must be less than 200 characters." })
    .regex(/^[a-zA-Z0-9\s,.'-]+$/, {
      message:
        "Office address can only contain letters, numbers, spaces, and common punctuation.",
    }),
});
export type TourOperator = z.infer<typeof tourOperatorSchema>;
export type TourOperatorSchema = z.infer<typeof tourOperatorSchema>;
export { tourOperatorSchema };
