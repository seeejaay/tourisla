"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";

import Header from "@/components/custom/header";
import { Button } from "@/components/ui/button";
import { useUserManager } from "@/hooks/useUserManager";
import { useTourOperatorManager } from "@/hooks/useTourOperatorManager";
import { tourOperatorSchema } from "@/app/static/tour-operator/useTourOperatorManagerSchema";
import { useRouter } from "next/navigation";

type TourOperatorForm = {
  first_name: string;
  last_name: string;
  email: string; // representative's login email
  password: string;
  confirmPassword: string;
  operator_name: string;
  business_email: string; // business contact email
  phone_number: string; // representative's phone
  mobile_number: string; // business mobile
  office_address: string;
  application_status: string;
};

export default function TourOperatorRegister() {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [form, setForm] = useState<TourOperatorForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    operator_name: "",
    business_email: "",
    phone_number: "",
    mobile_number: "",
    office_address: "",
    application_status: "PENDING",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { registerUser, loading: userLoading } = useUserManager();
  const { createApplicant, loading: operatorLoading } =
    useTourOperatorManager();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = tourOperatorSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.errors[0].message); // Show the first error
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    try {
      // 1. Register user (representative)
      const userPayload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
        phone_number: form.phone_number, // representative's phone
        status: "Active" as const,
        role: "Tour Operator" as const,
        nationality: "Philippines",
        terms: true,
      };
      const userRes = await registerUser(userPayload, captchaToken);
      if (!userRes || userRes.error) {
        setError(userRes?.error || "User registration failed.");
        return;
      }
      const user_id = userRes.data.user.user_id;

      // 2. Register tour operator applicant
      const operatorPayload = {
        first_name: form.first_name,
        last_name: form.last_name,
        operator_name: form.operator_name,
        representative_name: `${form.first_name} ${form.last_name}`,
        email: form.business_email, // business contact email
        phone_number: form.phone_number, // representative's phone
        mobile_number: form.mobile_number, // business mobile
        office_address: form.office_address,
        application_status: "PENDING" as const,
        user_id,
      };

      const operatorRes = await createApplicant(operatorPayload);
      if (!operatorRes) {
        setError("Tour operator application failed.");
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
        operator_name: "",
        business_email: "",
        phone_number: "",
        mobile_number: "",
        office_address: "",
        application_status: "PENDING",
      });
      router.push("/auth/login");
    } catch (error) {
      setError("Registration failed. Please try again." + error);
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
              Tour Operator Registration
            </h2>
            <p className="text-center text-gray-500 text-base md:text-lg">
              Please fill out the form below to register as a tour operator.
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
            {/* Representative First Name */}
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
            {/* Representative Last Name */}
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
            {/* Representative Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Representative Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                placeholder="Representative Phone Number"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              />
            </div>
            {/* Representative Email (login) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Representative Email (for login)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Representative Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              />
            </div>
            {/* Password fields */}
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
            {/* Operator Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operator/Business Name
              </label>
              <input
                type="text"
                name="operator_name"
                value={form.operator_name}
                onChange={handleChange}
                required
                placeholder="Operator/Business Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              />
            </div>
            {/* Business Contact Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Contact Email
              </label>
              <input
                type="email"
                name="business_email"
                value={form.business_email}
                onChange={handleChange}
                required
                placeholder="Business Contact Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              />
            </div>
            {/* Business Mobile Number */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Mobile Number
              </label>
              <input
                type="tel"
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                required
                placeholder="Business Mobile Number"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              />
            </div>
            {/* Office Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office Address
              </label>
              <textarea
                name="office_address"
                value={form.office_address}
                onChange={handleChange}
                required
                placeholder="Office Address"
                className="w-full px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-gray-50"
              />
            </div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={setCaptchaToken}
            />
            {/* Submit button */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-md shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition text-lg py-3"
                disabled={userLoading || operatorLoading || !captchaToken}
              >
                {userLoading || operatorLoading
                  ? "Registering..."
                  : "Register as Tour Operator"}
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
