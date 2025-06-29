"use client";
import React, { useEffect } from "react";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import { useAccommodationManager } from "@/hooks/useAccommodationManager";
import { useRuleManager } from "@/hooks/useRuleManager";
import { usePriceManager } from "@/hooks/usePriceManager";
import { useFeedbackManager } from "@/hooks/useFeedbackManager";

export default function Dashboard() {
  // Fetch data from hooks
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
  const { hotlines, loading: hotlineLoading } = useHotlineManager();
  const { accommodations, loading: accommodationLoading } =
    useAccommodationManager();
  const { rules, fetchRules, loading: ruleLoading } = useRuleManager();
  const { prices, loading: priceLoading, getAllPrices } = usePriceManager();
  const { feedbacks, loading: feedbackLoading } = useFeedbackManager();

  // Only fetch once on mount
  useEffect(() => {
    getAllReports();
    fetchAnnouncements();
    fetchRules();
    getAllPrices();

    // Other hooks auto-fetch on mount
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] min-h-screen py-2">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#e6f7fa] p-8">
        <h1 className="text-4xl font-bold text-[#1c5461] text-center mb-2">
          Tourism Officer Dashboard
        </h1>
        <p className="mt-2 mb-8 text-lg text-center text-[#51702c]">
          Welcome! Here you can monitor and manage reports, visitors, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {incidentLoading ? "..." : reports.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Incident Reports
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {announcementLoading ? "..." : announcements.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Announcements
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {hotlineLoading ? "..." : hotlines.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Hotlines
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {accommodationLoading ? "..." : accommodations.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Accommodations
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {ruleLoading ? "..." : rules.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Rules
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {priceLoading ? "..." : prices.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Pricing Types
            </span>
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {feedbackLoading ? "..." : feedbacks.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Feedback Entries
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6">
            <h2 className="text-xl font-bold text-[#1c5461] mb-4">
              Recent Announcements
            </h2>
            {announcementLoading ? (
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
            {incidentLoading ? (
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
