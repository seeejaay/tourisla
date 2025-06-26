import { LayoutDashboard, BookText, TreePalm, Megaphone, Wallet } from "lucide-react";
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
      name: "Accommodation Reports",
      href: `/tourism-officer/accommodation-reports`,
      title: "Accommodation Reports",
      icon: BookText,
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
    {
      name: "Visitor Reports",
      href: `/tourism-officer/attraction-reports`,
      title: "Visitor Reports",
      icon: BookText,
    },
    {
      name: "Price Management",
      href: `/tourism-officer/price-management`,
      title: "Price Management",
      icon: Wallet,
    },
  ];
};

export default tourismOfficerNavigation;
