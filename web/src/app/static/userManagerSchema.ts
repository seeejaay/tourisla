import { z } from "zod";
import countries from "@/app/static/countries.json";

function sanitizePHPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  const sanitized = phoneNumber.replace(/\D/g, "");
  // Check if the number starts with "0" and remove it
  return sanitized.startsWith("0") ? sanitized.slice(1) : sanitized;
}

{
  /*Code for Validation */
}
const signupSchema = z
  .object({
    first_name: z
      .string()
      .min(3, { message: "First name is required" })
      .toUpperCase()
      .regex(/^[A-Za-z\s]+$/, {
        message: "First name must contain only letters and spaces",
      }),
    last_name: z
      .string()
      .min(3, { message: "Last name is required" })
      .toUpperCase()
      .regex(/^[A-Za-z\s]+$/, {
        message: "Last name must contain only letters and spaces",
      }),
    email: z
      .string()
      .min(4, { message: "Email is required" })
      .toUpperCase()
      .email("Invalid email address")
      .regex(/@/, { message: "Invalid email Address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
    confirm_password: z.string().min(1, "Confirm password is required"),
    phone_number: z
      .string()
      .min(11, "Phone number is required")
      .regex(
        /^\+639\d{9}$/,
        "Phone number must be in Philippine format: +639XXXXXXXXX"
      )
      .transform(sanitizePHPhoneNumber),
    role: z.literal("Tourist"),
    nationality: z
      .string()
      .refine((val: string) => val !== "Select Your Nationality", {
        message: "Please select your nationality",
      })
      .refine(
        (val: string) => countries.some((country) => country.name === val),
        {
          message: "Invalid nationality",
        }
      ),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    status: z.literal("Active"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

export type signupSchema = z.infer<typeof signupSchema>;
export default signupSchema;
