import { User, QrCode, Home } from "lucide-react";
import type { NavItem } from "@/components/custom/sidebar";

const touristNavigation = (userId: string): NavItem[] => {
  return [
    {
      name: "Home",
      href: `/`,
      title: "Home",
      icon: Home,
    },
    {
      name: "Profile",
      href: `/profile/${userId}`,
      title: "Dashboard",
      icon: User,
    },
    {
      name: "Visitor Registration",
      href: `/profile/${userId}/view-registration`,
      title: "Visitor Registration",
      icon: QrCode,
    },
  ];
};

export default touristNavigation;
