"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { navigation } from "@/app/static/navigation";
import { Menu, X, Megaphone } from "lucide-react";
import Pill from "@/components/custom/pill";
import WeatherWidget from "@/components/custom/weather";
import { useAuth } from "@/hooks/useAuth"; // adjust path if needed

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const scrolled = false; // You can implement scroll detection if needed
  const { loggedInUser } = useAuth();

  useEffect(() => {
    async function checkAuth() {
      const res = await loggedInUser(router, false);

      // Example: Only allow admins
      if (res.data.user.role.toLowerCase() === "admin") {
        router.replace("/admin/dashboard"); // or your desired page
      } else if (res.data.user.role.toLowerCase() === "tourism officer") {
        router.replace("/tourism-officer/dashboard"); // or your desired page
      } else if (
        res.data.user.role.toLowerCase() === "tour guide" ||
        res.data.user.role.toLowerCase() === "tour operator"
      ) {
        router.replace(`/profile/${res.data.user.id}`); // or your desired page
      } else {
        router.replace("/"); // redirect to home if not admin or tourism officer
      }
    }
    checkAuth();
  }, [loggedInUser, router]);

  return (
    <>
      <nav
        className={`fixed w-full z-30 transition-all duration-300 bg-white ${
          scrolled
            ? "bg-gradient-to-b from-[#e6f7fa]/80 to-transparent backdrop-blur-md shadow-md py-2"
            : "bg-gradient-to-b from-[#e6f7fa]/80 to-transparent py-4"
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
              className="hover:scale-110 transition-transform duration-300 cursor-pointer "
              onClick={() => router.push("/")}
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navigation.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.tag}
                    className="relative flex items-center group"
                  >
                    {/* Parent Link */}
                    {/* <Link
                      href={item.href || "#"}
                      className={`font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1
              ${
                pathName === item.href
                  ? "bg-[#3e979f]/10 text-[#3e979f]"
                  : "text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] focus:bg-[#e6f7fa] focus:text-[#3e979f]"
              }
            `}
                    >
                      {item.title}
                    </Link> */}
                    {/* Dropdown Trigger */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`font-semibold px-3 py-2 rounded-lg transition-colors ${
                            pathName === item.href
                              ? "bg-[#3e979f]/10 text-[#3e979f]"
                              : "text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] focus:bg-[#e6f7fa] focus:text-[#3e979f]"
                          }`}
                          tabIndex={0}
                          aria-label={`Show ${item.title} menu`}
                          type="button"
                        >
                          <span className="font-semibold"> {item.title}</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48 mt-2 bg-white rounded-xl shadow-lg border border-[#e6f7fa]"
                        align="start"
                      >
                        {item.dropdown.map((sub) => (
                          <DropdownMenuItem asChild key={sub.tag}>
                            <Link
                              href={sub.href}
                              className="block px-4 py-2 rounded-lg transition-colors text-[#51702c] font-medium hover:bg-[#e6f7fa] hover:text-[#3e979f] focus:bg-[#e6f7fa] focus:text-[#3e979f]"
                            >
                              {sub.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <Link
                    key={item.tag}
                    href={item.href}
                    className={`font-semibold px-3 py-2 rounded-lg transition-colors ${
                      pathName === item.href
                        ? "bg-[#3e979f]/10 text-[#3e979f]"
                        : "text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] focus:bg-[#e6f7fa] focus:text-[#3e979f]"
                    }`}
                  >
                    {item.title}
                  </Link>
                )
              )}
            </div>
            <div className="flex items-center gap-2 bg-[#e6f7fa] rounded-full px-3 py-1 shadow-inner">
              <Pill />
              <Button
                variant="ghost"
                className="rounded-full h-10 w-10 p-0 relative hover:bg-[#3e979f]/10 transition-colors group"
                onClick={() => router.push("/announcements")}
                aria-label="Announcements"
              >
                <Megaphone className="w-6 h-6 text-[#1c5461] group-hover:text-[#3e979f] transition" />
              </Button>
              <WeatherWidget />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2.5">
            <Pill />
            <Button
              variant="ghost"
              className="rounded-full h-10 w-10 p-0 relative hover:bg-[#3e979f]/10 transition-colors group"
              onClick={() => router.push("/announcements")}
              aria-label="Announcements"
            >
              <Megaphone className="w-4 h-4 text-[#1c5461] group-hover:text-[#3e979f] transition" />
            </Button>
            <WeatherWidget />
            <Button
              className="lg:hidden hover:bg-[#e6f7fa] rounded-full w-10 h-10 p-2 cursor-pointer transition-all duration-200 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
              variant={"ghost"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#1c5461]" />
              ) : (
                <Menu className="w-5 h-5 text-[#1c5461]" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 min-h-screen transition-opacity duration-300 opacity-100 pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="absolute top-20 right-4 w-72 bg-white rounded-2xl shadow-2xl p-6 transition-all duration-300 transform translate-y-0 border border-[#e6f7fa]"
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
                        className="w-full justify-start px-4 py-3 rounded-lg text-left text-[#1c5461] hover:bg-[#e6f7fa] font-semibold"
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
                              className="w-full justify-start px-4 py-2 rounded-lg text-left text-[#51702c] hover:bg-[#e6f7fa] font-medium"
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
                          ? "bg-[#3e979f]/10 text-[#3e979f] font-semibold"
                          : "text-[#1c5461] hover:bg-[#e6f7fa]"
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
    </>
  );
}
