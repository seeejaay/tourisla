import { z } from "zod";
import countries from "@/app/static/countries.json";

const visitorSchema = z
  .object({
    id: z.number().optional(),
    name: z
      .string()
      .min(5, "Name is required")
      .max(100, "Name must be less than 100 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
    age: z
      .number()
      .min(1, "Age must be a positive number")
      .max(120, "Age must be less than 120"),
    sex: z.enum(["Male", "Female", "Other"]),
    is_foreign: z.boolean().optional(),
    municipality: z
      .string()
      .max(100, "Municipality must be less than 100 characters"),
    province: z.string().max(100, "Region must be less than 100 characters"),
    country: z
      .enum(countries.map((country) => country.name) as [string, ...string[]])
      .refine((value) => countries.some((country) => country.name === value), {
        message: "Country must be a valid country from the list",
      }),
  })
  .superRefine((data, ctx) => {
    if (
      !data.is_foreign &&
      (!data.municipality || data.municipality.length < 2)
    ) {
      ctx.addIssue({
        path: ["municipality"],
        code: z.ZodIssueCode.custom,
        message: "Municipality is required for non-foreign visitors",
      });
    }
  });

export type Visitor = z.infer<typeof visitorSchema>;
export default visitorSchema;
