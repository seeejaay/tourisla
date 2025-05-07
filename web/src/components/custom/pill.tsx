import SignUp from "@/components/custom/signup";
import { logout } from "@/lib/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PillProps {
  className?: string;
}

export default function Pill({ className }: PillProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout(); // Ensure logout is completed before refreshing

      await router.push("/login"); // Redirect to login page
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <>
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-2.5 cursor-pointer hover:bg-gray-300 hover:text-gray-900 transition-all duration-300 ease-in-out flex items-center justify-center hover:shadow-lg"
              aria-label="Account"
            >
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-700 text-xl"
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-44 bg-gray-100 flex gap-2 flex-col rounded-md shadow-lg mt-2 lg:mr-0 mr-2 border-1 border-gray-400 ">
            <DropdownMenuLabel className="text-center border-b-1 border-gray-400 font-bold py-2.5">
              My Account
            </DropdownMenuLabel>

            <div className="pb-2 px-1.5 flex flex-col gap-1">
              <DropdownMenuItem className="hover:bg-gray-200 p-0 rounded-sm outline-0 flex items-start justify-start">
                <Button
                  onClick={() => router.push("/login")}
                  variant={"link"}
                  className="text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-300 ease-in-out flex flex-row hover:gap-16 items-center justify-start w-full rounded-none gap-6"
                >
                  Login
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    className="text-gray-700 text-xs"
                  />
                </Button>
              </DropdownMenuItem>

              <DropdownMenuItem className="hover:bg-gray-200 p-0 rounded-sm outline-0 overflow-hidden">
                <Button
                  variant={"link"}
                  className="text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-300 ease-in-out flex flex-row hover:gap-16 items-center justify-start w-full rounded-none gap-6"
                  onClick={() => {
                    setTimeout(() => setDialogOpen(true), 0);
                  }}
                >
                  Sign Up
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    className="text-gray-700 text-xs"
                  />
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-200 p-0 rounded-sm outline-0 overflow-hidden">
                <Button
                  variant={"link"}
                  className="text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-300 ease-in-out flex flex-row hover:gap-16 items-center justify-start w-full rounded-none gap-6"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Always mounted outside the dropdown */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>
              Create an account to get started.
            </DialogDescription>
          </DialogHeader>
          <SignUp />
        </DialogContent>
      </Dialog>
    </>
  );
}
