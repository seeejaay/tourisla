"use client";

// import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { LogOut, ChevronsRight, ChevronsLeft } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
export type NavItem = {
  name: string;
  title: string;
  href: string;
  icon: React.ElementType;
};

type SidebarProps = {
  navigation: NavItem[];
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  mobile?: boolean;
};

const Sidebar = ({
  navigation,
  isCollapsed,
  setIsCollapsed,
  mobile = false,
}: SidebarProps) => {
  const router = useRouter();
  const pathName = usePathname();

  // On mobile, always expanded
  const collapsed = mobile ? false : isCollapsed;

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <aside
      aria-label="Sidebar"
      className={`${
        mobile ? "flex" : "hidden sm:flex"
      } bg-gradient-to-b bg-white border text-[#1c5461] flex-col transition-all duration-300 ease-in-out z-50
      ${collapsed ? "w-20" : "w-64"} h-screen`}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between border-b border-[#e6f7fa] bg-white/95">
        {!collapsed && (
          <Image
            src="/images/TourISLA_Logo.png"
            alt="Tourisla Logo"
            width={150}
            height={150}
            className="h-20 w-auto"
            priority
          />
        )}
        {/* Only show collapse button on desktop */}
        {!mobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg hover:bg-[#e6f7fa] active:bg-[#3e979f]/10
              transition-all duration-200 ${collapsed ? "mx-auto" : ""}`}
          >
            {collapsed ? (
              <ChevronsRight className="w-5 h-5 text-[#3e979f]" />
            ) : (
              <ChevronsLeft className="w-5 h-5 text-[#3e979f]" />
            )}
          </button>
        )}
      </div>

      {/* Sidebar Body */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden py-6 bg-transparent">
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
                  } ${collapsed ? "justify-center" : "px-4"}`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0
                    ${
                      pathName === item.href
                        ? "text-[#3e979f]"
                        : "text-[#7b9997]"
                    }`}
                />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                )}
                {collapsed && (
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
      <div className="border-t border-[#e6f7fa] p-6 bg-white/95 w-full">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full p-3 rounded-md border border-red-500 cursor-pointer
      hover:bg-red-500 active:bg-[#f8d56b]/20 text-[#c0392b]
      hover:text-[#f1f1f1] transition-all duration-200 
      ${collapsed ? "justify-center" : "px-4"}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="ml-3 text-sm font-medium tracking-wide">
              Log Out
            </span>
          )}
        </button>

        <div className={`mt-6 text-center ${collapsed ? "px-0" : "px-4"}`}>
          {!collapsed ? (
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
    </aside>
  );
};

export default Sidebar;
