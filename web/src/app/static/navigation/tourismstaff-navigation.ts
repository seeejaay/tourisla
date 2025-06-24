import {
  LayoutDashboard,
  BookText,
  User2,
  TreePalm,
  Megaphone,
  Sailboat,
  ChartArea,
  UserPen,
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
      name: "Announcements",
      href: `/tourism-staff/announcements`,
      title: "Announcements",
      icon: Megaphone,
    },
    {
      name: "Accommodation Reports",
      href: `/tourism-staff/accommodation-reports`,
      title: "Accommodation Reports",
      icon: ChartArea,
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
      icon: User2,
    },
    {
      name: "Tour Operators",
      href: `/tourism-staff/tour-operators`,
      title: "Tour Operators",
      icon: Sailboat,
    },
    {
      name: "Visitor Reports",
      href: `/tourism-staff/visitor-reports`,
      title: "Visitor Reports",
      icon: UserPen,
    },
  ];
};

export default tourismStaffNavigation;
