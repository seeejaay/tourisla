import { useState, useCallback } from "react";
import {
  login,
  logout as logoutApi,
  forgotPassword,
  resetPassword,
  currentUser,
  verifyUser,
  resendVerification as resendVerificationController,
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

      if (resLogin.error) {
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
        } else if (
          resLogin.user.role === "Tour Guide" ||
          resLogin.user.role === "Tour Operator"
        ) {
          router.replace(`/profile/${resLogin.user.id}`);
        } else {
          router.replace("/");
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
    async (
      router: AppRouterInstance,
      restrict: boolean = true // default: restrict access
    ) => {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching current user...");
        const resCurrentUser = await currentUser();
        console.log("No user found or user role is missing.");
        if (!resCurrentUser || !resCurrentUser.data.user.role) {
          if (restrict) {
            router.replace("/auth/login");
          }
          return null;
        }
        return resCurrentUser;
      } catch (error) {
        setError("An error occurred while fetching the current user." + error);
        console.error("Error fetching current user:", error);
        if (restrict) {
          router.replace("/auth/login");
        }
        return null;
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

  const verifyUserAccount = useCallback(
    async (token: string) => {
      setLoading(true);
      setError("");
      try {
        const resVerifyUser = await verifyUser(token);
        if (resVerifyUser.error) {
          setError(resVerifyUser.error);
          return null;
        }
        return resVerifyUser;
      } catch (err) {
        setError("An error occurred during account verification: " + err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const resendVerification = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const resResendVerification = await resendVerificationController();
      if (resResendVerification.error) {
        setError(resResendVerification.error);
        return null;
      }
      return resResendVerification;
    } catch (err) {
      setError("An error occurred while resending verification: " + err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);
  return {
    loginUser,
    error,
    setError,
    verifyUserAccount,
    resendVerification,
    loading,
    setLoading,
    handleForgotPassword,
    handleResetPassword,
    loggedInUser,
    logout,
  };
}
