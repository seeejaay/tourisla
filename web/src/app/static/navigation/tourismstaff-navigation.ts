import { ChartArea, UserPen } from "lucide-react";
import type { NavItem } from "@/components/custom/sidebar";

const tourismStaffNavigation = (): NavItem[] => {
  return [
    {
      name: "Accommodation Reports",
      href: `/tourism-staff/accommodation-reports`,
      title: "Accommodation Reports",
      icon: ChartArea,
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
  ];
};

export default tourismStaffNavigation;
