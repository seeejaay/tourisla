import { logout, currentUser } from "@/lib/api/auth";
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

interface PillProps {
  className?: string;
}

export default function Pill({ className }: PillProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await currentUser();
      setUser(userData);
    };
    fetchUser();
    const handleResize = () => setDropdownOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
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
            className="rounded-full h-10 w-10 p-0 relative hover:bg-gray-100 transition-colors group"
            aria-label="Account menu"
          >
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 rounded-lg shadow-lg border border-gray-200 bg-white p-2"
          align="end"
          sideOffset={8}
        >
          {user ? (
            <>
              <DropdownMenuLabel className="px-4 py-2 flex items-center gap-3">
                <User className="w-6 h-6 text-gray-500" />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />

              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-3"
                onClick={() => router.push("/profile")}
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
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
