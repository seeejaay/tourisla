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
import Link from "next/link";
import {
  Users,
  Megaphone,
  AlertTriangle,
  Phone,
  MapPinned,
  Hotel,
  Plus,
  ChevronRight,
} from "lucide-react";

// Import dialog components
import AddAccommodation from "@/components/custom/accommodations/addAccommodation";
import AddAnnouncement from "@/components/custom/announcements/addAnnouncement";
import AddIncident from "@/components/custom/incident-report/AddIncident";
import AddTouristSpot from "@/components/custom/tourist-spot/addTouristSpot";
import AddHotline from "@/components/custom/hotline/addHotline";
import SignUp from "@/components/custom/signup";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const { loggedInUser } = useAuth();

  // Dialog state
  const [dialog, setDialog] = useState<null | string>(null);

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
    <div className="w-full min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] py-8 px-2 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1c5461]">
            Welcome, Admin!
          </h1>
          <p className="text-[#51702c] mt-1">
            Here’s an overview of your system. Use the quick actions or explore
            the latest activity.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <QuickAction
            label="Add User"
            icon={<Plus />}
            onClick={() => setDialog("user")}
          />
          <QuickAction
            label="Add Announcement"
            icon={<Plus />}
            onClick={() => setDialog("announcement")}
          />
          <QuickAction
            label="Add Incident"
            icon={<Plus />}
            onClick={() => setDialog("incident")}
          />
          <QuickAction
            label="Add Tourist Spot"
            icon={<Plus />}
            onClick={() => setDialog("tourist-spot")}
          />
          <QuickAction
            label="Add Accommodation"
            icon={<Plus />}
            onClick={() => setDialog("accommodation")}
          />
          <QuickAction
            label="Add Hotline"
            icon={<Plus />}
            onClick={() => setDialog("hotline")}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          icon={<Users className="text-2xl text-[#1c5461]" />}
          label="Users"
          value={loadingUsers ? "..." : Array.isArray(users) ? users.length : 0}
          href="/admin/users"
        />
        <StatCard
          icon={<Megaphone className="text-2xl text-[#3e979f]" />}
          label="Announcements"
          value={loadingAnnouncements ? "..." : announcements.length}
          href="/admin/announcements"
        />
        <StatCard
          icon={<AlertTriangle className="text-2xl text-[#e57373]" />}
          label="Incidents"
          value={loadingIncidents ? "..." : reports.length}
          href="/admin/incident-report"
        />
        <StatCard
          icon={<Phone className="text-2xl text-[#51702c]" />}
          label="Hotlines"
          value={loadingHotlines ? "..." : hotlines.length}
          href="/admin/hotline"
        />
        <StatCard
          icon={<MapPinned className="text-2xl text-[#1c5461]" />}
          label="Tourist Spots"
          value={loadingSpots ? "..." : touristSpots.length}
          href="/admin/tourist-spot"
        />
        <StatCard
          icon={<Hotel className="text-2xl text-[#3e979f]" />}
          label="Accommodations"
          value={loadingAccommodations ? "..." : accommodations.length}
          href="/admin/accommodations"
        />
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Panel
          title="Recent Announcements"
          items={announcements}
          loading={loadingAnnouncements}
          emptyMsg="No announcements yet."
          renderItem={(a) => (
            <div>
              <span className="font-semibold text-[#3e979f]">{a.title}</span>
              <span className="block text-xs text-gray-500">
                {a.created_at
                  ? new Date(a.created_at).toLocaleDateString()
                  : ""}
              </span>
            </div>
          )}
          href="/admin/announcements"
        />
        <Panel
          title="Recent Incident Reports"
          items={reports}
          loading={loadingIncidents}
          emptyMsg="No incident reports yet."
          renderItem={(r) => (
            <div>
              <span className="font-semibold text-[#e57373]">
                {r.title || r.incident_type || "Incident"}
              </span>
              <span className="block text-xs text-gray-500">
                {r.created_at
                  ? new Date(r.created_at).toLocaleDateString()
                  : ""}
              </span>
            </div>
          )}
          href="/admin/incident-reports"
        />
      </div>

      {/* Dialogs */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl max-h-[80vh] overflow-y-auto shadow-xl p-6 max-w-4xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setDialog(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {dialog === "user" && <SignUp onCancel={() => setDialog(null)} />}
            {dialog === "announcement" && (
              <AddAnnouncement onCancel={() => setDialog(null)} />
            )}
            {dialog === "incident" && (
              <AddIncident onCancel={() => setDialog(null)} />
            )}
            {dialog === "tourist-spot" && (
              <AddTouristSpot onCancel={() => setDialog(null)} />
            )}
            {dialog === "accommodation" && (
              <AddAccommodation onCancel={() => setDialog(null)} />
            )}
            {dialog === "hotline" && (
              <AddHotline onCancel={() => setDialog(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

function StatCard({ icon, label, value, href }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-[#e6f7fa] shadow hover:shadow-lg transition flex flex-col items-center py-6 px-2 group"
    >
      <div>{icon}</div>
      <span className="text-3xl font-bold text-[#1c5461] mt-2">{value}</span>
      <span className="mt-1 text-base text-[#3e979f] font-semibold">
        {label}
      </span>
      <span className="mt-2 text-xs text-[#51702c] opacity-0 group-hover:opacity-100 flex items-center gap-1 transition">
        View All <ChevronRight />
      </span>
    </Link>
  );
}

function Panel({ title, items, loading, emptyMsg, renderItem, href }) {
  return (
    <div className="bg-white rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1c5461]">{title}</h2>
        <Link href={href} className="text-[#3e979f] text-sm hover:underline">
          View All
        </Link>
      </div>
      {loading ? (
        <p className="text-[#51702c]">Loading...</p>
      ) : !items || items.length === 0 ? (
        <p className="text-gray-400">{emptyMsg}</p>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 5).map((item) => (
            <li key={item.id} className="border-b border-[#e6f7fa] pb-2">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function QuickAction({ label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 bg-[#1c5461] text-white px-3 py-2 rounded-lg font-semibold hover:bg-[#3e979f] transition text-sm shadow"
    >
      {icon}
      {label}
    </button>
  );
}
