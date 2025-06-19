import {
  LayoutDashboard,
  BookText,
  Hotel,
  FerrisWheel,
  TreePalm,
  Megaphone,
} from "lucide-react";
import type { NavItem } from "@/components/custom/sidebar";

const tourismStaffNavigation = (): NavItem[] => {
  return [
    {
      name: "Dashboard",
      href: `/tourism-staff/dashboard`,
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Accommodations",
      href: `/tourism-staff/accommodations`,
      title: "Accommodations",
      icon: Hotel,
    },
    {
      name: "Announcements",
      href: `/tourism-staff/announcements`,
      title: "Announcements",
      icon: Megaphone,
    },
    {
      name: "Attractions",
      href: `/tourism-staff/attractions`,
      title: "Attractions",
      icon: FerrisWheel,
    },

    {
      name: "Rules",
      href: `/tourism-staff/rules`,
      title: "Rules",
      icon: BookText,
    },
    {
      name: "Tourist Spot",
      href: `/tourism-staff/tourist-spot`,
      title: "Tourist Spot",
      icon: TreePalm,
    },
    {
      name: "Tour Guides",
      href: `/tourism-staff/tour-guides`,
      title: "Tour Guides",
      icon: Hotel,
    },
  ];
};

export default tourismStaffNavigation;
