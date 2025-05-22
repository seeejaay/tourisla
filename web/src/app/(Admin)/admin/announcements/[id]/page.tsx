"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { viewAnnouncement } from "@/lib/api/announcements";
import ViewAnnouncement from "@/components/custom/announcements/viewAnnouncement";

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    viewAnnouncement(id)
      .then((data) => setAnnouncement(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!announcement) return <div>Announcement not found.</div>;

  return <ViewAnnouncement announcement={announcement} />;
}
