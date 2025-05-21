"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/custom/sidebar";
import { useRouter } from "next/navigation";
import {
  Announcement,
  columns,
} from "@/components/custom/announcements/columns";
import { DataTable } from "@/components/custom/announcements/data-table";

import { currentUser } from "@/lib/api";
import { fetchAnnouncements } from "@/lib/api/announcements";
export default function Announcements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  //for actions view, edit, delete
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [dialogAnnouncement, setDialogAnnouncement] =
    useState<Announcement | null>(null);
  const [editDialogAnnouncement, setEditDialogAnnouncement] =
    useState<Announcement | null>(null);
  const [deleteDialogAnnouncement, setDeleteDialogAnnouncement] =
    useState<Announcement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentUserAndAnnouncements() {
      try {
        const user = await currentUser();
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        router.replace("/");
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    }
    getCurrentUserAndAnnouncements();
  }, [router]);

  return (
    <>
      <Sidebar />
      <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <div className="flex max-w-[100rem] w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
            Announcements
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Manage all announcements for your users here.
          </p>
          <div className="w-full max-w-[90rem]">
            <DataTable columns={columns()} data={announcements} />
            {/* Dialogs for view, edit, delete can be added here if needed */}
          </div>
        </div>
      </main>
    </>
  );
}
