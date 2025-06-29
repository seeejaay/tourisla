"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";
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
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

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
    if (!captchaToken) return;
    const response = await registerUser(data, captchaToken);
    if (response) {
      router.replace("/auth/login");
      form.reset();
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] px-4 py-8 relative">
      {/* Logo and intro */}
      <Image
        src="/images/bg.svg"
        alt="Tourisla Logo"
        fill
        className="absolute top-0 left-0 w-full h-full object-cover object-center opacity-10 pointer-events-none"
        priority
      />
      <div className="w-full max-w-2xl z-10">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-[#e6f7fa] bg-white/90 backdrop-blur-lg">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#3e979f]/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#1c5461]/20 rounded-full filter blur-3xl"></div>

          <div className="relative z-10 p-10 md:p-12">
            <div className="mb-8 text-center">
              <div className="mx-auto flex justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#3e979f]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-[#1c5461] mb-1">
                Create your account
              </h1>
              <p className="text-[#51702c] text-sm">
                Sign up to explore and experience the best of TourISLA.
              </p>
            </div>
            {/* Form Section */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Personal Info Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {signUpForm
                    .filter(({ name }) =>
                      [
                        "first_name",
                        "last_name",
                        "email",
                        "phone_number",
                      ].includes(name)
                    )
                    .map(({ name, label, type, placeholder, className }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name as keyof z.infer<typeof signupSchema>}
                        render={({ field }) => (
                          <FormItem className="w-full flex flex-col">
                            <FormLabel className="text-[#1c5461] text-sm font-semibold">
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
                                  className={`border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white ${
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
                                  className={`border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white ${
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
                            <FormLabel className="text-[#1c5461] text-sm font-semibold">
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
                                className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white"
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
                        <FormLabel className="text-[#1c5461] text-sm font-semibold">
                          Nationality
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white">
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
                        className="text-sm text-[#1c5461] font-medium cursor-pointer"
                      >
                        I agree to the{" "}
                        <a
                          href="https://tourisla.space/terms-and-conditions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-[#3e979f] hover:text-[#1c5461]"
                        >
                          terms and conditions
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  onChange={setCaptchaToken}
                />

                {error && (
                  <div className="text-center text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#3e979f] to-[#1c5461] text-white font-semibold rounded-md shadow-md hover:from-[#1c5461] hover:to-[#3e979f] focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:ring-offset-2 transition text-lg"
                  disabled={loading || !captchaToken}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </Form>
            <p className="text-center text-[#1c5461] text-base mt-6">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-[#3e979f] hover:underline font-semibold"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
