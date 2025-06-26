"use client";
import React, { useState } from "react";
import { useAttractionHistoryManager } from "@/hooks/useAttractionHistoryManager";
import { ViewCard } from "@/components/custom/attraction-history/viewCard";
import { DetailsModal } from "@/components/custom/attraction-history/detailsModal";

// Define the interface here and export it for use in other files if needed
export interface VisitorLog {
  id: number;
  scanned_by_user_id: number;
  visit_date: string;
  tourist_spot_id: number;
  registration_id: number;
  user_id: number;
  unique_code: string;
  qr_code_url: string;
  registration_date: string;
  member_name: string;
  member_age: number;
  member_sex: string;
  is_foreign: boolean;
  municipality: string;
  province: string;
  country: string;
}

const AttractionHistoryPage = () => {
  const { history, loading, error } = useAttractionHistoryManager();
  const [openId, setOpenId] = useState<number | null>(null);

  // Group logs by registration_id
  const groupedLogs = history.reduce<Record<number, VisitorLog[]>>((acc, log) => {
    if (!acc[log.registration_id]) acc[log.registration_id] = [];
    acc[log.registration_id].push(log);
    return acc;
  }, {});

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 ml-45">
      <h1 className="text-3xl font-bold mb-6">My Visit History</h1>
      {Object.entries(groupedLogs).length === 0 && (
        <div className="text-gray-500">No visit history found.</div>
      )}
      {Object.entries(groupedLogs).map(([regId, group]) => (
        <div key={regId}>
          <ViewCard log={group[0]} onClick={() => setOpenId(Number(regId))} />
          <DetailsModal
            open={openId === Number(regId)}
            onClose={() => setOpenId(null)}
            group={group}
          />
        </div>
      ))}
    </div>
  );
};

export default AttractionHistoryPage;