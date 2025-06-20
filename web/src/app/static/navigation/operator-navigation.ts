import { User, FileText, BookA } from "lucide-react";

import type { NavItem } from "@/components/custom/sidebar";

const operatorNavigation = (userId: string): NavItem[] => {
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
    {
      name: "Tour Guide Application",
      href: `/profile/${userId}/tour-guide-application`,
      title: "Tour Guide Application",
      icon: BookA,
    },
  ];
};

export default operatorNavigation;
