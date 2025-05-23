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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    avatar?: string;
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
      await router.push("/login");
    } catch (err) {
      router.push("/login");
      console.error("Logout failed", err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
            {user?.avatar ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-300 group-hover:border-gray-400 transition-colors">
                {user ? getInitials(user.name) : <User className="w-4 h-4" />}
              </div>
            )}
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
                <div className="flex-shrink-0">
                  {user.avatar ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-300">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
                onClick={() => router.push("/login")}
              >
                <LogIn className="w-4 h-4 text-gray-500" />
                Login
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-3"
                onClick={() => router.push("/signup")}
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
