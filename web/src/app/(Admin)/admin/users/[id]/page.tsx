"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { viewUser } from "@/lib/api";
import ViewUser from "@/components/custom/users/viewUser";

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    viewUser(id)
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return <ViewUser user={user} />;
}
