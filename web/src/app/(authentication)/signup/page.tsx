"use client";

import { useUserManager } from "@/hooks/useUserManager";
import signUpForm from "@/app/static/signupForm";
import selectFields from "@/app/static/selectFields";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import signupSchema from "@/app/static/userManagerSchema";

export default function SignUp() {
  const router = useRouter();
  const { registerUser, error, loading } = useUserManager();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "+63",
      role: "Tourist",
      nationality: "",
      terms: false,
      status: "Active",
    },
  });

  const selectField = selectFields();

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    const response = await registerUser(data);
    if (response) {
      router.replace("/login");
      form.reset();
    }
  };

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
        {error && (
          <div className="mb-4 text-center min-h-[1rem] w-full flex items-center justify-center">
            <div className="w-40 border border-red-600 bg-red-200 rounded-md p-1">
              <span className="text-red-600">{error}</span>
            </div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {signUpForm
                .filter(({ name }) =>
                  ["first_name", "last_name", "email", "phone_number"].includes(
                    name
                  )
                )
                .map(({ name, label, type, placeholder, className }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof z.infer<typeof signupSchema>}
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col">
                        <FormLabel className="text-gray-700 text-sm font-semibold">
                          {label}
                        </FormLabel>
                        <FormControl>
                          {name === "phone_number" ? (
                            <Input
                              type={type}
                              placeholder={placeholder}
                              {...field}
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : "+63"
                              }
                              onChange={(e) => {
                                let val = e.target.value;
                                if (!val.startsWith("+63")) {
                                  val = "+63" + val.replace(/^\+?63?/, "");
                                }
                                field.onChange(val);
                              }}
                              className={`border border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50 ${
                                className || ""
                              }`}
                            />
                          ) : (
                            <Input
                              type={type}
                              placeholder={placeholder}
                              {...field}
                              value={
                                typeof field.value === "boolean"
                                  ? ""
                                  : field.value
                              }
                              className={`border border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50 ${
                                className || ""
                              }`}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {signUpForm
                .filter(({ name }) =>
                  ["password", "confirm_password"].includes(name)
                )
                .map(({ name, label, type, placeholder }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof z.infer<typeof signupSchema>}
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col">
                        <FormLabel className="text-gray-700 text-sm font-semibold">
                          {label}
                        </FormLabel>
                        <FormControl className="mb-2">
                          <Input
                            type={type}
                            placeholder={placeholder}
                            {...field}
                            value={
                              typeof field.value === "boolean"
                                ? ""
                                : field.value
                            }
                            className="border border-gray-200 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
                          />
                        </FormControl>
                        <FormMessage className="min-h-[1.25rem]" />
                      </FormItem>
                    )}
                  />
                ))}
            </div>
            {/* Nationality Select */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="text-gray-700 text-sm font-semibold">
                      Nationality
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border border-gray-200 rounded-md px-3 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white">
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
            {/* Terms Checkbox */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="terms"
                  />
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
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-md shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition text-lg"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
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
