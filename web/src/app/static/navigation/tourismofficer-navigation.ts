import { LayoutDashboard, BookText, TreePalm, Megaphone } from "lucide-react";
import type { NavItem } from "@/components/custom/sidebar";

const tourismOfficerNavigation = (): NavItem[] => {
  return [
    {
      name: "Dashboard",
      href: `/tourism-officer/dashboard`,
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Announcements",
      href: `/tourism-officer/announcements`,
      title: "Announcements",
      icon: Megaphone,
    },

    {
      name: "Rules",
      href: `/tourism-officer/rules`,
      title: "Rules",
      icon: BookText,
    },
    {
      name: "Tourism Staff",
      href: `/tourism-officer/tourism-staff`,
      title: "Tourism Staff",
      icon: BookText,
    },
    {
      name: "Tourist Spot",
      href: `/tourism-officer/tourist-spot`,
      title: "Tourist Spot",
      icon: TreePalm,
    },
  ];
};

export default tourismOfficerNavigation;
