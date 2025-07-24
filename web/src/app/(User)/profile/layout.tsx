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
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
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
  application_status?: "pending" | "approved" | "rejected"; // <-- Add this line
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
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    async function fetchUserAndGuide() {
      const res = await loggedInUser(router);
      setUser(res?.data?.user);

      // Only fetch tour guide status if user is a tour guide
      if (res?.data?.user?.role?.toLowerCase() === "tour guide") {
        const guide: TourGuideApplicant | null = await fetchTourGuideApplicant(
          res.data.user.user_id
        );
        if (guide?.application_status)
          setGuideStatus(guide.application_status.toLowerCase());
      }
      // Only fetch tour operator status if user is a tour operator
      else if (res?.data?.user?.role?.toLowerCase() === "tour operator") {
        const operator = await fetchApplicant(res.data.user.user_id);
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
    navigation = tourGuideNavigation(user.user_id, guideStatus);
  } else if (role === "tour operator") {
    navigation = operatorNavigation(user.user_id, operatorStatus);
  } else if (role === "tourist") {
    navigation = touristNavigation(user.user_id);
  } else {
    navigation = [];
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        navigation={navigation}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className="flex-1 min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
