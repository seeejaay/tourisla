import { z } from "zod";

const CompanionSchema = z.object({
  first_name: z
    .string()
    .min(3, "First name is required")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  last_name: z
    .string()
    .min(2, "Last name is required")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  age: z.number().int().min(0, "Age must be a positive number"),
  sex: z.enum(["MALE", "FEMALE"]),
  phone_number: z
    .string()
    .min(11, "Phone number is required")
    .regex(/^\+?[0-9\s-]+$/, "Phone number must be a valid format"),
});

const BookingSchema = z.object({
  id: z.number().optional(),
  scheduled_date: z.string(),
  number_of_guests: z
    .number()
    .int()
    .min(1, "Number of guests must be at least 1"),
  total_price: z.number().min(0, "Total price must be at least 0"),
  proof_of_payment: z
    .object({
      uri: z.string(),
      name: z.string(),
      type: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
    })
    .refine(
      (file) => !file.size || file.size <= 5 * 1024 * 1024,
      "File size must be 5MB or less"
    )
    .refine(
      (file) =>
        !file.type ||
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        ),
      "File must be an image (jpeg, png, gif, webp)"
    ),
  notes: z
    .string()
    .regex(
      /^[\w\s.,!?'"-]*$/,
      "Notes can only contain letters, numbers, spaces, and basic punctuation"
    )
    .optional(),
  companions: z.array(CompanionSchema).optional(), // <-- add this line
});

export type Booking = z.infer<typeof BookingSchema>;
export default BookingSchema;
