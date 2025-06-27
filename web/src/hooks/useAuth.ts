import { useState, useCallback } from "react";
import {
  login,
  logout as logoutApi,
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
          router.replace("/admin/dashboard");
        } else if (resLogin.user.role === "Tourism Staff") {
          router.replace("/tourism-staff/dashboard");
        } else if (resLogin.user.role === "Tourism Officer") {
          router.replace("/tourism-officer/dashboard");
        } else if (resLogin.user.role === "Cultural Director") {
          router.replace("/cultural-director/dashboard");
        } else {
          router.replace("/");
        }
      }
      setLoading(false);
      console.log("Login successful:", resLogin);
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
        console.log("Fetch user");
        return resCurrentUser;
      } catch (error) {
        setError("An error occurred while fetching the current user." + error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const logout = async (router: AppRouterInstance) => {
    setLoading(true);
    setError("");
    try {
      const resLogout = await logoutApi();
      if (resLogout?.error) {
        setError(resLogout.error);
        setLoading(false);
        return;
      }
      setError("");
      setLoading(false);

      router.push("/auth/login");
    } catch (err) {
      setError("An error occurred during logout: " + err);
    } finally {
      setLoading(false);
    }
  };
  return {
    loginUser,
    error,
    setError,
    loading,
    setLoading,
    handleForgotPassword,
    handleResetPassword,
    loggedInUser,
    logout,
  };
}
