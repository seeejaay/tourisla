"use client";

import Link from "next/link";
import adminNavigation from "@/app/static/admin-navigation";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { logout } from "@/lib/api"; // Import the logout function

import { LogOut, PanelLeftOpen, PanelLeftClose } from "lucide-react";

import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathName = usePathname();

  const handleLogout = async () => {
    try {
      await logout(); // Ensure logout is completed before refreshing
      window.location.href = "/login"; // Redirect to login page
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };
  return (
    <>
      <nav
        className={`fixed bg-gray-900 text-white h-full flex flex-col transition-all duration-300 shadow-lg ${
          isCollapsed ? "w-16 z-0" : "w-64 z-10"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <h2
              className={`text-xl font-bold transition-opacity duration-300 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              tourisla.
            </h2>
          )}
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-white hover:text-gray-300 focus:outline-none flex items-center justify-center transition-transform duration-300 hover:bg-transparent cursor-pointer ${
              isCollapsed ? "rotate-0" : "rotate-180"
            } bg-transparent`}
            style={{ transform: "scale(1.5)" }}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-6 h-6" />
            ) : (
              <PanelLeftClose className="w-6 h-6" />
            )}
          </Button>
        </div>
        <Separator />

        {/* Sidebar Body */}
        <div className="flex-grow flex flex-col">
          <ul className="space-y-4 p-4">
            {adminNavigation.map((item) => (
              <li key={item.name} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 p-2 rounded-md transition ${
                    isCollapsed ? "justify-center" : ""
                  } ${
                    pathName === item.href ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium transition-opacity duration-1000">
                      {item.name}
                    </span>
                  )}
                </Link>
                {isCollapsed && (
                  <span className="absolute left-16 top-0 bg-gray-800 text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition w-auto">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <Separator />

        {/* Sidebar Footer */}
        <div className="flex items-center justify-center p-4">
          <Button
            variant={"destructive"}
            onClick={() => {
              console.log("Logging out...");
              handleLogout();
            }}
            className={`flex items-center space-x-2 w-full rounded-md text-white cursor-pointer transition ${
              isCollapsed ? "justify-center p-2" : "p-3"
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {/* Show text only if not collapsed */}
            {!isCollapsed && (
              <span className="text-sm font-medium">Log Out</span>
            )}
          </Button>
        </div>
        <Separator />
        <div className="p-4">
          {!isCollapsed && (
            <p className="text-xs text-gray-400 text-center">
              © 2025 tourisla. All rights reserved.
            </p>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
