import { z } from "zod";
import countries from "@/static/countries.json";
const visitorSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(5, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  age: z
    .number()
    .min(0, "Age must be a positive number")
    .max(120, "Age must be less than 120"),
  sex: z.enum(["Male", "Female", "Other"]),
  is_foreign: z.boolean().optional(),
  municipality: z
    .string()
    .min(5, "Municipality is required")
    .max(100, "Municipality must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Municipality must contain only letters and spaces"
    ),
  province: z
    .string()
    .min(5, "Province is required")
    .max(100, "Province must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Province must contain only letters and spaces"),

  country: z
    .enum(countries.map((country) => country.name) as [string, ...string[]])
    .refine((value) => countries.some((country) => country.name === value), {
      message: "Country must be a valid country from the list",
    }),
});

export type Visitor = z.infer<typeof visitorSchema>;
export default visitorSchema;
