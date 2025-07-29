"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";
import { useUserManager } from "@/hooks/useUserManager";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useTourOperatorManager } from "@/hooks/useTourOperatorManager";
import selectFields from "@/app/static/selectFields";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Footer from "@/components/custom/footer";
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
import Image from "next/image";

// --- Fix for .extend() error ---
// Only call .extend() on a ZodObject, not after .refine() or .transform().
// If your signupSchema is a ZodEffects, you must move .extend() to the base object.

const baseSignupSchema = z.object({
  first_name: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, "First name must contain only letters and spaces")
    .min(3, "First name is required"),
  last_name: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, "Last name must contain only letters and spaces")
    .min(2, "Last name is required"),
  email: z.string().email(),
  password: z.string(),
  confirm_password: z.string(),
  phone_number: z.string().regex(/^\+63\d{10}$/, {
    message: "Phone number must be in Philippine format: +639XXXXXXXXX",
  }),
  role: z.enum(["Tourist", "Tour Guide", "Tour Operator"]),
  nationality: z.string(),
  terms: z.boolean(),
  status: z.literal("Active"),
  sex: z.enum(["MALE", "FEMALE"]).optional().or(z.literal("")),
  birth_date: z.string().refine((val) => {
    if (!val) return false;
    const date = new Date(val);
    if (isNaN(date.getTime()) || date > new Date()) return false;
    // Check if 18 years old or older
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age >= 18;
  }, "You must be at least 18 years old."),
});

const extendedSignupSchema = baseSignupSchema.extend({
  reason_for_applying: z
    .string()
    .regex(/^[\w\s.,!?]+$/, {
      message:
        "Reason for applying must contain only letters, numbers, and punctuation",
    })
    .min(10, "Reason for applying must be at least 10 characters long")
    .optional()
    .or(z.literal("")),
  // Tour Operator fields
  operator_name: z
    .string()
    .regex(/^[\w\s]+$/, {
      message: "Operator name must contain only letters, numbers, and spaces",
    })
    .or(z.literal(""))
    .optional(),
  business_email: z
    .string()
    .email("Invalid email")
    .or(z.literal(""))
    .optional(),
  mobile_number: z
    .string()
    .regex(/^\+63\d{10}$/, {
      message: "Mobile number must be in Philippine format: +639XXXXXXXXX",
    })
    .or(z.literal(""))
    .optional(),
  office_address: z
    .string()
    .regex(/^[\w\s.,-]+$/, {
      message:
        "Office address must contain only letters, numbers, and punctuation",
    })
    .or(z.literal(""))
    .optional(),
});
const roleOptions = [
  { value: "Tourist", label: "Tourist" },
  { value: "Tour Guide", label: "Tour Guide" },
  { value: "Tour Operator", label: "Tour Operator" },
];

export default function SignUp() {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { registerUser, loading } = useUserManager();
  const { createTourGuideApplicant } = useTourGuideManager();
  const { createApplicant: createTourOperatorApplicant } =
    useTourOperatorManager();

  const [role, setRole] = useState<"Tourist" | "Tour Guide" | "Tour Operator">(
    "Tourist"
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For file input (tour guide profile picture)
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  // Unified form state
  const form = useForm<z.infer<typeof extendedSignupSchema>>({
    resolver: zodResolver(extendedSignupSchema),
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
      birth_date: "",
      sex: "",
      reason_for_applying: "",
      operator_name: "",
      business_email: "",
      mobile_number: "",
      office_address: "",
    },
  });

  const selectField = selectFields();

  // Handle role change
  const handleRoleChange = (value: string) => {
    setRole(value as "Tourist" | "Tour Guide" | "Tour Operator");
    form.setValue("role", value as "Tourist" | "Tour Guide" | "Tour Operator");
    setError(null);
    setSuccess(null);
  };

  // Handle file input for tour guide
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  // Unified submit handler
  const onSubmit = async (data: z.infer<typeof extendedSignupSchema>) => {
    setError(null);
    setSuccess(null);
    console.log("Form data:", data);
    // Validate reCAPTCHA
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    // Validate terms
    if (!data.terms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    // Validate password match
    if (data.password !== data.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    // Role-specific validation
    if (role === "Tour Guide") {
      if (!data.birth_date || !data.sex || !data.reason_for_applying) {
        setError("Please fill in all required tour guide fields.");
        return;
      }
    }

    if (role === "Tour Operator") {
      if (
        !data.operator_name ||
        !data.business_email ||
        !data.mobile_number ||
        !data.office_address
      ) {
        setError("Please fill in all required tour operator fields.");
        return;
      }
    }

    try {
      // Register user first
      const userPayload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        phone_number: data.phone_number,
        status: "Active" as const,
        role,
        nationality: data.nationality,
        terms: data.terms,
        birth_date: data.birth_date,
        sex: data.sex,
      };

      const response = await registerUser(userPayload, captchaToken);
      if (!response || response.error) {
        setError(response?.error || "User registration failed.");
        return;
      }
      const user_id = response.data.user.user_id;

      // Register applicant if needed
      if (role === "Tour Guide") {
        const guidePayload = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          birth_date: data.birth_date!,
          sex: data.sex!,
          reason_for_applying: data.reason_for_applying!,
          mobile_number: data.phone_number,
          profile_picture: profilePicture || undefined,
          application_status: "PENDING" as const,
          user_id,
        };

        const guideRes = await createTourGuideApplicant(guidePayload);
        if (!guideRes) {
          setError("Tour guide application failed.");
          return;
        }
      }

      if (role === "Tour Operator") {
        const operatorPayload = {
          first_name: data.first_name,
          last_name: data.last_name,
          operator_name: data.operator_name!,
          representative_name: `${data.first_name} ${data.last_name}`,
          email: data.business_email!,
          phone_number: data.phone_number,
          mobile_number: data.mobile_number!,
          office_address: data.office_address!,
          application_status: "PENDING" as const,
          user_id,
        };

        const operatorRes = await createTourOperatorApplicant(operatorPayload);
        if (!operatorRes) {
          setError("Tour operator application failed.");
          return;
        }
      }

      // Success: reset form and redirect
      setSuccess(
        "Registration successful! Please check your email to verify your account."
      );

      setTimeout(() => {
        form.reset();
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setError("Registration failed. Please try again. " + error);
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <div className="z-50 fixed top-0 left-0 w-full cursor-pointer bg-white shadow-md px-4 py-2 flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-[#3e979f] hover:text-[#1c5461] font-semibold"
          onClick={() => router.push("/")}
        >
          ← Home
        </Button>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] px-4 py-28 relative">
        {/* Logo and intro */}
        <Image
          src="/images/bg.svg"
          alt="Tourisla Logo"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover object-center opacity-10 pointer-events-none"
          priority
        />
        <div className="w-full max-w-4xl z-10">
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

              {/* Error and Success Messages */}
              {error && (
                <div className="mb-4 text-center min-h-[1rem] w-full flex items-center justify-center">
                  <div className="max-w-md border border-red-600 bg-red-200 rounded-md p-3">
                    <span className="text-red-600 text-sm">{error}</span>
                  </div>
                </div>
              )}
              {success && (
                <div className="mb-4 text-center min-h-[1rem] w-full flex items-center justify-center">
                  <div className="max-w-md border border-green-600 bg-green-200 rounded-md p-3">
                    <span className="text-green-700 text-sm">{success}</span>
                  </div>
                </div>
              )}
              {/* {Object.keys(form.formState.errors).length > 0 && (
              <pre style={{ color: "red" }}>
                {JSON.stringify(form.formState.errors, null, 2)}
              </pre>
            )} */}
              {/* Form Section */}
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    console.log("Form submit event fired");
                    form.handleSubmit(onSubmit)(e);
                  }}
                  className="space-y-6"
                >
                  {/* Role Select */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({}) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="text-[#1c5461] text-sm font-semibold">
                            Register as
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={role}
                              onValueChange={handleRoleChange}
                            >
                              <SelectTrigger className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {roleOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Personal Info Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="text-[#1c5461] text-sm font-semibold">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="First Name"
                              {...field}
                              className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white uppercase"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="text-[#1c5461] text-sm font-semibold">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Last Name"
                              {...field}
                              className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white uppercase"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="text-[#1c5461] text-sm font-semibold">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...field}
                              className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white"
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
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="text-[#1c5461] text-sm font-semibold">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="+639XXXXXXXXX"
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
                              className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Birth Date - always visible */}
                    <FormField
                      control={form.control}
                      name="birth_date"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="text-[#1c5461] text-sm font-semibold">
                            Birth Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                          <FormItem className="w-full flex flex-col">
                            <FormLabel className="text-[#1c5461] text-sm font-semibold">
                              Sex *
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white">
                                  <SelectValue placeholder="Select sex" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MALE">Male</SelectItem>
                                  <SelectItem value="FEMALE">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="text-[#1c5461] text-sm font-semibold">
                            Password
                          </FormLabel>
                          <FormControl className="mb-2">
                            <Input
                              type="password"
                              placeholder="Password"
                              {...field}
                              className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white"
                            />
                          </FormControl>
                          <FormMessage className="min-h-[1.25rem]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="text-[#1c5461] text-sm font-semibold">
                            Confirm Password
                          </FormLabel>
                          <FormControl className="mb-2">
                            <Input
                              type="password"
                              placeholder="Confirm Password"
                              {...field}
                              className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white"
                            />
                          </FormControl>
                          <FormMessage className="min-h-[1.25rem]" />
                        </FormItem>
                      )}
                    />
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
                                <SelectValue placeholder="Select nationality" />
                              </SelectTrigger>
                              <SelectContent>
                                {(
                                  selectField.find(
                                    (f) => f.name === "nationality"
                                  )?.options ?? []
                                ).map(
                                  (option: {
                                    value: string;
                                    label: string;
                                  }) => (
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

                  {/* Tour Guide Specific Fields */}
                  {role === "Tour Guide" && (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#1c5461] mb-1">
                            Profile Picture
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-3 border border-[#e6f7fa] rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3e979f]/10 file:text-[#3e979f] hover:file:bg-[#3e979f]/20"
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="reason_for_applying"
                          render={({ field }) => (
                            <FormItem className="w-full flex flex-col">
                              <FormLabel className="text-[#1c5461] text-sm font-semibold">
                                Reason for Applying *
                              </FormLabel>
                              <FormControl>
                                <textarea
                                  {...field}
                                  placeholder="Reason for applying as a tour guide"
                                  className="w-full px-4 py-3 border border-[#e6f7fa] rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white min-h-[100px] resize-vertical"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {/* Tour Operator Specific Fields */}
                  {role === "Tour Operator" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="operator_name"
                          render={({ field }) => (
                            <FormItem className="w-full flex flex-col">
                              <FormLabel className="text-[#1c5461] text-sm font-semibold">
                                Operator/Business Name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Operator/Business Name"
                                  {...field}
                                  className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="business_email"
                          render={({ field }) => (
                            <FormItem className="w-full flex flex-col">
                              <FormLabel className="text-[#1c5461] text-sm font-semibold">
                                Business Contact Email *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Business Contact Email"
                                  {...field}
                                  className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mobile_number"
                          render={({ field }) => (
                            <FormItem className="w-full flex flex-col">
                              <FormLabel className="text-[#1c5461] text-sm font-semibold">
                                Business Mobile Number *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="Business Mobile Number"
                                  {...field}
                                  className="border border-[#e6f7fa] rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="office_address"
                          render={({ field }) => (
                            <FormItem className="w-full flex flex-col">
                              <FormLabel className="text-[#1c5461] text-sm font-semibold">
                                Office Address *
                              </FormLabel>
                              <FormControl>
                                <textarea
                                  {...field}
                                  placeholder="Office Address"
                                  className="w-full px-4 py-3 border border-[#e6f7fa] rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition bg-white min-h-[100px] resize-vertical"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {/* Terms and Conditions */}
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#3e979f] data-[state=checked]:bg-[#3e979f] data-[state=checked]:border-[#3e979f]"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-[#1c5461]">
                            I agree to the{" "}
                            <a
                              href="/terms"
                              className="text-[#3e979f] hover:underline"
                            >
                              Terms and Conditions
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* reCAPTCHA */}
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                      onChange={setCaptchaToken}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#3e979f] to-[#1c5461] text-white font-semibold rounded-md shadow-md hover:from-[#35858b] hover:to-[#164349] focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:ring-offset-2 transition text-lg py-3"
                    disabled={loading || !captchaToken}
                    onClick={() => {
                      console.log("Submit button clicked");
                    }}
                  >
                    {loading ? "Registering..." : `Register as ${role}`}
                  </Button>
                </form>
              </Form>

              <p className="text-center text-[#51702c] text-base mt-6">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="text-[#3e979f] hover:underline font-semibold"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
