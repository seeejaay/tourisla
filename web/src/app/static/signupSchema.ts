import { z } from "zod";
import countries from "@/app/static/countries.json";

{
  /*Code for Validation */
}
const formSchema = z
  .object({
    first_name: z
      .string()
      .min(3, { message: "First name is required" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "First name must contain only letters and spaces",
      }),
    last_name: z
      .string()
      .min(3, { message: "Last name is required" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "Last name must contain only letters and spaces",
      }),
    email: z
      .string()
      .min(4, { message: "Email is required" })
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
    confirm_password: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    phone_number: z
      .string()
      .min(11, { message: "Phone number is required" })
      .regex(
        /^\+?[0-9]{1,3}[-. ]?\(?[0-9]{1,4}?\)?[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,9}$/,
        {
          message: "Invalid phone number format",
        }
      ),
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

export type FormSchema = z.infer<typeof formSchema>;
export default formSchema;
