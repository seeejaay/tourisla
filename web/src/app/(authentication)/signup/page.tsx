"use client";

import FormSchema from "@/app/static/signupSchema";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createUser } from "@/lib/api";

export default function SignUp() {
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

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    createUser(data)
      .then((response) => {
        if (response) {
          window.location.href = "/login";
        }
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        alert("Error creating user. Please try again.");
      });
  };

  const selectField = selectFields();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-blue-100 flex flex-col gap-4">
        <div className="mb-4 flex flex-col items-center gap-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-1 tracking-tight">
            Create your account
          </h2>
          <p className="text-center text-gray-500 text-base md:text-lg">
            Sign up to explore and experience the best of Tourisla.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields
                .filter(
                  ({ name }) =>
                    name === "first_name" ||
                    name === "last_name" ||
                    name === "email" ||
                    name === "phone_number"
                )
                .map(({ name, label, type, placeholder }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof z.infer<typeof FormSchema>}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-700 text-sm font-semibold">
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
                            className="border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields
                .filter(
                  ({ name }) =>
                    name === "password" || name === "confirm_password"
                )
                .map(({ name, label, type, placeholder }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof z.infer<typeof FormSchema>}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-700 text-sm font-semibold">
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
                            className="border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-semibold">
                      Nationality
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border border-gray-200 rounded-lg px-3 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white">
                          <SelectValue placeholder="Select your nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectField[0]?.options.map(
                            (option: { value: string; label: string }) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="terms"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="terms"
                    className="text-sm text-gray-700 font-medium cursor-pointer"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="underline text-blue-600 hover:text-blue-800"
                    >
                      terms and conditions
                    </a>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold  rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition text-lg"
            >
              Sign Up
            </Button>
          </form>
        </Form>
        <p className="text-center text-gray-500 text-base mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
