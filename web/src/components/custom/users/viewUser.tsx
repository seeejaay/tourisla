import { User } from "../users/columns";

export default function ViewUser({ user }: { user: User }) {
  if (!user) return null;
  return (
    <div className="space-y-8 px-8 py-6 bg-white dark:bg-zinc-900 rounded-lg max-w-lg mx-auto">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">
          Name
        </span>
        <span className="text-2xl text-zinc-900 dark:text-zinc-100 font-bold">
          {user.first_name} {user.last_name}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">
          Email
        </span>
        <span className="text-zinc-900 dark:text-zinc-100 text-base break-all">
          {user.email}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">
          Role
        </span>
        <span className="text-zinc-900 dark:text-zinc-100">
          {user.role || <span className="italic text-zinc-400">N/A</span>}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">
          Status
        </span>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-colors
            ${
              user.status.toLowerCase() === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          aria-label={`User status: ${user.status}`}
        >
          {user.status}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">
          Last Login
        </span>
        <span className="text-zinc-900 dark:text-zinc-100">
          {user.last_login_at || (
            <span className="italic text-zinc-400">Never</span>
          )}
        </span>
      </div>
    </div>
  );
}
