"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import ViewAnnouncement from "@/components/custom/announcements/viewAnnouncement";
import { Announcement } from "@/components/custom/announcements/columns";

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<Announcement | null>();

  const { loggedInUser } = useAuth();
  const { viewAnnouncement, loading, error } = useAnnouncementManager();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const user = await loggedInUser(router);
        if (
          !user ||
          !user.data.user.role ||
          user.data.user.role !== "Tourism Staff"
        ) {
          router.replace("/");
          return;
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        router.replace("/");
        return;
      }

      if (!id) return;
      viewAnnouncement(id as string)
        .then((data) => setAnnouncement(data))
        .catch(() => setAnnouncement(null));
    }

    getCurrentUser();
  }, [id, router, loggedInUser, viewAnnouncement]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!announcement) return <div>Announcement not found.</div>;

  return <ViewAnnouncement announcement={announcement} />;
}
