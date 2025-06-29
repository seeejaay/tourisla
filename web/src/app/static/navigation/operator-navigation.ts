import { User, FileText, BookA, FileStack, Wallet, Star } from "lucide-react";

import type { NavItem } from "@/components/custom/sidebar";

const operatorNavigation = (userId: string): NavItem[] => {
  return [
    {
      name: "Profile",
      href: `/profile/${userId}`,
      title: "Profile",
      icon: User,
    },
    {
      name: "Bookings",
      href: `/profile/${userId}/bookings`,
      title: "Bookings",
      icon: FileText,
    },
    {
      name: "Documents",
      href: `/profile/${userId}/documents/tour-operator`,
      title: "Documents",
      icon: FileText,
    },
    {
      name: "Tour Guide Application",
      href: `/profile/${userId}/tour-guide-application`,
      title: "Tour Guide Application",
      icon: BookA,
    },
    {
      name: "Tour Packages",
      href: `/profile/${userId}/tour-packages`,
      title: "Tour Packages",
      icon: FileStack,
    },
    {
      name: "Upload QR Code",
      href: `/profile/${userId}/qr-code`,
      title: "Upload QR Code",
      icon: Wallet,
    },
    {
      name: "Feedback",
      href: `/profile/${userId}/feedback`,
      title: "Feedback",
      icon: Star,
    },
  ];
};

export default operatorNavigation;
