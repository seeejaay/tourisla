import {
  BookUser,
  Home,
  Hotel,
  Megaphone,
  TreePalm,
  Users,
  FileWarning,
} from "lucide-react";

const adminNavigation = [
  {
    name: "Home",
    href: "/admin/dashboard",
    title: "Dashboard",
    icon: Home,
  },
  {
    name: "Accommodations",
    href: "/admin/accommodations",
    title: "Accommodations",
    icon: Hotel,
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
  {
    name: "Incident Reports",
    href: "/admin/incident-report",
    title: "Incident Reports",
    icon: FileWarning,
  },
];

export default adminNavigation;
