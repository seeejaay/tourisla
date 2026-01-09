"use client";
import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/app/static/navigation";
import { usePathname, useRouter } from "next/navigation";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pill from "@/components/custom/pill";
import { NavigationItem } from "./navigationItem";
import { MobileMenu } from "./mobileMenu";
import WeatherWidget from "./weather";

export default function Header() {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <nav className="w-full h-20 bg-white flex items-center justify-between px-4 lg:px-40">
      {/* Logo */}
      <Link
        href="/"
        className="hover:opacity-80 transition-opacity cursor-pointer"
      >
        <Image
          src="/images/TourISLA_Logo.png"
          alt="TourISLA Logo - Navigate to Homepage"
          width={128}
          height={128}
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-8">
        <div className="flex space-x-6">
          {navigation.map((item) => (
            <NavigationItem key={item.tag} item={item} pathName={pathName} />
          ))}
        </div>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden lg:flex items-center space-x-4">
        <div className="hidden lg:flex items-center p-0 bg-gray-100 rounded-full  shadow-inner">
          <Button
            variant="ghost"
            className="rounded-full h-10 w-10 p-0 relative hover:bg-[#3e979f]/10 transition-colors group"
            aria-label="Announcment"
            onClick={() => router.push("/announcements")}
          >
            <Megaphone className="w-10 h-10 text-[#48a894] group-hover:text-[#3e979f] transition" />
          </Button>
        </div>
        <div className="hidden lg:flex items-center p-0 bg-gray-100 rounded-full  shadow-inner">
          <WeatherWidget />
        </div>
        <div className="hidden lg:flex items-center p-0 bg-gray-100 rounded-full  shadow-inner">
          <Pill />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu navigation={navigation} pathName={pathName} />
    </nav>
  );
}
