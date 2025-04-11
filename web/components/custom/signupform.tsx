"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUser } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import countries from "@/app/static/countries.json";
import { formFields, selectFields } from "@/app/static/sigupFormFields";

// Zod schema essentialy the validation
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
    role: z.literal("tourist"),
    traveller_type: z.enum(
      [
        "solo_traveller",
        "family_traveller",
        "group_traveller",
        "business_traveller",
      ],
      {
        required_error: "Traveller type is required",
      }
    ),
    nationality: z
      .string()
      .refine((val) => countries.some((country) => country.name === val), {
        message: "Invalid nationality",
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

export default function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      role: "tourist",
      traveller_type: "solo_traveller",
      nationality: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form submitted:", data);
    addUser(data)
      .then((response) => {
        if (response) {
          console.log("User successfully added:", response);
        } else {
          console.error("Error adding user: No data received from the API.");
        }
      })
      .catch((error) => {
        console.error("Error during API call:", error);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-10 pt-24 bg-[#f1f1f1] min-h-screen"
      >
        {formFields.map(({ name, label, type, placeholder, disabled }) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof z.infer<typeof formSchema>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {selectFields.map(({ name, label, options }) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof z.infer<typeof formSchema>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="" disabled>
                      Select your {label.toLowerCase()}
                    </option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
