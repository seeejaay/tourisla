import {
  User,
  FileText,
  BookA,
  FileStack,
  Wallet,
  Star,
  QrCode,
} from "lucide-react";

import type { NavItem } from "@/components/custom/sidebar";

const operatorNavigation = (userId: string, status: string): NavItem[] => {
  if (status.toLowerCase() === "approved") {
    return [
      {
        name: "Profile",
        href: `/profile/${userId}`,
        title: "Profile",
        icon: User,
      },
      {
        name: "Earnings",
        href: `/profile/${userId}/earnings`,
        title: "Earnings",
        icon: Wallet,
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
        icon: QrCode,
      },
      {
        name: "Feedback",
        href: `/profile/${userId}/feedback`,
        title: "Feedback",
        icon: Star,
      },
    ];
  } else {
    return [
      {
        name: "Profile",
        href: `/profile/${userId}`,
        title: "Profile",
        icon: User,
      },
      {
        name: "Documents",
        href: `/profile/${userId}/documents/tour-operator`,
        title: "Documents",
        icon: FileText,
      },
    ];
  }
};

export default operatorNavigation;
