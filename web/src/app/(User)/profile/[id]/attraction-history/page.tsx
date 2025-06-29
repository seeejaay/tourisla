"use client";
import React, { useState, useEffect } from "react";
import { useAttractionHistoryManager } from "@/hooks/useAttractionHistoryManager";
import { ViewCard } from "@/components/custom/attraction-history/viewCard";
import { DetailsModal } from "@/components/custom/attraction-history/detailsModal";
import { fetchTouristSpots } from "@/lib/api/touristSpot";
import { FeedbackModal } from "@/components/custom/attraction-history/FeedbackModal";
import { fetchMySpotFeedbacks } from "@/lib/api/feedback";

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
  registration_id: number;
  // Add other fields if needed
}
export interface SpotFeedback {
  id: number;
  type: string; // e.g., "SPOT"
  feedback_for_spot_id: number;
  feedback_for_user_id: number | null;
  submitted_at: string; // ISO date string
  submitted_by: number;
}
const AttractionHistoryPage = () => {
  const { history, loading, error } = useAttractionHistoryManager();
  const [openId, setOpenId] = useState<number | null>(null);
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [feedbackOpenId, setFeedbackOpenId] = useState<number | null>(null);
  const [mySpotFeedbacks, setMySpotFeedbacks] = useState<SpotFeedback[]>([]);

  useEffect(() => {
    fetchTouristSpots().then(setSpots);
    fetchMySpotFeedbacks().then(setMySpotFeedbacks);
  }, []);

  const spotMap = React.useMemo(
    () => Object.fromEntries(spots.map((s) => [s.id, s.name])),
    [spots]
  );

  // Set of spot IDs for which feedback has already been given
  const feedbackSpotIds = React.useMemo(
    () => new Set(mySpotFeedbacks.map((fb) => fb.feedback_for_spot_id)),
    [mySpotFeedbacks]
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#e6f7fa]">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#1c5461]">
            Loading visit history...
          </h1>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#e6f7fa]">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#e6f7fa] p-8 space-y-6">
        <h1 className="text-3xl font-bold mb-8 text-[#1c5461] text-center">
          My Visit History
        </h1>
        {history.map((log) => {
          const spotId = log.tourist_spot_id;
          const feedbackGiven = feedbackSpotIds.has(spotId);
          return (
            <div
              key={`${log.id}-${log.registration_id}`}
              className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#1c5461]">
                  Visit on {new Date(log.visit_date).toLocaleDateString()}
                </h2>
                <span className="text-sm text-gray-500">
                  Registration ID: {log.registration_id}
                </span>
              </div>
              <ViewCard
                log={log}
                spotName={spotMap[spotId] || "Unknown"}
                onClick={() => setOpenId(log.id)}
                onFeedback={() => setFeedbackOpenId(spotId)}
                feedbackGiven={feedbackGiven}
              />
              <DetailsModal
                open={openId === log.id}
                onClose={() => setOpenId(null)}
                group={[log]}
                spotName={spotMap[spotId] || "Unknown"}
              />
              <FeedbackModal
                open={feedbackOpenId === spotId}
                onClose={() => setFeedbackOpenId(null)}
                spotName={spotMap[spotId] || "Unknown"}
                spotId={spotId}
                onSubmitted={async () => {
                  alert("Thank you for your feedback!");
                  setFeedbackOpenId(null);
                  // Refresh feedbacks after submission
                  const updated = await fetchMySpotFeedbacks();
                  setMySpotFeedbacks(updated);
                }}
                feedbackGiven={feedbackGiven}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttractionHistoryPage;
