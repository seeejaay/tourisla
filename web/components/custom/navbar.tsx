"use client";

// import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navigation } from "@/static/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathName = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  return (
    <>
      <header className="fixed w-full z-50 bg-[#F1f1f1] flex justify-between p-3">
        <nav className="flex flex-1 gap-[2rem] text-lg border-2 p-2 rounded-md bg-[#408763] items-center lg:justify-between justify-evenly">
          {/* Large Screens */}
          <Link
            href="/"
            className="text-2xl font-bold font-[Poppins] text-[#F1f1f1] w-[40%]"
          >
            tourisla
          </Link>

          <div className="hidden lg:flex gap-4">
            {navigation.map((data, id) => (
              <Link
                key={id}
                href={data.href}
                className={`font-[Poppins] font-medium hover:border-b-[#F1f1f1] hover:border-b-2 hover:text-[#F1f1f1] transition-transform duration-200 ease-in-out ${
                  pathName === data.href
                    ? "text-[#F1f1f1] border-b-[#F1f1f1] border-b-2"
                    : "text-[#ebebeb]"
                }`}
              >
                {data.title}
              </Link>
            ))}
          </div>

          <div className="ml-auto hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 bg-[#F1f1f1] text-[#408763] font-[Poppins] font-medium rounded-sm hover:bg-[#ebebeb] transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#408763] text-[#F1f1f1] font-[Poppins] font-medium rounded-sm hover:bg-[#30654d] transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <button
            className="lg:hidden text-[#F1f1f1]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7-15-1h16"
              />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden bg-[#408763] text-[#F1f1f1] text-lg p-4 z-20 w-full flex flex-col gap-4 fixed top-[4rem] left-0">
            {navigation.map((data, id) => (
              <Link
                key={id}
                href={data.href}
                className={`font-[Poppins] font-medium hover:border-b-[#F1f1f1] hover:border-b-2 hover:text-[#F1f1f1] transition-transform duration-200 ease-in-out ${
                  pathName === data.href
                    ? "text-[#F1f1f1] border-b-[#F1f1f1] border-b-2"
                    : "text-[#ebebeb]"
                }`}
              >
                {data.title}
              </Link>
            ))}
            <Link
              href="/login"
              className="px-4 py-2 bg-[#F1f1f1] text-[#408763] font-[Poppins] font-medium rounded-sm hover:bg-[#ebebeb] transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#408763] text-[#F1f1f1] font-[Poppins] font-medium rounded-sm hover:bg-[#30654d] transition-colors duration-200"
            >
              Sign Up
            </Link>
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
