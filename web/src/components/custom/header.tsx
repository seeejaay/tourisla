"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { navigation } from "@/app/static/navigation";
import { Menu, X } from "lucide-react";
import Pill from "@/components/custom/pill";

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
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
              {navigation.map((item) =>
                item.dropdown ? (
                  <div key={item.tag} className="relative group">
                    <Link
                      href={item.href}
                      className="font-semibold text-blue-600"
                    >
                      {item.title}
                    </Link>
                    <div className="absolute left-0 mt-2 w-40 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.tag}
                          href={sub.href}
                          className="block px-4 py-2 hover:bg-indigo-50"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.tag}
                    href={item.href}
                    className="font-semibold text-blue-600"
                  >
                    {item.title}
                  </Link>
                )
              )}
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
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 opacity-100 pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="absolute top-20 right-4 w-64 bg-white rounded-xl shadow-xl p-4 transition-all duration-300 transform translate-y-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-2">
                {navigation.map((item) =>
                  item.dropdown ? (
                    <div key={item.tag} className="flex flex-col">
                      <Button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.tag ? null : item.tag
                          )
                        }
                        variant={"ghost"}
                        className={`w-full justify-start px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100`}
                      >
                        {item.title}
                      </Button>
                      {openDropdown === item.tag && (
                        <div className="pl-4 flex flex-col">
                          {item.dropdown.map((sub) => (
                            <Button
                              key={sub.tag}
                              onClick={() => {
                                router.push(sub.href);
                                setIsMobileMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                              variant={"ghost"}
                              className="w-full justify-start px-4 py-2 rounded-lg text-left text-gray-600 hover:bg-indigo-50"
                            >
                              {sub.title}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      key={item.tag}
                      onClick={() => {
                        router.push(item.href);
                        setIsMobileMenuOpen(false);
                        setOpenDropdown(null);
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
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer to account for fixed header */}
      <div className="h-20 lg:h-24"></div>
    </>
  );
}
