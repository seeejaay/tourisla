import { BookOpen, BookUser, Home, Megaphone } from "lucide-react";

const DirectorNavigation = [
  {
    name: "Home",
    href: "/cultural-director/dashboard",
    title: "Dashboard",
    icon: Home,
  },
  {
    name: "Announcements",
    href: "/cultural-director/announcements",
    title: "Announcements",
    icon: Megaphone,
  },
  {
    name: "Hotline",
    href: "/cultural-director/hotline",
    title: "Hotline",
    icon: BookUser,
  },
  {
    name: "Article",
    href: "/cultural-director/article",
    title: "Article",
    icon: BookOpen,
  },
];

export default DirectorNavigation;
