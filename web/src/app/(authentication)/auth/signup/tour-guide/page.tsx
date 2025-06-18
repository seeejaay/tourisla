"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";

import Header from "@/components/custom/header";
import { Button } from "@/components/ui/button";
import { useUserManager } from "@/hooks/useUserManager";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useRouter } from "next/navigation";
import { tourGuideSchema } from "@/app/static/tour-guide/useTourGuideManagerSchema";

type TourGuideForm = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  mobile_number: string; // Keeping this for compatibility, but not used in the form
  birth_date: string;
  sex: string;
  profile_picture: File | string;
  reason_for_applying: string;
  application_status: string;
};

export default function TourGuideRegister() {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [form, setForm] = useState<TourGuideForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    mobile_number: "", // Keeping this for compatibility, but not used in the form
    birth_date: "",
    sex: "",
    profile_picture: "",
    reason_for_applying: "",
    application_status: "PENDING",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { registerUser, loading: userLoading } = useUserManager();
  const { createTourGuideApplicant, loading: guideLoading } =
    useTourGuideManager();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({
        ...prev,
        profile_picture: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Zod validation
    const result = tourGuideSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message); // Show the first error
      return;
    }

    // 2. Password match check
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // 3. reCAPTCHA check
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    try {
      // 1. Register user
      const userPayload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
        phone_number: form.mobile_number,
        status: "Active" as const,
        role: "Tour Guide" as const,
        nationality: "Philippines",
        terms: true,
      };
      const userRes = await registerUser(userPayload, captchaToken);
      if (!userRes || userRes.error) {
        setError(userRes?.error || "User registration failed.");
        return;
      }
      const user_id = userRes.data.user.user_id;
      // 2. Register tour guide applicant
      const guidePayload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        birth_date: form.birth_date,
        sex: form.sex as "MALE" | "FEMALE",
        reason_for_applying: form.reason_for_applying,
        mobile_number: form.mobile_number,
        profile_picture:
          form.profile_picture instanceof File
            ? form.profile_picture
            : undefined,
        application_status: "PENDING" as const,
        user_id, // Assuming userRes contains the created user's ID
      };

      const guideRes = await createTourGuideApplicant(guidePayload);
      if (!guideRes) {
        setError("Tour guide application failed.");
        return;
      }

      setSuccess(
        "Registration successful! Please check your email to verify your account."
      );
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        mobile_number: "",
        birth_date: "",
        sex: "",
        profile_picture: "",
        reason_for_applying: "",
        application_status: "PENDING",
      });
      router.push("/auth/login");
    } catch (error) {
      setError("Regular registration failed. Please try again." + error);
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-start py-2 justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 border border-blue-100 flex flex-col ">
          <div className=" flex flex-col items-center ">
            <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700  tracking-tight">
              Tour Guide Registration
            </h2>
            <p className="text-center text-gray-500 text-base md:text-lg">
              Please fill out the form below to register as a tour guide.
            </p>
          </div>
          {error && (
            <div className="mb-4 text-center min-h-[1rem] w-full flex items-center justify-center">
              <div className="w-40 border border-red-600 bg-red-200 rounded-md p-1">
                <span className="text-red-600">{error}</span>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-4 text-center min-h-[1rem] w-full flex items-center justify-center">
              <div className="w-40 border border-green-600 bg-green-200 rounded-md p-1">
                <span className="text-green-700">{success}</span>
              </div>
            </div>
          )}
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                placeholder="First Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50 uppercase"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                placeholder="Last Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50 uppercase"
              />
            </div>
            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              />
            </div>
            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sex
              </label>
              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              >
                <option value="">Select Your Sex</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                required
                placeholder="+639XXXXXXXXX"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50 uppercase"
              />
            </div>
            {/* Password fields (side by side on desktop) */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {/* Profile Picture (spans both columns) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            {/* Reason for Applying (spans both columns) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Applying
              </label>
              <textarea
                name="reason_for_applying"
                value={form.reason_for_applying}
                onChange={handleChange}
                required
                placeholder="Reason for applying as a tour guide"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              />
            </div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={setCaptchaToken}
            />
            {/* Submit button (spans both columns) */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-md shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition text-lg py-3"
                disabled={userLoading || guideLoading || !captchaToken}
              >
                {userLoading || guideLoading
                  ? "Registering..."
                  : "Register as Tour Guide"}
              </Button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-base ">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
