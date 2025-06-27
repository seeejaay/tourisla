import {
  LayoutDashboard,
  BookText,
  User2,
  TreePalm,
  Megaphone,
  Sailboat,
  ChartArea,
  UserPen,
  ClipboardList
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
    {
      name: "Manual Check In",
      href: `/tourism-staff/manual-check-in`,
      title: "Manual Check In",
      icon: UserPen,
    },
    {
      name: "Walk In Registration",
      href: `/tourism-staff/walk-in-registration`,
      title: "Walk In Registration",
      icon: UserPen,
    },
    {
      name: "Island Entry Walk-In Registration",
      href: `/tourism-staff/islandEntry-walk-in`,
      title: "Island Entry Walk-In Registration",
      icon: UserPen,
    },
    {
      name: "Island Entry Check-in",
      href: `/tourism-staff/islandEntry-lookup`,
      title: "Island Entry Check-in",
      icon: UserPen,
    },
    {
      name: "Tourist Spot Feedback",
      href: `/tourism-staff/spot-feedback`,
      title: "Tourist Spot Feedback",
      icon: ClipboardList,
    },
  ];
};

export default tourismStaffNavigation;
