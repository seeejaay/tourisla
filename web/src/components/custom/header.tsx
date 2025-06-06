"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { navigation } from "@/app/static/navigation";
import { Menu, X } from "lucide-react";
import Pill from "@/components/custom/pill";

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed w-full z-50 transition-all duration-300 py-4 bg-white  h-[6rem]">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/images/TourISLA_Logo.png"
              alt="Tourisla Logo"
              width={128}
              height={128}
              className="hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navigation.map((item) => (
                <Button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  variant={"ghost"}
                  className={`font-medium text-base px-3 py-2 rounded-lg hover:bg-gray-100/50 transition-colors duration-200 ${
                    pathName === item.href
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {item.title}
                </Button>
              ))}
            </div>
            <div className="ml-6">
              <Pill />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-4">
            <Pill className="mr-2" />
            <Button
              className="lg:hidden hover:bg-gray-100 rounded-full w-10 h-10 p-2 cursor-pointer transition-all duration-200 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
              variant={"ghost"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={`absolute top-20 right-4 w-64 bg-white rounded-xl shadow-xl p-4 transition-all duration-300 transform ${
              isMobileMenuOpen ? "translate-y-0" : "-translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  variant={"ghost"}
                  className={`w-full justify-start px-4 py-3 rounded-lg text-left ${
                    pathName === item.href
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer to account for fixed header */}
      <div className="h-20 lg:h-24"></div>
    </>
  );
}
