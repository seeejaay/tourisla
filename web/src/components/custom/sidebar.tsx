"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { LogOut, ChevronsRight, ChevronsLeft } from "lucide-react";
import Image from "next/image";
export type NavItem = {
  name: string;
  title: string;
  href: string;
  icon: React.ElementType;
};

type SidebarProps = {
  navigation: NavItem[];
};

const Sidebar = ({ navigation }: SidebarProps) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathName = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <nav
      className={`fixed bg-gradient-to-b from-[#e6f7fa]/80 to-[#fffff1] border-r border-[#e6f7fa] 
        text-[#1c5461] h-full flex flex-col transition-all duration-300 ease-in-out z-50
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between border-b border-[#e6f7fa] bg-white/95">
        {!isCollapsed && (
          <Image
            src="/images/TourISLA_Logo.png"
            alt="Tourisla Logo"
            width={150}
            height={150}
            className="h-20 w-auto"
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-[#e6f7fa] active:bg-[#3e979f]/10
            transition-all duration-200 ${isCollapsed ? "mx-auto" : ""}`}
        >
          {isCollapsed ? (
            <ChevronsRight className="w-5 h-5 text-[#3e979f]" />
          ) : (
            <ChevronsLeft className="w-5 h-5 text-[#3e979f]" />
          )}
        </button>
      </div>

      {/* Sidebar Body */}
      <div className="flex-grow overflow-y-auto py-6 bg-transparent overflow-hidden">
        <ul className="space-y-2 px-3">
          {navigation.map((item) => (
            <li key={item.name} className="group relative">
              <button
                onClick={() => router.push(item.href)}
                className={`flex items-center w-full p-3 cursor-pointer rounded-xl transition-all duration-200
                  ${
                    pathName === item.href
                      ? "bg-[#3e979f]/10 text-[#3e979f] font-semibold"
                      : "hover:bg-[#e6f7fa] active:bg-[#3e979f]/10 text-[#1c5461] hover:text-[#3e979f]"
                  } ${isCollapsed ? "justify-center" : "px-4"}`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0
                    ${
                      pathName === item.href
                        ? "text-[#3e979f]"
                        : "text-[#7b9997]"
                    }`}
                />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                )}
                {isCollapsed && (
                  <div
                    className="absolute left-full ml-4 px-3 py-2
                    bg-white/95 border border-[#e6f7fa] text-[#1c5461] text-sm
                    rounded-lg shadow-xl opacity-0 group-hover:opacity-100
                    transition-all scale-95 group-hover:scale-100 z-50"
                  >
                    {item.name}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-[#e6f7fa] p-6 bg-white/95">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full p-3 rounded-md border border-red-500 cursor-pointer
            hover:bg-red-500 active:bg-[#f8d56b]/20 text-[#c0392b]
            hover:text-[#f1f1f1] transition-all duration-200 
            ${isCollapsed ? "justify-center" : "px-4"}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium tracking-wide">
              Log Out
            </span>
          )}
        </button>

        <div className={`mt-6 text-center ${isCollapsed ? "px-0" : "px-4"}`}>
          {!isCollapsed ? (
            <p className="text-xs text-[#3e979f]/80">
              © 2025 tourisla.
              <br />
              All rights reserved.
            </p>
          ) : (
            <p className="text-xs text-[#3e979f]/80">© 25</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
