import { useState, useCallback } from "react";
import {
  login,
  forgotPassword,
  resetPassword,
  currentUser,
} from "@/lib/api/auth";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "@/app/static/authSchema";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function useAuth() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (
    email: string,
    password: string,
    router: AppRouterInstance
  ) => {
    setError("");
    setLoading(true);
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return null;
    }
    try {
      const resLogin = await login({ email, password });
      if (resLogin?.error) {
        setError(resLogin.error); // <-- Show backend error
        setLoading(false);
        return null;
      }
      if (router) {
        if (resLogin.user.role === "Admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }
      setLoading(false);
      return resLogin;
    } catch (err) {
      setError("An error occurred during login: " + err);
      setLoading(false);
      return null;
    }
  };

  const handleForgotPassword = async (email: string) => {
    setError("");
    setLoading(true);
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return null;
    }
    try {
      const resForgotPassword = await forgotPassword(email);
      return resForgotPassword;
    } catch (err) {
      setError("An error occurred during password reset: " + err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (
    token: string,
    password: string,
    confirm: string
  ) => {
    setError("");
    setLoading(true);
    const result = resetPasswordSchema.safeParse({ password, confirm });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return null;
    }
    try {
      const resResetPassword = await resetPassword(token, password);
      return resResetPassword;
    } catch (err) {
      setError("An error occurred during password reset: " + err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loggedInUser = useCallback(
    async (router: AppRouterInstance) => {
      setLoading(true);
      setError("");
      try {
        const resCurrentUser = await currentUser();

        if (!resCurrentUser || !resCurrentUser.data.user.role) {
          router.replace("/");
          return;
        }

        return resCurrentUser;
      } catch (error) {
        setError("An error occurred while fetching the current user." + error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    loginUser,
    error,
    setError,
    loading,
    setLoading,
    handleForgotPassword,
    handleResetPassword,
    loggedInUser,
  };
}
