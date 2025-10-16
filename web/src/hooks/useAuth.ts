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
      return false;
    }
    try {
      const resLogin = await login({ email, password });
      // console.log("🔍 Full API response:", resLogin);

      if (resLogin.error) {
        setError(resLogin.error);
        setLoading(false);
        return false;
      }

      // Since your API returns user as a string (the role), use it directly
      const userRole = resLogin.user; // This is the role string like "Admin"
      // console.log("👤 User role:", userRole);
      // console.log("🌐 Router available:", !!router);

      if (router) {
        // console.log("🚀 Starting role-based routing...");

        if (userRole === "Admin") {
          // console.log("➡️ Routing to admin dashboard");
          router.replace("/admin/dashboard");
        } else if (userRole === "Tourism Staff") {
          // console.log("➡️ Routing to tourism staff dashboard");
          router.replace("/tourism-staff/dashboard");
        } else if (userRole === "Tourism Officer") {
          // console.log("➡️ Routing to tourism officer dashboard");
          router.replace("/tourism-officer/dashboard");
        } else if (userRole === "Cultural Director") {
          // console.log("➡️ Routing to cultural director dashboard");
          router.replace("/cultural-director/dashboard");
        } else if (userRole === "Tour Guide" || userRole === "Tour Operator") {
          // console.log("➡️ Routing to profile page");

          try {
            // Get the current user data to extract the user ID
            const currentUserData = await loggedInUser(router, false);

            if (currentUserData && currentUserData.data?.user?.id) {
              const userId = currentUserData.data.user.id;
              // console.log("👤 Got user ID for profile:", userId);
              router.replace(`/profile/${userId}`);
            } else {
              // console.log(
              //   "⚠️ Could not get user ID, routing to general profile page"
              // );
              router.replace("/profile");
            }
          } catch (error) {
            console.error("❌ Error getting user ID:", error);
            console.log("⚠️ Fallback: routing to general profile page");
            router.replace("/profile");
          }
        } else {
          console.log("➡️ Routing to home (unknown role):", userRole);
          router.replace("/");
        }

        // Check if routing worked
        setTimeout(() => {
          console.log("🔍 Current URL after routing:", window.location.href);
        }, 1000);
      }

      setLoading(false);
      return true;
    } catch (err) {
      setError("An error occurred during login: " + err);
      setLoading(false);
      return false;
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
    async (router: AppRouterInstance, restrict: boolean = true) => {
      setLoading(true);
      setError("");
      try {
        // console.log("Fetching current user...");
        const resCurrentUser = await currentUser();

        // Check the actual structure of your currentUser API response
        // console.log("Current user API response:", resCurrentUser);

        if (!resCurrentUser || !resCurrentUser.data?.user) {
          // console.log("No user found or user role is missing.");
          if (restrict) {
            router.replace("/auth/login");
          }
          return null;
        }

        // console.log("✅ Current user found:", resCurrentUser.data.user);
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
