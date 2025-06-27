import { User, FileText, BookA, Package, QrCode } from "lucide-react";

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
      name: "Tour Operator Dashboard",
      href: `/profile/${userId}/dashboard`,
      title: "Tour Operator Dashboard",
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
      icon: Package,
    },
    {
      name: "Upload QR Code",
      href: `/profile/${userId}/qr-code`,
      title: "Upload QR Code",
      icon: QrCode,
    },
    {
      name: "Feedback",
      href: `/profile/${userId}/feedback`,
      title: "Feedback",
      icon: QrCode,
    },
  ];
};

export default operatorNavigation;
