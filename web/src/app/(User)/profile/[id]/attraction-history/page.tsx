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
  registration_id: number; // Make sure this is included!
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

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 ml-44">
      <h1 className="text-3xl font-bold mb-6">My Visit History</h1>
      {history.length === 0 && (
        <div className="text-gray-500">No visit history found.</div>
      )}
      {history.map((log) => {
        const spotId = log.tourist_spot_id;
        const feedbackGiven = feedbackSpotIds.has(spotId);
        return (
          <div key={log.id}>
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
                console.log("Updated feedbacks:", updated);
                setMySpotFeedbacks(updated);
              }}
              feedbackGiven={feedbackGiven}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AttractionHistoryPage;
