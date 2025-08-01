"use client";
import Sidebar from "@/components/custom/sidebar";
import type { NavItem } from "@/components/custom/sidebar";

import adminNavigation from "@/app/static/navigation/admin-navigation";
import tourGuideNavigation from "@/app/static/navigation/tourguide-navigtion";
import operatorNavigation from "@/app/static/navigation/operator-navigation";
import touristNavigation from "@/app/static/navigation/tourist-navigation";

import { useAuth } from "@/hooks/useAuth";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useTourOperatorManager } from "@/hooks/useTourOperatorManager";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PanelLeftOpen, X } from "lucide-react";

type User = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};
type TourGuideApplicant = {
  email: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  sex: "MALE" | "FEMALE";
  mobile_number: string;
  reason_for_applying: string;
  id?: number;
  profile_picture?: File;
  application_status?: "pending" | "approved" | "rejected";
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loggedInUser } = useAuth();
  const { fetchTourGuideApplicant } = useTourGuideManager();
  const { fetchApplicant } = useTourOperatorManager();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [guideStatus, setGuideStatus] = useState<string>("pending");
  const [operatorStatus, setOperatorStatus] = useState<string>("pending");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchUserAndGuide() {
      const res = await loggedInUser(router);
      setUser(res?.data?.user);

      // Only fetch tour guide status if user is a tour guide
      if (res?.data?.user?.role?.toLowerCase() === "tour guide") {
        const guide: TourGuideApplicant | null = await fetchTourGuideApplicant(
          res.data.user.id
        );
        if (guide?.application_status)
          setGuideStatus(guide.application_status.toLowerCase());
      }
      // Only fetch tour operator status if user is a tour operator
      else if (res?.data?.user?.role?.toLowerCase() === "tour operator") {
        const operator = await fetchApplicant(res.data.user.id);
        if (operator?.application_status)
          setOperatorStatus(operator.application_status.toLowerCase());
      }
    }

    fetchUserAndGuide();
  }, [loggedInUser, fetchTourGuideApplicant, router, fetchApplicant]);

  if (!user) return <div>Loading...</div>;

  const role = user.role.toLowerCase();
  let navigation: NavItem[] = [];

  if (role === "admin") {
    navigation = adminNavigation;
  } else if (role === "tour guide") {
    navigation = tourGuideNavigation(user.id, guideStatus);
  } else if (role === "tour operator") {
    navigation = operatorNavigation(user.id, operatorStatus);
  } else if (role === "tourist") {
    navigation = touristNavigation(user.id);
  } else {
    navigation = [];
  }

  return (
    <div className="flex h-screen w-full">
      {/* Mobile Hamburger Button */}
      <button
        className="sm:hidden fixed top-6 left-6 z-50 p-4 rounded-full cursor-pointer hover:bg-[#1c5461] transition-all hover:text-white active:bg-[#3e979f]/10 text-[#1c5461] bg-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#3e979f] focus:ring-offset-2 focus:ring-offset-white  transform  hover:shadow-lg active:shadow-md active:translate-y-0.5 hover:translate-y-0.5 hover:transition-transform hover:transform hover:duration-300 hover:translate-x-0 hover:scale-100 active:scale-95 active:translate-x-0
        ease-in-out duration-300"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <PanelLeftOpen className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 sm:hidden transition-opacity duration-300 ${
          mobileSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      >
        <aside
          className={`
        fixed left-0 top-0 bottom-0 w-64 bg-white z-50
        transition-transform duration-300 transform
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Icon Button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-all"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
          {/* Sidebar content */}
          <Sidebar
            navigation={navigation}
            isCollapsed={false}
            setIsCollapsed={() => {}}
            mobile
          />
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <Sidebar
        navigation={navigation}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
