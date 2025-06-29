"use client";
import React, { useEffect } from "react";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import Image from "next/image";
import Header from "@/components/custom/header";
import { Megaphone } from "lucide-react";
import Footer from "@/components/custom/footer";
export default function AnnouncementsPage() {
  const { announcements, loading, error, fetchAnnouncements } =
    useAnnouncementManager();

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pt-24 px-4 pb-12 ">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#1c5461] rounded-full p-4 shadow-lg mb-4">
            <Megaphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#1c5461] mb-2 text-center tracking-tight">
            Latest Announcements
          </h1>
          <p className="text-[#51702c] text-lg text-center max-w-2xl">
            Stay up to date with important news, updates, and events on Bantayan
            Island.
          </p>
        </div>
        {loading && (
          <div className="flex justify-center items-center py-12">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3e979f] mr-3"></span>
            <span className="text-[#1c5461] font-semibold text-lg">
              Loading...
            </span>
          </div>
        )}
        {error && (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center font-semibold">
            {error}
          </div>
        )}
        <ul className="space-y-10">
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
                    className="bg-white rounded-3xl shadow-xl border border-[#7b9997]/20 flex flex-col md:flex-row overflow-hidden transition hover:shadow-2xl hover:border-[#3e979f]/40"
                  >
                    {announcement.image_url && (
                      <div className="relative w-full md:w-64 h-56 md:h-auto flex-shrink-0">
                        <Image
                          src={announcement.image_url}
                          alt={announcement.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 256px"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c5461]/60 to-transparent" />
                      </div>
                    )}
                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-block bg-[#e6f7fa] text-[#1c5461] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {announcement.category.replace(/_/g, " ")}
                          </span>
                          <span className="inline-block bg-[#f3f7f3] text-[#51702c] px-4 py-1 rounded-full text-xs font-medium">
                            {announcement.location}
                          </span>
                        </div>
                        <div className="font-bold text-2xl text-[#1c5461] mb-2">
                          {announcement.title}
                        </div>
                        <div className="text-[#51702c] mb-4 text-base leading-relaxed">
                          {announcement.description}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-[#7b9997]">
                          Posted:{" "}
                          {announcement.date_posted
                            ? new Date(
                                announcement.date_posted
                              ).toLocaleString()
                            : ""}
                        </span>
                        {/* Optionally, add a badge for "New" if posted within 3 days */}
                        {announcement.date_posted &&
                          new Date().getTime() -
                            new Date(announcement.date_posted).getTime() <
                            3 * 24 * 60 * 60 * 1000 && (
                            <span className="ml-2 px-3 py-1 bg-[#3e979f] text-white text-xs rounded-full font-semibold">
                              New
                            </span>
                          )}
                      </div>
                    </div>
                  </li>
                ))
            : !loading && (
                <div className="text-center text-[#7b9997] py-16 text-lg font-medium">
                  No announcements found.
                </div>
              )}
        </ul>
      </div>
      <Footer />
    </>
  );
}
