"use client";
import React, { useState, useEffect } from "react";
import { useAttractionHistoryManager } from "@/hooks/useAttractionHistoryManager";
import { ViewCard } from "@/components/custom/attraction-history/viewCard";
import { DetailsModal } from "@/components/custom/attraction-history/detailsModal";
import { fetchTouristSpots } from "@/lib/api/touristSpot";

export interface TouristSpot {
  id: number;
  name: string;
}

export interface VisitorLog {
  id: number;
  visit_date: string;
  unique_code: string;
  registration_date: string;
  qr_code_url: string;
  tourist_spot_id: number;
}

const AttractionHistoryPage = () => {
  const { history, loading, error } = useAttractionHistoryManager();
  const [openId, setOpenId] = useState<number | null>(null);
  const [spots, setSpots] = useState<TouristSpot[]>([]);

  useEffect(() => {
    fetchTouristSpots().then(setSpots);
  }, []);

  const spotMap = React.useMemo(
    () => Object.fromEntries(spots.map((s) => [s.id, s.name])),
    [spots]
  );

  // Group logs by registration_id
  const groupedLogs = history.reduce<Record<number, VisitorLog[]>>((acc, log) => {
    if (!acc[log.registration_id]) acc[log.registration_id] = [];
    acc[log.registration_id].push(log);
    return acc;
  }, {});

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 ml-44">
      <h1 className="text-3xl font-bold mb-6">My Visit History</h1>
      {Object.entries(groupedLogs).length === 0 && (
        <div className="text-gray-500">No visit history found.</div>
      )}
      {Object.entries(groupedLogs).map(([regId, group]) => (
        <div key={regId}>
          <ViewCard
            log={group[0]}
            spotName={spotMap[group[0].tourist_spot_id] || "Unknown"}
            onClick={() => setOpenId(Number(regId))}
          />
          <DetailsModal
            open={openId === Number(regId)}
            onClose={() => setOpenId(null)}
            group={group}
            spotName={spotMap[group[0].tourist_spot_id] || "Unknown"}
          />
        </div>
      ))}
    </div>
  );
};

export default AttractionHistoryPage;