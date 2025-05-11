"use client";

import Link from "next/link";

import adminNavigation from "@/app/static/admin-navigation";

const Sidebar = () => {
  return (
    <>
      <div className="sidebar absolute bg-gray-800 text-white max-w-64 h-full p-8">
        <h2 className="text-xl font-bold mb-4">Sidebar</h2>
        <div className="flex flex-col space-y-8">
          {adminNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-gray-300 cursor-pointer"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
