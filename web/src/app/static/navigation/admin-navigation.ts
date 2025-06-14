import { BookUser, Home, Megaphone, TreePalm, Users } from "lucide-react";

const adminNavigation = [
  {
    name: "Home",
    href: "/admin/dashboard",
    title: "Dashboard",
    icon: Home,
  },
  {
    name: "Announcements",
    href: "/admin/announcements",
    title: "Announcements",
    icon: Megaphone,
  },
  {
    name: "Users",
    href: "/admin/users",
    title: "Manage Users",
    icon: Users,
  },
  {
    name: "Tourist Spots",
    href: "/admin/tourist-spot",
    title: "Tourist Spots",
    icon: TreePalm,
  },
  {
    name: "Hotline",
    href: "/admin/hotline",
    title: "Hotline",
    icon: BookUser,
  },
];

export default adminNavigation;
