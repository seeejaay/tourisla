"use client";

// import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navigation } from "@/app/static/navigation";
// import { useState } from "react";

const Navbar = () => {
  const pathName = usePathname();
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  return (
    <>
      <header className="fixed w-full z-50 bg-[#F1f1f1] flex  justify-between p-3 ">
        <nav className="flex flex-1  gap-[2rem] text-lg border-2 p-2 rounded-md  bg-[#408763] items-center">
          {/* Large Screens */}
          <Link
            href="/"
            className="text-2xl font-bold font-[Poppins] text-[#F1f1f1] w-[40%]"
          >
            tourisla
          </Link>

          {navigation.map((data, id) => (
            <Link
              key={id}
              href={data.href}
              className={`font-[Poppins] font-medium  hover:border-b-[#F1f1f1] hover:border-b-2 hover:text-[#F1f1f1] transition-transform duration-200 ease-in-out  ${
                pathName === data.href
                  ? "text-[#F1f1f1] border-b-[#F1f1f1] border-b-2"
                  : "text-[#ebebeb]"
              }`}
            >
              {data.title}
            </Link>
          ))}

          <div className="ml-auto flex items-center gap-4">
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
        </nav>
      </header>

      {/* <header className="fixed w-full z-50 bg-[#F1f1f1] flex items-center justify-between p-2 shadow-md">
        <div className="flex justify-end item-center md:justify-between md:items-center w-full">
          {/* Large Screens
          <nav className="hidden md:flex flex-1 justify-center gap-[2rem] text-lg p-2 ">
            <Link href="/" className="text-2xl font-bold">
              TourISLA
            </Link>
            <div className="flex gap-4 justify-center flex-1">
              {navigation.map((data, id) => (
                <Link
                  key={id}
                  href={data.href}
                  className={`font-sans font-medium hover:-translate-y-[.15rem] hover:border-b-[#408763] hover:border-b-2 hover:text-[#408763] transition-transform duration-200 ease-in-out  ${
                    pathName === data.href
                      ? "text-[#408763] border-b-[#408763] border-b-2 translate-x-0 -translate-y-[.15rem]"
                      : "text-gray-950"
                  }`}
                >
                  {data.title}
                </Link>
              ))}
            </div>
          </nav> */}

      {/* Hamburger Icon
          <button
            className="md:hidden text-glaucous"
            onClick={toggleMobileMenu}
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
          </button> */}
      {/* </div>
      </header> */}

      {/* Mobile menu with smooth transition
      <nav
        className={`${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } md:hidden bg-slate-900  text-glaucous  text-lg p-4 z-20 w-full flex flex-col gap-4 fixed top-0 left-0 mt-[4rem]  transition-all duration-300 ease-in-out h-[17rem]`}
      >
        {navigation.map((data, id) => (
          <Link
            key={id}
            href={data.href}
            className={`${
              pathName === data.href
                ? "border-b-4 border-saffron text-saffron w-auto px-4 py-2 rounded-md shadow-md"
                : "px-4 py-2 rounded-md"
            } hover:text-saffron hover:bg-slate-900 `}
          >
            {data.tag}
          </Link>
        ))}
      </nav> */}
    </>
  );
};

export default Navbar;
