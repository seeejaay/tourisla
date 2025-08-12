import {
  User,
  QrCode,
  Home,
  History,
  MapPin,
  ClipboardList,
} from "lucide-react";
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
      name: "Island Entry QR",
      href: `/profile/${userId}/island-entry-qr`,
      title: "Island Entry QR",
      icon: QrCode,
    },
    {
      name: "Visitor Registration",
      href: `/profile/${userId}/view-registration`,
      title: "Visitor Registration",
      icon: QrCode,
    },

    {
      name: "Attraction Visit History",
      href: `/profile/${userId}/attraction-history`,
      title: "Attraction Visit History",
      icon: MapPin,
    },
    {
      name: "Booking History",
      href: `/profile/${userId}/booking-history`,
      title: "Booking History",
      icon: History,
    },
    {
      name: "Incident Report History",
      href: `/profile/${userId}/incident-history`,
      title: "Incident Report History",
      icon: ClipboardList,
    },
  ];
};

export default touristNavigation;
