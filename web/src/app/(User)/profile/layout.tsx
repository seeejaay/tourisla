"use client";
import Sidebar from "@/components/custom/sidebar";

import type { NavItem } from "@/components/custom/sidebar";

import adminNavigation from "@/app/static/navigation/admin-navigation";
import tourGuideNavigation from "@/app/static/navigation/tourguide-navigtion";
import operatorNavigation from "@/app/static/navigation/operator-navigation";

import { useAuth } from "@/hooks/useAuth";
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

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loggedInUser } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await loggedInUser(router);
      setUser(res?.data?.user);
    }
    fetchUser();
  }, [loggedInUser, router]);

  if (!user) return <div>Loading...</div>;

  const role = user.role.toLowerCase();

  let navigation: NavItem[] = [];

  if (role === "admin") {
    navigation = adminNavigation;
  } else if (role === "tour guide") {
    navigation = tourGuideNavigation(user.user_id);
  } else if (role === "tour operator") {
    navigation = operatorNavigation(user.user_id);
  } else {
    // Default navigation for Tourist or others
    navigation = [];
  }

  return (
    <div className="flex">
      {role !== "tourist" && <Sidebar navigation={navigation} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
