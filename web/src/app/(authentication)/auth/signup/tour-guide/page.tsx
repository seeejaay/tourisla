"use client";
import { useState } from "react";
import Header from "@/components/custom/header";
import { Button } from "@/components/ui/button";

export default function TourGuideRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    license: "",
    birth_date: "",
    sex: "",
    profile_picture: "",
    reason_for_applying: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({
        ...form,
        profile_picture: URL.createObjectURL(e.target.files[0]),
      });
      // For real API, you'd want to upload the file or store the File object
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // TODO: Add API call here
    setSuccess(
      "Registration successful! Please check your email to verify your account."
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 px-4 py-8">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-white/50 backdrop-blur-lg">
            <div className="relative z-10 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Tour Guide Registration
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                Please fill out the form below to register as a tour guide.
              </p>
              {error && (
                <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                  {success}
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name, Email, Phone, License */}
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Mobile Number"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  name="license"
                  value={form.license}
                  onChange={handleChange}
                  required
                  placeholder="Tour Guide License Number"
                  className="w-full px-4 py-2 border rounded-lg"
                />

                {/* Additional fields */}
                <input
                  type="date"
                  name="birth_date"
                  value={form.birth_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Sex</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <textarea
                  name="reason_for_applying"
                  value={form.reason_for_applying}
                  onChange={handleChange}
                  required
                  placeholder="Reason for applying"
                  className="w-full px-4 py-2 border rounded-lg"
                />

                {/* Password fields */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-lg"
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
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border rounded-lg"
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
                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg shadow-md"
                >
                  Register as Tour Guide
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </>
  );
}
