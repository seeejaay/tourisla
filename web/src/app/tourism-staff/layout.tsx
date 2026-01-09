"use client";
import Sidebar from "@/components/custom/sidebar";
import type { NavItem } from "@/components/custom/sidebar";
import tourismStaffNavigation from "@/app/static/navigation/tourismstaff-navigation";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  accommodation_id?: string | null;
};

export default function TourismStaffLayout({
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

  if (role === "tourism staff") {
    const nav = tourismStaffNavigation();

    if (user.accommodation_id) {
      // Only show "Accommodation Reports" if accommodation_id exists
      navigation = nav.filter((item) => item.name === "Accommodation Reports");
    } else {
      // Show all except "Accommodation Reports"
      navigation = nav.filter((item) => item.name !== "Accommodation Reports");
    }
  } else {
    navigation = [];
  }

  return (
    <div className="flex">
      {role === "tourism staff" && <Sidebar navigation={navigation} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
