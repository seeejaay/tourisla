"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

import { Eye, EyeOff, Mail, LogIn } from "lucide-react"; // Import icons for showing/hiding password

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- Add this line
  const router = useRouter();
  const { loginUser, error, setError, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!(await loginUser(email, password, router))) {
        console.log("Login failed");
        setError("Invalid email or password");
        return;
      }
      console.log("Login successful");
      setError("");
    } catch (err) {
      setError("An error occurred during login: " + err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-white/50 backdrop-blur-lg">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-200/30 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200/30 rounded-full filter blur-3xl"></div>

          <div className="relative z-10 p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto flex justify-center mb-4">
                <svg
                  className="w-10 h-10 text-indigo-600"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome back
              </h1>
              <p className="text-gray-500 text-sm">
                Sign in to access your dashboard
              </p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-fade-in">
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
                  className="text-sm font-medium text-gray-700"
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
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <Mail className="w-5 h-5 " />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
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
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 hover:bg-transparent hover:text-gray-800 flex items-center pr-3 text-gray-400"
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
                  className="text-xs text-indigo-600 hover:underline hover:text-indigo-800 font-medium transition-colors hover:bg-transparent cursor-pointer"
                  onClick={() => router.push("/auth/forgot-password")}
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => router.push("/auth/signup")}
                  className="text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium transition-colors"
                >
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
