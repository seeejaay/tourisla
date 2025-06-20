import { User, FileText, Settings } from "lucide-react";

import type { NavItem } from "@/components/custom/sidebar";

const operatorNavigation = (userId: string): NavItem[] => {
  return [
    {
      name: "Profile",
      href: `profile/${userId}`,
      title: "Profile",
      icon: User,
    },
    {
      name: "Documents",
      href: `${userId}/documents/tour-operator`,
      title: "Documents",
      icon: FileText,
    },
    {
      name: "Settings",
      href: `profile/${userId}/settings`,
      title: "Settings",
      icon: Settings,
    },
  ];
};

export default operatorNavigation;
