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
      router.replace("/auth/login"); // Redirect to the login page
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };
  return (
    <nav
      className={`fixed bg-gray-800 backdrop-blur-xl border-r border-gray-100/20 
        text-gray-100 h-full flex flex-col transition-all duration-300 ease-in-out z-10
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-700/10">
        {!isCollapsed && (
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            tourisla.
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-white/5  active:bg-white/10 
            transition-all duration-200 ${isCollapsed ? "mx-auto" : ""}`}
        >
          {isCollapsed ? (
            <ChevronsRight className="w-5 h-5 text-cyan-400" />
          ) : (
            <ChevronsLeft className="w-5 h-5 text-cyan-400" />
          )}
        </button>
      </div>

      {/* Sidebar Body */}
      <div className="flex-grow overflow-y-auto py-6">
        <ul className="space-y-2 px-3">
          {adminNavigation.map((item) => (
            <li key={item.name} className="group">
              <button
                onClick={() => router.push(item.href)}
                className={`flex items-start w-full p-3 rounded-xl transition-all duration-200 
                  ${
                    pathName === item.href
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400"
                      : "hover:bg-white/5 active:bg-white/10 text-gray-300 hover:text-white"
                  } ${isCollapsed ? "justify-center" : "px-4"}`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 
                    ${
                      pathName === item.href ? "text-cyan-400" : "text-gray-400"
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
                    bg-gray-800/95 backdrop-blur-sm text-white text-sm 
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
      <div className="border-t border-gray-700/10 p-6">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full p-3 rounded-xl 
            hover:bg-red-500/10 active:bg-red-500/20 text-red-400 
            hover:text-red-300 transition-all duration-200 
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
            <p className="text-xs text-gray-400/80">
              © 2025 tourisla.
              <br />
              All rights reserved.
            </p>
          ) : (
            <p className="text-xs text-gray-400/80">© 25</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
