"use client";

import { useState } from "react";
import { useSpotFeedbackManager } from "@/hooks/useSpotFeedbackManager";
import FeedbackGroupList from "@/components/custom/feedback/FeedbackGroupList";

export default function SpotFeedbackPage() {
  const { feedbacks, loading } = useSpotFeedbackManager();
  const [search, setSearch] = useState("");

  const filtered = feedbacks.filter((f) =>
    f.submitted_by.toString().toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Tourist Spot Feedback
      </h1>

      {/* 🔍 Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by submitted_by..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 🗂 Feedback List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading spot feedback...</p>
      ) : (
        <FeedbackGroupList feedbacks={filtered} />
      )}
    </div>
  );
}
