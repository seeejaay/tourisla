import { BookUser, Users, Sailboat } from "lucide-react";

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
      href: `/profile/${userId}/documents/tour-guide`,
      title: "Documents",
      icon: BookUser,
    },
    {
      name: "Join a Tour Operator",
      href: `/profile/${userId}/apply-to-tour-operator`,
      title: "Apply to Tour Operator",
      icon: Sailboat,
    },
  ];
};

export default tourGuideNavigation;
