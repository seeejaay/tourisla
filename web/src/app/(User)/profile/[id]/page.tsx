"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserManager } from "@/hooks/useUserManager";
import countries from "@/app/static/countries.json";
import { useCalendar } from "@/hooks/useCalendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  nationality?: string;
  status?: string;
}

interface UserForm extends UserProfile {
  password: string;
  confirm_password: string;
  terms: boolean;
  role: "Tourist";
  status: "Active";
  nationality: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const {
    loggedInUser,
    loading: authLoading,
    resendVerification,
    loading: resendLoading,
    error: resendError,
  } = useAuth();
  const { authorizeCalendar } = useCalendar();
  const {
    updateUser,
    loading: updateLoading,
    error: updateError,
  } = useUserManager();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UserForm | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    async function fetchUser() {
      const res = await loggedInUser(router);
      console.log("Fetched user:", res);
      if (res && res.data && res.data.user) {
        const u = res.data.user;
        const normalizedUser = {
          ...u,
          user_id: u.user_id ?? u.id,
        };
        setUser(normalizedUser);
        setForm({
          user_id: normalizedUser.user_id,
          first_name: normalizedUser.first_name,
          last_name: normalizedUser.last_name,
          email: normalizedUser.email,
          phone_number: normalizedUser.phone_number,
          role: normalizedUser.role,
          nationality: normalizedUser.nationality || "",
          status: normalizedUser.status || "Active",
          password: "",
          confirm_password: "",
          terms: true,
        });
      }
    }
    fetchUser();
  }, [loggedInUser, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.user_id) {
      setShowAlert(true);
      return;
    }
    try {
      await updateUser(form);
      // Refetch user after update
      const res = await loggedInUser(router);
      if (res && res.data && res.data.user) {
        const u = res.data.user;
        const normalizedUser = {
          ...u,
          user_id: u.user_id ?? u.id,
        };
        setUser(normalizedUser);
        setForm({
          user_id: normalizedUser.user_id,
          first_name: normalizedUser.first_name,
          last_name: normalizedUser.last_name,
          email: normalizedUser.email,
          phone_number: normalizedUser.phone_number,
          role: normalizedUser.role,
          nationality: normalizedUser.nationality || "",
          status: normalizedUser.status || "Active",
          password: "",
          confirm_password: "",
          terms: true,
        });
      }
      setEditMode(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error("Error updating user:", err);
      setShowAlert(true);
    }
  };

  const handleResendVerification = async () => {
    setResendSuccess(false);
    try {
      const res = await resendVerification();
      if (res && res.message) {
        setResendSuccess(true);
      }
    } catch (err) {
      console.error("Error resending verification:", err);
      setResendSuccess(false);
    }
  };

  if (authLoading || !user || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#e6f7fa]">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#1c5461]">
            Profile
          </h1>
          <p className="text-[#51702c] text-center">
            Loading user information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] overflow-hidden">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-[#e6f7fa]">
          {/* Resend verification alert */}
          {user.status !== "Active" && (
            <div className="mb-6">
              <Alert>
                <AlertTitle>Email Not Verified</AlertTitle>
                <AlertDescription>
                  Your account is not verified. Please check your email for a
                  verification link.
                  <br />
                  <button
                    className="mt-2 px-4 py-2 bg-[#3e979f] text-white rounded hover:bg-[#1c5461] transition"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                  >
                    {resendLoading ? "Sending..." : "Resend Verification Email"}
                  </button>
                  {resendError && (
                    <div className="text-red-600 mt-2">{resendError}</div>
                  )}
                  {resendSuccess && (
                    <div className="text-green-600 mt-2">
                      Verification email sent!
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#e6f7fa] flex items-center justify-center mb-4 shadow-lg border-2 border-[#3e979f]">
              <span className="text-4xl font-bold text-[#3e979f] select-none">
                {user.first_name[0]}
                {user.last_name[0]}
              </span>
            </div>
            <div className="text-2xl font-semibold text-[#1c5461] mb-1">
              {user.first_name} {user.last_name}
            </div>
            <div className="text-sm text-[#51702c] capitalize mb-2">
              {user.role}
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-[#51702c] mb-1">
                  First Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className="border border-[#3e979f] rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] bg-[#f8fcfd] transition"
                  />
                ) : (
                  <div className="text-[#1c5461] bg-[#f8fcfd] rounded px-3 py-2">
                    {user.first_name}
                  </div>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-[#51702c] mb-1">
                  Last Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className="border border-[#3e979f] rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] bg-[#f8fcfd] transition"
                  />
                ) : (
                  <div className="text-[#1c5461] bg-[#f8fcfd] rounded px-3 py-2">
                    {user.last_name}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#51702c] mb-1">
                Email
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-[#3e979f] rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] bg-[#f8fcfd] transition"
                />
              ) : (
                <div className="text-[#1c5461] lowercase bg-[#f8fcfd] rounded px-3 py-2">
                  {user.email}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#51702c] mb-1">
                Phone Number
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="border border-[#3e979f] rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] bg-[#f8fcfd] transition"
                />
              ) : (
                <div className="text-[#1c5461] bg-[#f8fcfd] rounded px-3 py-2">
                  {user.phone_number}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#51702c] mb-1">
                Nationality
              </label>
              {editMode ? (
                <select
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className="border border-[#3e979f] rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#3e979f] bg-[#f8fcfd] transition"
                >
                  <option value="">Select nationality</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[#1c5461] bg-[#f8fcfd] rounded px-3 py-2">
                  {user.nationality}
                </div>
              )}
            </div>
          </div>
          <div className="mt-10 flex justify-center gap-4">
            {editMode ? (
              <>
                <button
                  className="px-6 py-2 rounded-lg bg-[#3e979f] text-white font-semibold shadow hover:bg-[#1c5461] transition"
                  onClick={handleSave}
                  disabled={updateLoading}
                  type="button"
                >
                  {updateLoading ? "Saving..." : "Save"}
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-[#e6f7fa] text-[#1c5461] font-semibold shadow hover:bg-[#f0f0f0] transition"
                  onClick={() => {
                    setEditMode(false);
                    setShowAlert(false);
                    setForm({
                      ...user,
                      password: "",
                      confirm_password: "",
                      status: "Active",
                      nationality: user.nationality || "",
                      terms: true,
                      role: "Tourist",
                    });
                  }}
                  disabled={updateLoading}
                  type="button"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-6 py-2 rounded-lg bg-[#3e979f] text-white font-semibold shadow hover:bg-[#1c5461] transition"
                  onClick={() => setEditMode(true)}
                  type="button"
                >
                  Edit Profile
                </button>
                {user.role && user.role.toLowerCase() === "tour guide" && (
                  <a
                    className="px-6 py-2 rounded-lg bg-[#51702c] text-white font-semibold shadow hover:bg-[#3e979f] transition"
                    onClick={async () => {
                      try {
                        const response = await authorizeCalendar();
                        if (response && response.authUrl) {
                          window.open(
                            response.authUrl,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        } else {
                          alert("Failed to get Google authorization URL.");
                        }
                      } catch (err) {
                        alert("Failed to authorize Google Calendar." + err);
                      }
                    }}
                    href="#"
                    rel="noopener noreferrer"
                  >
                    Authorize Google Calendar
                  </a>
                )}
              </>
            )}
          </div>

          {/* shadcn alert for errors and success */}
          {showAlert && (
            <Alert
              variant={updateError ? "destructive" : "default"}
              className="mt-6"
            >
              <AlertTitle>
                {updateError
                  ? "Profile Update Failed"
                  : "Profile Updated Successfully"}
              </AlertTitle>
              <AlertDescription>
                {updateError
                  ? updateError.toString().includes("409")
                    ? "A user with this email  already exists."
                    : updateError
                  : "Your profile information has been updated."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
}
