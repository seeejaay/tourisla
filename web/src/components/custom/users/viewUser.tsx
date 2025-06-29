import { User } from "../users/columns";

export default function ViewUser({ user }: { user: User }) {
  if (!user) return null;
  return (
    <div className="space-y-8 px-8  ">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#3e979f] dark:text-[#7dd3fc] uppercase tracking-widest font-semibold">
          Name
        </span>
        <span className="text-2xl text-[#1c5461] dark:text-zinc-100 font-extrabold">
          {user.first_name} {user.last_name}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#3e979f] dark:text-[#7dd3fc] uppercase tracking-widest font-semibold">
          Email
        </span>
        <span className="text-[#1c5461] dark:text-zinc-100 text-base break-all font-medium">
          {user.email}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#3e979f] dark:text-[#7dd3fc] uppercase tracking-widest font-semibold">
          Role
        </span>
        <span className="text-[#1c5461] dark:text-zinc-100 font-medium">
          {user.role || <span className="italic text-zinc-400">N/A</span>}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#3e979f] dark:text-[#7dd3fc] uppercase tracking-widest font-semibold">
          Status
        </span>
        <span
          className={`inline-block px-4 py-1 rounded-full max-w-[80px]  text-center text-xs font-semibold transition-colors
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
        <span className="text-xs text-[#3e979f] dark:text-[#7dd3fc] uppercase tracking-widest font-semibold">
          Last Login
        </span>
        <span className="text-[#1c5461] dark:text-zinc-100 font-medium">
          {user.last_login_at ? (
            new Date(user.last_login_at).toLocaleString()
          ) : (
            <span className="italic text-zinc-400">Never</span>
          )}
        </span>
      </div>
    </div>
  );
}
