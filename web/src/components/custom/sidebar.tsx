"use client";

import adminNavigation from "@/app/static/admin-navigation";
// import { Separator } from "@/components/ui/separator";
import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/api/auth"; // Import the logout function

import { LogOut, ChevronsRight, ChevronsLeft } from "lucide-react";

import { usePathname } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathName = usePathname();

  const handleLogout = async () => {
    try {
      await logout(); // Ensure logout is completed before refreshing
      router.replace("/login"); // Redirect to the login page
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };
  return (
    <>
      <nav
        className={`fixed bg-gradient-to-b from-gray-800 to-gray-900 text-white h-full flex flex-col transition-all duration-300 ease-in-out shadow-xl ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700/50">
          {!isCollapsed && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              tourisla.
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-full hover:bg-gray-700/50 transition-all duration-200 ${
              isCollapsed ? "mx-auto" : ""
            }`}
          >
            {isCollapsed ? (
              <ChevronsRight className="w-5 h-5 text-cyan-400" />
            ) : (
              <ChevronsLeft className="w-5 h-5 text-cyan-400" />
            )}
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex-grow overflow-y-auto custom-scrollbar py-4">
          <ul className="space-y-1 px-2">
            {adminNavigation.map((item) => (
              <li key={item.name} className="group relative">
                <button
                  onClick={() => router.push(item.href)}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                    pathName === item.href
                      ? "bg-blue-500/10 text-cyan-400 border-l-4 border-cyan-400"
                      : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
                  } ${isCollapsed ? "justify-center" : "pl-4"}`}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      pathName === item.href ? "text-cyan-400" : "text-gray-400"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">
                      {item.name}
                    </span>
                  )}
                  {isCollapsed && (
                    <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-700/50 p-4">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-200 ${
              isCollapsed ? "justify-center" : "pl-4"
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">Log Out</span>
            )}
          </button>

          <div className={`mt-4 text-center ${isCollapsed ? "px-0" : "px-4"}`}>
            {!isCollapsed ? (
              <p className="text-xs text-gray-500">
                © 2025 tourisla.
                <br />
                All rights reserved.
              </p>
            ) : (
              <p className="text-xs text-gray-500">© 25</p>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
