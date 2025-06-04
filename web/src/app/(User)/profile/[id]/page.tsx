"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserManager } from "@/hooks/useUserManager";

interface UserProfile {
  id: number;
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
  const { loggedInUser, loading: authLoading } = useAuth();
  const {
    updateUser,
    loading: updateLoading,
    error: updateError,
  } = useUserManager();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UserForm | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    async function fetchUser() {
      const res = await loggedInUser(router);
      if (res && res.data && res.data.user) {
        const u = res.data.user;
        // Normalize id
        const normalizedUser = {
          ...u,
          id: u.id ?? u.user_id,
        };
        setUser(normalizedUser);
        setForm({
          ...normalizedUser,
          password: "",
          confirm_password: "",
          status: "Active",
          nationality: normalizedUser.nationality || "",
          terms: true,
          role: "Tourist",
        });
      }
    }
    fetchUser();
  }, [loggedInUser, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form) return;
    try {
      await updateUser(form);
      // Refetch user after update
      const res = await loggedInUser(router);
      if (res && res.data && res.data.user) {
        const u = res.data.user;
        const normalizedUser = {
          ...u,
          id: u.id ?? u.user_id,
        };
        setUser(normalizedUser);
        setForm({
          ...normalizedUser,
          password: "",
          confirm_password: "",
          status: "Active",
          nationality: normalizedUser.nationality || "",
          terms: true,
          role: "Tourist",
        });
      }
      setEditMode(false);
    } catch (err) {
      // Error is handled by useUserManager
      console.error("Error updating user:", err);
    }
  };

  if (authLoading || !user || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
          <p className="text-gray-700 text-center">
            Loading user information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-indigo-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl font-bold text-indigo-600 select-none">
              {user.first_name[0]}
              {user.last_name[0]}
            </span>
          </div>
          <div className="text-2xl font-semibold text-gray-800 mb-1">
            {user.first_name} {user.last_name}
          </div>
          <div className="text-sm text-indigo-500 capitalize mb-2">
            {user.role}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Email
            </label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border border-indigo-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            ) : (
              <div className="text-gray-700 lowercase bg-gray-50 rounded px-3 py-2">
                {user.email}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Phone Number
            </label>
            {editMode ? (
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="border border-indigo-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            ) : (
              <div className="text-gray-700 bg-gray-50 rounded px-3 py-2">
                {user.phone_number}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                First Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="border border-indigo-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
              ) : (
                <div className="text-gray-700 bg-gray-50 rounded px-3 py-2">
                  {user.first_name}
                </div>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Last Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="border border-indigo-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
              ) : (
                <div className="text-gray-700 bg-gray-50 rounded px-3 py-2">
                  {user.last_name}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Nationality
            </label>
            {editMode ? (
              <input
                type="text"
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="border border-indigo-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            ) : (
              <div className="text-gray-700 bg-gray-50 rounded px-3 py-2">
                {user.nationality}
              </div>
            )}
          </div>
        </div>
        <div className="mt-10 flex justify-center gap-4">
          {editMode ? (
            <>
              <button
                className="px-6 py-2 rounded-full bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition"
                onClick={handleSave}
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
                onClick={() => {
                  setEditMode(false);
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
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="px-6 py-2 rounded-full bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
        {updateError && (
          <div className="mt-6 text-center text-red-500">{updateError}</div>
        )}
      </div>
    </div>
  );
}
