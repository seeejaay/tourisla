"use client";
import Image from "next/image";
import { navigation } from "@/app/static/navigation";
import { usePathname, useRouter } from "next/navigation";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pill from "@/components/custom/pill";
import { NavigationItem } from "./navigationItem";
import { MobileMenu } from "./mobileMenu";
import WeatherWidget from "./weather";

export default function NewHeader() {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <nav className="w-full h-20 bg-white flex items-center justify-between px-4 lg:px-40">
      {/* Logo */}
      <div>
        <Image
          src="/images/TourISLA_Logo.png"
          alt="Logo"
          width={128}
          height={128}
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-8">
        <div className="flex space-x-6">
          {navigation.map((item) => (
            <NavigationItem key={item.tag} item={item} pathName={pathName} />
          ))}
        </div>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden lg:flex items-center gap-2 bg-[#e6f7fa] rounded-full px-3 py-1 shadow-inner">
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

      {/* Mobile Menu */}
      <MobileMenu navigation={navigation} pathName={pathName} />
    </nav>
  );
}
