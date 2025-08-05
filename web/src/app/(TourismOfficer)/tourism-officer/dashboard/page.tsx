"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  AlertTriangle,
  MessageCircle,
  User,
  Users,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import { useAccommodationManager } from "@/hooks/useAccommodationManager";
import { useRuleManager } from "@/hooks/useRuleManager";
import { usePriceManager } from "@/hooks/usePriceManager";
import { useFeedbackManager } from "@/hooks/useFeedbackManager";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useTourOperatorManager } from "@/hooks/useTourOperatorManager";

// Import dialogs/components
import AddAnnouncement from "@/components/custom/announcements/addAnnouncement";
import AddHotline from "@/components/custom/hotline/addHotline";
import AddRule from "@/components/custom/rules/addRule";
import AddPrice from "@/components/custom/price/AddPrice";
// ...import AddTourGuide, AddTourOperator if you have them...

export default function Dashboard() {
  // Data hooks
  const {
    reports,
    getAllReports,
    loading: incidentLoading,
  } = useIncidentManager();
  const {
    announcements,
    fetchAnnouncements,
    loading: announcementLoading,
  } = useAnnouncementManager();
  const { fetchHotlines } = useHotlineManager();
  const { fetchAccommodations } = useAccommodationManager();
  const { fetchRules } = useRuleManager();
  const { getAllPrices } = usePriceManager();
  const { feedbacks, loading: feedbackLoading } = useFeedbackManager();
  const {
    tourGuideApplicants,
    fetchTourGuideApplicants,
    loading: guideLoading,
  } = useTourGuideManager();
  const {
    OperatorApplicants,
    fetchApplicants,
    loading: operatorLoading,
  } = useTourOperatorManager();

  // Dialog state
  const [dialog, setDialog] = useState<null | string>(null);

  useEffect(() => {
    getAllReports();
    fetchAnnouncements();
    fetchHotlines();
    fetchAccommodations();
    fetchRules();
    getAllPrices();
    fetchTourGuideApplicants();
    fetchApplicants();
    // eslint-disable-next-line
  }, []);

  // Stat cards config
  const stats = [
    {
      icon: <AlertTriangle className="text-2xl text-[#e57373]" />,
      label: "Incident Reports",
      value: incidentLoading ? "..." : reports.length,
      href: "/tourism-officer/incident-report",
    },
    {
      icon: <Megaphone className="text-2xl text-[#3e979f]" />,
      label: "Announcements",
      value: announcementLoading ? "..." : announcements.length,
      href: "/tourism-officer/announcements",
    },
    {
      icon: <MessageCircle className="text-2xl text-[#51702c]" />,
      label: "Feedback Entries",
      value: feedbackLoading ? "..." : feedbacks.length,
      href: "/tourism-officer/feedback",
    },
    {
      icon: <User className="text-2xl text-[#1c5461]" />,
      label: "Tour Guide Applicants",
      value: guideLoading ? "..." : tourGuideApplicants.length,
      href: "/tourism-officer/tour-guides",
    },
    {
      icon: <Users className="text-2xl text-[#3e979f]" />,
      label: "Tour Operator Applicants",
      value: operatorLoading ? "..." : OperatorApplicants.length,
      href: "/tourism-officer/tour-operators",
    },
  ];

  // Quick actions config
  const quickActions = [
    { label: "Add Announcement", dialog: "announcement", icon: <Plus /> },
    { label: "Add Hotline", dialog: "hotline", icon: <Plus /> },
    { label: "Add Rule", dialog: "rule", icon: <Plus /> },
    { label: "Add Price", dialog: "price", icon: <Plus /> },
    // { label: "Add Tour Guide", dialog: "guide", icon: <Plus /> },
    // { label: "Add Tour Operator", dialog: "operator", icon: <Plus /> },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] py-8 px-2 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1c5461]">
            Welcome, Tourism Officer!
          </h1>
          <p className="text-[#51702c] mt-1">
            Here’s an overview of your system. Use the quick actions or explore
            the latest activity.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((action) => (
            <QuickAction
              key={action.label}
              label={action.label}
              icon={action.icon}
              onClick={() => setDialog(action.dialog)}
            />
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            href={stat.href}
          />
        ))}
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Panel
          title="Recent Announcements"
          items={announcements}
          loading={announcementLoading}
          emptyMsg="No announcements yet."
          renderItem={(a) => (
            <div>
              <span className="font-semibold text-[#3e979f]">{a.title}</span>
              <span className="block text-xs text-gray-500">
                {a.date_posted
                  ? new Date(a.date_posted).toLocaleDateString()
                  : ""}
              </span>
            </div>
          )}
          href="/tourism-officer/announcements"
        />
        <Panel
          title="Recent Incident Reports"
          items={reports}
          loading={incidentLoading}
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
          href="/tourism-officer/incidents"
        />
      </div>

      {/* Latest Applicants Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ApplicantTable
          title="Latest Tour Guide Applicants"
          applicants={tourGuideApplicants}
          loading={guideLoading}
          columns={[
            { key: "first_name", label: "First Name" },
            { key: "last_name", label: "Last Name" },
            { key: "email", label: "Email" },
            { key: "application_status", label: "Status" },
          ]}
          href="/tourism-officer/tour-guides"
        />
        <ApplicantTable
          title="Latest Tour Operator Applicants"
          applicants={OperatorApplicants}
          loading={operatorLoading}
          columns={[
            { key: "operator_name", label: "Company" },
            { key: "email", label: "Email" },
            { key: "application_status", label: "Status" },
          ]}
          href="/tourism-officer/tour-operators"
        />
      </div>

      {/* Dialogs */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl max-h-[80vh] overflow-y-auto shadow-xl p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setDialog(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {dialog === "announcement" && (
              <AddAnnouncement
                onCancel={() => setDialog(null)}
                onSuccess={() => setDialog(null)}
              />
            )}
            {dialog === "hotline" && (
              <AddHotline
                onCancel={() => setDialog(null)}
                onSuccess={() => setDialog(null)}
              />
            )}
            {dialog === "rule" && (
              <AddRule
                onCancel={() => setDialog(null)}
                onSuccess={() => setDialog(null)}
              />
            )}
            {dialog === "price" && (
              <AddPrice
                onCancel={() => setDialog(null)}
                onSuccess={() => setDialog(null)}
              />
            )}
            {/* Add dialogs for guide/operator if needed */}
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

function ApplicantTable({ title, applicants, loading, columns, href }) {
  // Helper to color code status
  function renderCell(col, value) {
    if (col.key === "application_status" || col.key === "status") {
      let color = "bg-gray-200 text-gray-700";
      if (value === "APPROVED" || value === "ACTIVE")
        color = "bg-green-100 text-green-700";
      else if (value === "PENDING") color = "bg-yellow-100 text-yellow-700";
      else if (value === "REJECTED" || value === "INACTIVE")
        color = "bg-red-100 text-red-700";
      return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
          {value}
        </span>
      );
    }
    return value;
  }

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
      ) : !applicants || applicants.length === 0 ? (
        <p className="text-gray-400">No applicants yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-2 py-1 text-left font-semibold text-[#3e979f]"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applicants.slice(0, 5).map((app) => (
                <tr key={app.id} className="border-b border-[#e6f7fa]">
                  {columns.map((col) => (
                    <td key={col.key} className="px-2 py-1">
                      {renderCell(col, app[col.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
