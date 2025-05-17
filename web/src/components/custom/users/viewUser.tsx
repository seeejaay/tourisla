import React from "react";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  status: string;
  last_login_at: string | null;
  // Add more fields as needed
}

export default function ViewUser({ user }: { user: User }) {
  if (!user) return null;
  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            Name:
          </span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {user.first_name} {user.last_name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            Email:
          </span>
          <span className="text-zinc-900 dark:text-zinc-100">{user.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            Role:
          </span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {user.role || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            Status:
          </span>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold
              ${
                user.status.toLowerCase() === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
          >
            {user.status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            Last Login:
          </span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {user.last_login_at || "Never"}
          </span>
        </div>
      </div>
    </>
  );
}
