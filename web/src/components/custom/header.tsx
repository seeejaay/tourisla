"use client";

{
  /*next and react imports*/
}
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

{
  /*shadcn components*/
}

import { Button } from "@/components/ui/button";

{
  /*static import*/
}
import { navigation } from "@/app/static/navigation";

{
  /*font awesome imports*/
}


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

{
  /*Import custom components*/
}
import Pill from "@/components/custom/pill";

export default function Header() {
  const pathName = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  return (
    <>
      <nav className="flex justify-around  items-center p-4 bg-[#f1f1f1] text-gray-800">
        <div className="font-bold">
          <Image
            src="/images/header-3-logo.webp"
            alt="Tourisla Logo"
            width={64}
            height={64}
          />
        </div>
        <div className="space-x-4 text-xl hidden lg:flex">
          {navigation.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`font-[Poppins] font-medium hover:text-gray-900 transition-transform duration-200 ease-in-out ${
                pathName === item.href
                  ? "text-gray-900 border-b-[#F1f1f1] border-b-2"
                  : "text-gray-600"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="flex lg:hidden items-center space-x-4">
            <Button
            className="lg:hidden hover:bg-gray-300 rounded-full w-10 h-10 p-2.5 cursor-pointer hover:text-gray-900 transition-all duration-300 ease-in-out flex items-center justify-center hover:shadow-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
            variant={"outline"}
            >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faTimes : faBars}
              className= {`${isMobileMenuOpen ? "text-gray-900 rotate-0" : "text-gray-700 rotate-[360deg]"} text-xl transition-transform duration-300 ease-in-out`} 
            />
            </Button>
          <Pill />
        </div>
        <Pill className="hidden lg:flex" />
      </nav>

      {/* Mobile Menu */}
      <div
        className={`absolute top-20 left-0 w-full bg-[#f1f1f1] p-4 flex flex-col items-center space-y-4 lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {navigation.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`font-[Poppins] font-medium hover:text-gray-900 transition-transform duration-300 ease-in-out ${
              pathName === item.href
                ? "text-gray-900 border-b-[#F1f1f1] border-b-2"
                : "text-gray-600"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </div>
      
    </>
  );
}
