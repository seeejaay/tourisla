import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, LogIn, LogOut, Settings } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

interface PillProps {
  className?: string;
}

export default function Pill({ className }: PillProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Use useAuth to get the logged-in user (with id)
  const { loggedInUser, logout } = useAuth();
  const [user, setUser] = useState<{
    id: string | number;
    name: string;
    email: string;
    nationality: string;
  } | null>(null);
  const handleLowercase = (str: string) => {
    return str.toLowerCase();
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await loggedInUser(router);
      if (res && res.data && res.data.user) {
        const u = res.data.user;
        setUser({
          id: u.id ?? u.user_id,
          name: handleLowercase(u.first_name + " " + u.last_name),
          email: u.email,
          nationality: u.nationality,
        });
      } else {
        setUser(null);
      }
    };
    fetchUser();
    const handleResize = () => setDropdownOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loggedInUser, router]);

  const handleLogout = async () => {
    try {
      await logout(router);
      setUser(null);
      await router.push("/auth/login");
    } catch (err) {
      router.push("/auth/login");
      console.error("Logout failed", err);
    }
  };

  return (
    <div className={className}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-full h-10 w-10 p-0 relative hover:bg-[#3e979f]/10 transition-colors group"
            aria-label="Account menu"
          >
            <User className="w-6 h-6 text-[#1c5461] group-hover:text-[#3e979f] transition" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-60 rounded-lg shadow-lg border border-gray-200 bg-white p-2"
          align="end"
          sideOffset={8}
        >
          {user ? (
            <>
              <DropdownMenuLabel className="px-4 py-2 flex items-center gap-3">
                <div>
                  <div className="font-medium capitalize">{user.name}</div>
                  <div className="text-xs text-gray-500 lowercase">
                    {user.email}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />

              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-3"
                onClick={() => router.push(`/profile/${user.id}`)}
              >
                <User className="w-4 h-4 text-gray-500" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-3"
                onClick={() => router.push("/settings")}
              >
                <Settings className="w-4 h-4 text-gray-500" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-gray-100" />

              <DropdownMenuItem
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer flex items-center gap-3"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel className="px-4 py-2 text-gray-900">
                Guest User
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />

              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-3"
                onClick={() => router.push("/auth/login")}
              >
                <LogIn className="w-4 h-4 text-gray-500" />
                Login
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-3"
                onClick={() => router.push("/auth/signup")}
              >
                <User className="w-4 h-4 text-gray-500" />
                Sign Up
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-3"
                onClick={() => router.push("/auth/signup/tour-guide")}
              >
                <User className="w-4 h-4 text-gray-500" />
                Sign Up as Tour Guide
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-3"
                onClick={() => router.push("/auth/signup/tour-operator")}
              >
                <User className="w-4 h-4 text-gray-500" />
                Sign Up as Tour Operator
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
