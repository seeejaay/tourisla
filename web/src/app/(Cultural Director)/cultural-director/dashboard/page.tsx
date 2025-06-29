"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import { useArticleManager } from "@/hooks/useArticleManager";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const { loggedInUser } = useAuth();

  // Managers
  const {
    announcements,
    loading: loadingAnnouncements,
    error: errorAnnouncements,
    fetchAnnouncements,
  } = useAnnouncementManager();
  const {
    hotlines,
    loading: loadingHotlines,
    error: errorHotlines,
    fetchHotlines,
  } = useHotlineManager();
  const {
    articles,
    loading: loadingArticles,
    error: errorArticles,
    fetchArticles,
  } = useArticleManager();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const user = await loggedInUser(router);
        if (
          !user ||
          !user.data.user.role ||
          user.data.user.role !== "Cultural Director"
        ) {
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

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchAnnouncements();
    fetchHotlines();
    fetchArticles();
  }, [fetchAnnouncements, fetchHotlines, fetchArticles]);

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] min-h-screen py-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#e6f7fa] p-8">
        <h1 className="text-4xl font-bold text-[#1c5461] text-center mb-2">
          Cultural Director Dashboard
        </h1>
        <p className="mt-2 mb-8 text-lg text-center text-[#51702c]">
          Welcome to the Cultural Director dashboard!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {loadingAnnouncements ? "..." : announcements.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Announcements
            </span>
            {errorAnnouncements && (
              <span className="text-red-500 text-xs mt-2">
                {errorAnnouncements}
              </span>
            )}
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {loadingHotlines ? "..." : hotlines.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Hotlines
            </span>
            {errorHotlines && (
              <span className="text-red-500 text-xs mt-2">{errorHotlines}</span>
            )}
          </div>
          <div className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow p-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#1c5461]">
              {loadingArticles ? "..." : articles.length}
            </span>
            <span className="mt-2 text-lg text-[#3e979f] font-semibold">
              Articles
            </span>
            {errorArticles && (
              <span className="text-red-500 text-xs mt-2">{errorArticles}</span>
            )}
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
              Recent Articles
            </h2>
            {loadingArticles ? (
              <p className="text-[#51702c]">Loading...</p>
            ) : articles.length === 0 ? (
              <p className="text-gray-400">No articles yet.</p>
            ) : (
              <ul className="space-y-2">
                {articles.slice(0, 3).map((a) => (
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
        </div>
      </div>
    </div>
  );
}
