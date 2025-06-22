import { z } from "zod";

const BookingSchema = z.object({
  id: z.number().optional(),
  scheduled_date: z.string(),
  number_of_guests: z
    .number()
    .int()
    .min(1, "Number of guests must be at least 1"),
  total_price: z.number().min(0, "Total price must be at least 0"),
  proof_of_payment: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be 5MB or less"
    )
    .refine(
      (file) =>
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
});

export type Booking = z.infer<typeof BookingSchema>;
export default BookingSchema;
