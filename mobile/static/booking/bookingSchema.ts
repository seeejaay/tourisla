import { z } from "zod";

const MobileProofOfPaymentSchema = z.object({
  uri: z.string().url().or(z.string()), // uri could be file:// or http(s)://
  name: z.string(),
  mimeType: z.string().optional(),
  size: z.number().optional(),
});

const BookingSchemaMobile = z.object({
  id: z.number().optional(),
  scheduled_date: z.string(),
  number_of_guests: z
    .number()
    .int()
    .min(1, "Number of guests must be at least 1"),
  total_price: z.number().min(0, "Total price must be at least 0"),
  proof_of_payment: MobileProofOfPaymentSchema.optional().nullable(),
  notes: z
    .string()
    .regex(
      /^[\w\s.,!?'"-]*$/,
      "Notes can only contain letters, numbers, spaces, and basic punctuation"
    )
    .optional(),
});

export type BookingMobile = z.infer<typeof BookingSchemaMobile>;
export default BookingSchemaMobile;
