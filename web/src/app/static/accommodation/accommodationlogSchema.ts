import { z } from "zod";

const accommodationLogSchema = z.object({
  id: z.number().optional(),
  log_date: z.string().datetime({ offset: true }),
  checkout_date: z.string().datetime({ offset: true }),
  day_of_week: z
    .string()
    .min(6, "Day of week is required")
    .regex(
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/,
      "Invalid day of week"
    ),
  rooms_occupied: z.array(z.number()).min(1, "At least one room is required"),
  number_of_guests_check_in: z
    .number()
    .min(1, "Number of guests checking in is required"),
  number_of_guests_overnight: z
    .number()
    .min(1, "Number of guests overnight is required"),
});
export type AccommodationLog = z.infer<typeof accommodationLogSchema>;
export default accommodationLogSchema;
