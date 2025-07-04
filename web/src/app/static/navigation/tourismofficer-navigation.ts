import {
  LayoutDashboard,
  BookText,
  TreePalm,
  Megaphone,
  Wallet,
  ClipboardList,
  Phone,
  Scale,
  ContactRound,
  Contact,
  Clipboard,
} from "lucide-react";
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
      name: "Hotlines",
      href: `/tourism-officer/hotline`,
      title: "Hotlines",
      icon: Phone,
    },
    {
      name: "Island Entry",
      href: `/tourism-officer/island-entry-logs`,
      title: "Island Entry",
      icon: Clipboard,
    },
    {
      name: "Rules",
      href: `/tourism-officer/rules`,
      title: "Rules",
      icon: Scale,
    },
    {
      name: "Tourism Staff",
      href: `/tourism-officer/tourism-staff`,
      title: "Tourism Staff",
      icon: ContactRound,
    },
    {
      name: "Tour Guides",
      href: `/tourism-officer/tour-guides`,
      title: "Tour Guides",
      icon: Contact,
    },
    {
      name: "Tour Operator",
      href: `/tourism-officer/tour-operators`,
      title: "Tour Operator",
      icon: Contact,
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
    {
      name: "Feedback Questions",
      href: `/tourism-officer/feedback-questions`,
      title: "Feedback Questions",
      icon: ClipboardList,
    },
    {
      name: "Feedback Answers",
      href: `/tourism-officer/feedback`,
      title: "Feedback Answers",
      icon: ClipboardList,
    },
    {
      name: "Incident Report",
      href: `/tourism-officer/incident-report`,
      title: "Incident Report",
      icon: ClipboardList,
    },
  ];
};

export default tourismOfficerNavigation;
