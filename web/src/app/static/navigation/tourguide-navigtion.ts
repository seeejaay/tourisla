import { BookUser, Users, Sailboat, User } from "lucide-react";

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
    {
      name: "Asssigned Tour Packages",
      href: `/profile/${userId}/assigned-tour-packages`,
      title: "Assigned Tour Packages",
      icon: User,
    },
  ];
};

export default tourGuideNavigation;
