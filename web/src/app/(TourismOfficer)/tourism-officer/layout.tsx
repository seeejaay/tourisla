"use client";
import Sidebar from "@/components/custom/sidebar";

import type { NavItem } from "@/components/custom/sidebar";

import tourismOfficerNavigation from "@/app/static/navigation/tourismofficer-navigation";

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

export default function TourismOfficerLayout({
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

  if (role === "tourism officer") {
    navigation = tourismOfficerNavigation();
  } else {
    // Default navigation for Tourist or others
    navigation = [];
  }

  return (
    <div className="flex">
      {role === "tourism officer" && <Sidebar navigation={navigation} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
