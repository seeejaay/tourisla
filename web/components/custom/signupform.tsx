"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUser } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import countries from "@/app/static/countries.json";

// Zod schema
const formSchema = z
  .object({
    first_name: z
      .string()
      .min(1, { message: "First name is required" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "First name must contain only letters and spaces",
      }),
    last_name: z
      .string()
      .min(1, { message: "Last name is required" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "Last name must contain only letters and spaces",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Invalid email address"),
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
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input type="text" placeholder="tourist" disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="traveller_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Traveller Type</FormLabel>
              <FormControl>
                <select {...field} className="border rounded px-3 py-2 w-full">
                  <option value="" disabled>
                    Select your traveller type
                  </option>
                  <option value="solo_traveller">Solo Traveller</option>
                  <option value="family_traveller">Family Traveller</option>
                  <option value="group_traveller">Group Traveller</option>
                  <option value="business_traveller">Business Traveller</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <select {...field} className="border rounded px-3 py-2 w-full">
                  <option value="" disabled>
                    Select your nationality
                  </option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
