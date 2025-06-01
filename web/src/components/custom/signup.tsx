"use client";

import FormSchema from "@/app/static/userManagerSchema";
import formFields from "@/app/static/signupForm";
import selectFields from "@/app/static/selectFields";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useUserManager } from "@/hooks/useUserManager";

export default function SignUp() {
  const { registerUser, loading, error } = useUserManager();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      role: "Tourist",
      nationality: "",
      terms: false,
      status: "Active",
    },
  });

  const selectField = selectFields(); // Call the function to get the options

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await registerUser(data);
      window.location.href = "/login";
    } catch (e) {
      console.error("Error during registration:", e);
      // Error is handled by the hook
    }
  };

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-3 w-full">
              {formFields
                .filter(
                  ({ name }) => name === "first_name" || name === "last_name"
                )
                .map(({ name, label, type, placeholder }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof z.infer<typeof FormSchema>}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="block text-gray-700 text-sm font-medium ">
                          {label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type={type}
                            placeholder={placeholder}
                            {...field}
                            value={
                              typeof field.value === "boolean"
                                ? ""
                                : field.value
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
            </div>

            {formFields
              .filter(
                ({ name }) =>
                  name !== "first_name" &&
                  name !== "last_name" &&
                  name !== "role"
              )
              .map(({ name, label, type, placeholder }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof z.infer<typeof FormSchema>}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="block text-gray-700 text-sm font-medium ">
                        {label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={type}
                          placeholder={placeholder}
                          {...field}
                          value={
                            typeof field.value === "boolean" ? "" : field.value
                          }
                          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}

            {/* Always show the role select */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="block text-gray-700 text-sm font-medium mb-2">
                    Select Role
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        {...field}
                        className="appearance-none border border-gray-300 rounded-md px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="" disabled>
                          Select Role
                        </option>
                        <option value="Tourist">Tourist</option>
                        <option value="Tour Guide">Tour Guide</option>
                        <option value="Tour Operator">Tour Operator</option>
                        <option value="Admin">Admin</option>
                        <option value="Cultural Director">
                          Cultural Director
                        </option>
                        <option value="Tourism Officer">Tourism Officer</option>
                        <option value="Tourism Staff">Tourism Staff</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="block text-gray-700 text-sm font-medium mb-2">
                    Select Nationality
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        {...field}
                        className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="" disabled>
                          Select Nationality
                        </option>
                        {selectField[0]?.options.map(
                          (option: { value: string; label: string }) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          )
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="terms"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="terms"
                    className="text-sm font-medium text-gray-700"
                  >
                    I agree to the terms and conditions
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
