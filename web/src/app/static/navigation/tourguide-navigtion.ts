import { BookUser, Home, Users } from "lucide-react";

import type { NavItem } from "@/components/custom/sidebar";

const tourGuideNavigation = (userId: string): NavItem[] => {
  return [
    {
      name: "Profile",
      href: `/profile/${userId}`,
      title: "Profile",
      icon: Users,
    },
    {
      name: "Documents",
      href: `/profile/${userId}/documents`,
      title: "Documents",
      icon: BookUser,
    },
    {
      name: "Settings",
      href: `/profile/${userId}/settings`,
      title: "Settings",
      icon: Home,
    },
  ];
};

export default tourGuideNavigation;
