"use client";
import React, { useEffect } from "react";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import Image from "next/image";
import Header from "@/components/custom/header";
export default function AnnouncementsPage() {
  const { announcements, loading, error, fetchAnnouncements } =
    useAnnouncementManager();

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">
          Announcements
        </h1>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></span>
            <span className="text-blue-700 font-medium">Loading...</span>
          </div>
        )}
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
            {error}
          </div>
        )}
        <ul className="space-y-8">
          {announcements && announcements.length > 0
            ? announcements
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.date_posted).getTime() -
                    new Date(a.date_posted).getTime()
                )
                .map((announcement) => (
                  <li
                    key={announcement.id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-0 flex flex-col md:flex-row overflow-hidden transition hover:shadow-lg"
                  >
                    {announcement.image_url && (
                      <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0">
                        <Image
                          src={announcement.image_url}
                          alt={announcement.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 224px"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                            {announcement.category.replace(/_/g, " ")}
                          </span>
                          <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                            {announcement.location}
                          </span>
                        </div>
                        <div className="font-semibold text-blue-900 text-xl mb-1">
                          {announcement.title}
                        </div>
                        <div className="text-gray-700 mb-2">
                          {announcement.description}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Posted:{" "}
                        {announcement.date_posted
                          ? new Date(announcement.date_posted).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </li>
                ))
            : !loading && (
                <div className="text-center text-gray-500 py-12">
                  No announcements found.
                </div>
              )}
        </ul>
      </div>
    </>
  );
}
