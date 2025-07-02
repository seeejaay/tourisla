"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, LogIn } from "lucide-react";
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
    try {
      if (!(await loginUser(email, password, router))) {
        setError("Invalid email or password");
        return;
      }
      setError("");
    } catch (err) {
      setError("An error occurred during login: " + err);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] px-4 py-8 ">
        <Image
          src="/images/bg.svg"
          alt="Tourisla Logo"
          fill
          className="absolute top-4 left-4 object-cover object-center"
        />
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-[#e6f7fa] bg-white/80 backdrop-blur-lg">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#3e979f]/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#1c5461]/20 rounded-full filter blur-3xl"></div>

            <div className="relative z-10 p-8">
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
                  Welcome back
                </h1>
                <p className="text-[#51702c] text-sm">
                  Sign in to access your dashboard
                </p>
              </div>

              {error && (
                <div className="mb-6 px-4 py-3 bg-[#e6f7fa] border border-[#3e979f]/30 rounded-lg flex items-center gap-2 text-[#d32f2f] text-sm animate-fade-in">
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

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-[#1c5461]"
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
                      className="w-full px-4 py-3 text-sm border border-[#3e979f] rounded-lg focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition-all bg-[#f8fcfd]"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#3e979f]">
                      <Mail className="w-5 h-5 " />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#1c5461]"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 text-sm border border-[#3e979f] rounded-lg focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition-all bg-[#f8fcfd]"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-6 hover:bg-transparent hover:text-[#1c5461] flex items-center pr-3 text-[#3e979f]"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant={"ghost"}
                    aria-label="Forgot password"
                    className="text-xs text-[#3e979f] hover:underline hover:text-[#1c5461] font-medium transition-colors hover:bg-transparent cursor-pointer"
                    onClick={() => router.push("/auth/forgot-password")}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-lg bg-[#3e979f] text-white hover:bg-[#1c5461] transition font-semibold py-3"
                  disabled={loading}
                  variant={"default"}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      Signing in...
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign in
                      <LogIn className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e6f7fa]" />
                  </div>
                </div>

                <div className="text-center text-sm text-[#51702c]">
                  Don&apos;t have an account?{" "}
                  <Button
                    type="button"
                    variant={"ghost"}
                    onClick={() => router.push("/auth/signup")}
                    className="text-[#3e979f] hover:text-[#1c5461] cursor-pointer font-semibold transition-colors"
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
