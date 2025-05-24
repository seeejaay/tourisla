"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserManager } from "@/hooks/useUserManager";
import ViewUser from "@/components/custom/users/viewUser";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { loggedInUser } = useAuth();
  const { viewUser } = useUserManager();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await loggedInUser(router);
        if (
          !currentUser ||
          !currentUser.data.user.role ||
          currentUser.data.user.role !== "Admin"
        ) {
          router.replace("/");
          return;
        }
        if (!id) return;
        const userId = Array.isArray(id) ? id[0] : id;
        const userData = await viewUser(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.replace("/");
        return;
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, loggedInUser, viewUser, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return <ViewUser user={user} />;
}
