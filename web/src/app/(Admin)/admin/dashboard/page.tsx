"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserManager } from "@/hooks/useUserManager";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { useAccommodationManager } from "@/hooks/useAccommodationManager";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const { loggedInUser } = useAuth();

  // Managers
  const { users, viewAllUsers, loading: loadingUsers } = useUserManager();
  const {
    announcements,
    fetchAnnouncements,
    loading: loadingAnnouncements,
  } = useAnnouncementManager();
  const {
    reports,
    getAllReports,
    loading: loadingIncidents,
  } = useIncidentManager();
  const {
    hotlines,
    fetchHotlines,
    loading: loadingHotlines,
  } = useHotlineManager();
  const {
    touristSpots,
    fetchTouristSpots,
    loading: loadingSpots,
  } = useTouristSpotManager();
  const {
    accommodations,
    fetchAccommodations,
    loading: loadingAccommodations,
  } = useAccommodationManager();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const user = await loggedInUser(router);
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.replace("/");
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    }
    getCurrentUser();
  }, [router, loggedInUser]);

  // Fetch all dashboard data on mount
  useEffect(() => {
    viewAllUsers();
    fetchAnnouncements();
    getAllReports();
    fetchHotlines();
    fetchTouristSpots();
    fetchAccommodations();
    // eslint-disable-next-line
  }, []);

  if (
    loading ||
    loadingUsers ||
    loadingAnnouncements ||
    loadingIncidents ||
    loadingHotlines ||
    loadingSpots ||
    loadingAccommodations ||
    !authChecked
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#e6f7fa] flex flex-col items-center">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3e979f] mb-4"></span>
          <h1 className="text-2xl font-bold mb-2 text-center text-[#1c5461]">
            Loading dashboard...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] min-h-screen py-2">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#e6f7fa] p-8">
        <h1 className="text-4xl font-bold text-[#1c5461] text-center mb-2">
          Admin Dashboard
        </h1>
        <p className="mt-2 mb-8 text-lg text-center text-[#51702c]">
          Welcome to the admin dashboard! Use the navigation to manage users,
          content, and reports.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {loadingUsers ? "..." : Array.isArray(users) ? users.length : 0}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Users
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {loadingAnnouncements ? "..." : announcements.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Announcements
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {loadingIncidents ? "..." : reports.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Incident Reports
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {loadingHotlines ? "..." : hotlines.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Hotlines
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {loadingSpots ? "..." : touristSpots.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Tourist Spots
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {loadingAccommodations ? "..." : accommodations.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Accommodations
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6">
            <h2 className="text-xl font-bold text-[#1c5461] mb-4">
              Recent Announcements
            </h2>
            {loadingAnnouncements ? (
              <p className="text-[#51702c]">Loading...</p>
            ) : announcements.length === 0 ? (
              <p className="text-gray-400">No announcements yet.</p>
            ) : (
              <ul className="space-y-2">
                {announcements.slice(0, 3).map((a) => (
                  <li key={a.id} className="border-b border-[#e6f7fa] pb-2">
                    <span className="font-semibold text-[#3e979f]">
                      {a.title}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex-1 bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6">
            <h2 className="text-xl font-bold text-[#1c5461] mb-4">
              Recent Incident Reports
            </h2>
            {loadingIncidents ? (
              <p className="text-[#51702c]">Loading...</p>
            ) : reports.length === 0 ? (
              <p className="text-gray-400">No incident reports yet.</p>
            ) : (
              <ul className="space-y-2">
                {reports.slice(0, 3).map((r) => (
                  <li key={r.id} className="border-b border-[#e6f7fa] pb-2">
                    <span className="font-semibold text-[#e57373]">
                      {r.title || r.incident_type || "Incident"}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
