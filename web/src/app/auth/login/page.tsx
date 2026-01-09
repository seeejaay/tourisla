"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, LogIn, ArrowLeft } from "lucide-react";
import Footer from "@/components/custom/footer";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { loginUser, error, setError, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const isValid = await loginUser(email, password, router);

      if (isValid === true) {
        console.log("✅ Login successful!");
        setError("");
      } else {
        console.log("❌ Login failed");
      }
    } catch (err) {
      console.error("💥 Unexpected login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* Header Navigation */}
      <div className="z-50 fixed top-0 left-0 w-full bg-white shadow-md px-4 py-2 flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-[#3e979f] hover:text-[#1c5461] font-semibold flex items-center gap-2 transition-colors"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] px-4 py-8 pt-20">
        {/* Background Image */}
        <div className="fixed inset-0 pointer-events-none">
          <Image
            src="/images/bg.svg"
            alt="Background"
            fill
            className="object-cover object-center opacity-100"
            priority
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-[#e6f7fa] bg-white/90 backdrop-blur-lg">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#3e979f]/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#1c5461]/20 rounded-full filter blur-3xl"></div>

            <div className="relative z-10 p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#3e979f]/10 rounded-full flex items-center justify-center">
                    <LogIn className="w-8 h-8 text-[#3e979f]" />
                  </div>
                </div>
                <h1 className="text-3xl font-extrabold text-[#1c5461] mb-2">
                  Welcome back
                </h1>
                <p className="text-[#51702c] text-sm">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-fade-in">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-[#1c5461] block"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 pl-12 text-sm border border-[#3e979f]/30 rounded-lg focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition-all bg-[#f8fcfd] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#3e979f]">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#1c5461] block"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 text-sm border border-[#3e979f]/30 rounded-lg focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition-all bg-[#f8fcfd] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#3e979f] hover:text-[#1c5461] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-sm text-[#3e979f] hover:text-[#1c5461] font-medium transition-colors hover:bg-transparent p-0 h-auto disabled:opacity-50"
                    onClick={() => router.push("/auth/forgot-password")}
                    disabled={loading}
                  >
                    Forgot password?
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full rounded-lg bg-[#3e979f] text-white hover:bg-[#1c5461] transition-all duration-200 font-semibold py-3 h-12 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !email || !password}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign in
                      <LogIn className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center text-sm text-[#51702c]">
                  Don&apos;t have an account?{" "}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/auth/signup")}
                    className="text-[#3e979f] hover:text-[#1c5461] font-semibold transition-colors hover:bg-transparent p-0 h-auto underline-offset-4 hover:underline disabled:opacity-50"
                    disabled={loading}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
