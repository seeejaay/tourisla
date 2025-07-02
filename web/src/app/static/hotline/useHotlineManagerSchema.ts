import { z } from "zod";

const hotlineSchema = z.object({
  id: z.number().optional(),
  municipality: z.enum(["SANTA_FE", "BANTAYAN", "MADRIDEJOS"]),
  type: z.enum(["MEDICAL", "POLICE", "BFP", "NDRRMO", "COAST_GUARD"]),
  contact_number: z
    .string()
    .min(7, { message: "Contact number is required." })
    .max(15, { message: "Contact number must be less than 15 characters." })
    .regex(/^\+?[0-9]+$/, {
      message: "Contact number can only contain numbers.",
    }),
  address: z
    .string()
    .max(200, { message: "Address must be less than 200 characters." })
    .regex(/^[a-zA-Z0-9\s,.-]+$/, {
      message:
        "Address can only contain letters, numbers, spaces, commas, periods, and hyphens.",
    })
    .optional(),
});

export type Hotline = z.infer<typeof hotlineSchema>;
export type HotlineSchema = z.infer<typeof hotlineSchema>;
export { hotlineSchema };
