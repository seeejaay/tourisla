"use client";

import FormSchema from "@/app/static/userManagerSchema";
import formFields from "@/app/static/signupForm";
import selectFields from "@/app/static/selectFields";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUserManager } from "@/hooks/useUserManager";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { registerUser, loading, error } = useUserManager();

  // Admin detection
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const res = await loggedInUser(router);
      if (res?.data?.user?.role?.toLowerCase() === "admin") {
        setIsAdmin(true);
      }
    }
    fetchUser();
  }, [loggedInUser, router]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "+63",
      role: "Tourist",
      nationality: "Philippines",
      terms: true,
      status: "Active",
      birth_date: "",
      sex: "Male",
    },
  });

  const selectField = selectFields();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!isAdmin && !captchaToken) return;
    await registerUser(data, captchaToken || undefined);
    // Optionally reset form or redirect here
  };

  return (
    <div className="flex items-center justify-center border-none shadow-none  px-2">
      <div className="w-full max-w-xl  p-6 md:p-10 flex flex-col gap-4">
        {error && (
          <div className="mb-4 text-center min-h-[1rem] w-full flex items-center justify-center">
            <div className="w-60 border border-red-600 bg-red-50 rounded-md p-2">
              <span className="text-red-600">{error}</span>
            </div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields
                .filter(({ name }) =>
                  ["first_name", "last_name", "email", "phone_number"].includes(
                    name
                  )
                )
                .map(({ name, label, type, placeholder, className }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof z.infer<typeof FormSchema>}
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col">
                        <FormLabel className="text-[#3e979f] text-sm font-semibold">
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
                              className={`border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-[#f8fcfd] ${
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
                              className={`border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-[#f8fcfd] ${
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
              {formFields
                .filter(({ name }) =>
                  ["password", "confirm_password"].includes(name)
                )
                .map(({ name, label, type, placeholder }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof z.infer<typeof FormSchema>}
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col">
                        <FormLabel className="text-[#3e979f] text-sm font-semibold">
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
                            className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-[#f8fcfd]"
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
                    <FormLabel className="text-[#3e979f] text-sm font-semibold">
                      Nationality
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-[#f8fcfd]"
                        disabled
                      >
                        <option value="">Select your nationality</option>
                        {selectField[0]?.options.map(
                          (option: { value: string; label: string }) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          )
                        )}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Birth Date Field */}
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="text-[#3e979f] text-sm font-semibold">
                      Birth Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-[#f8fcfd]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex flex-col">
                {/* {sex field} */}
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col">
                      <FormLabel className="text-[#3e979f] text-sm font-semibold">
                        Sex
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-[#f8fcfd]"
                        >
                          <option value="">Select your sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Role Select */}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <FormLabel className="text-[#3e979f] text-sm font-semibold">
                    Role
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-[#f8fcfd]"
                    >
                      <option value="">Select your role</option>
                      <option value="Tourist">Tourist</option>
                      <option value="Admin">Admin</option>
                      <option value="Cultural Director">
                        Cultural Director
                      </option>
                      <option value="Tourism Officer">Tourism Officer</option>
                      <option value="Tourism Staff">Tourism Staff</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms Checkbox */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <Checkbox
                    checked={true}
                    onCheckedChange={field.onChange}
                    id="terms"
                    disabled
                  />
                  <FormLabel
                    htmlFor="terms"
                    className="text-sm text-[#3e979f] font-medium cursor-pointer"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="underline text-[#3e979f] hover:text-[#1c5461]"
                    >
                      terms and conditions
                    </a>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Captcha */}
            {!isAdmin && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  onChange={setCaptchaToken}
                />
              </div>
            )}
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#3e979f] to-[#1c5461] text-white font-semibold rounded-lg shadow-md hover:from-[#1c5461] hover:to-[#3e979f] focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:ring-offset-2 transition text-lg"
              disabled={loading || (!isAdmin && !captchaToken)}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
