import { z } from "zod";

const applyTourOperatorSchema = z.object({
  id: z.string().optional(),
  tourguide_id: z.string().optional(),
  touroperator_id: z.string().optional(),
  reason_for_applying: z
    .string()
    .min(1, "Reason for applying is required")
    .regex(/^[\w\s.,:]+$/, "Invalid characters in reason for applying"),
});

export type ApplyTourOperatorSchema = z.infer<typeof applyTourOperatorSchema>;
export default applyTourOperatorSchema;
