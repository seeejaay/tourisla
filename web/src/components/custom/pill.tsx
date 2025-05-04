import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

import Link from "next/link";

interface PillProps {
  className?: string;
}

export default function Pill({ className }: PillProps) {
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
            <DropdownMenuSeparator />
            <div className="px-2 pb-2 flex flex-col gap-2">
              <DropdownMenuItem className="hover:bg-gray-200 rounded-sm px-2 outline-0">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900  rounded-sm  hover:font-bold transition-all duration-300 ease-in-out flex flex-row gap-[38px] hover:gap-16 items-center p-2"
                >
                  Login
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    className="text-gray-700 text-xs"
                  />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-200 rounded-sm px-2 outline-0">
                <Link
                  href="/signup"
                  className="text-gray-700 hover:text-gray-900 hover:font-bold transition-all duration-300 ease-in-out flex flex-row gap-[20px] hover:gap-12 items-center p-2"
                >
                  Sign Up
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    className="text-gray-700 text-xs"
                  />
                </Link>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
