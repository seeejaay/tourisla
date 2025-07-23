"use client";

import React, { useState, useEffect } from "react";
import { columns, TourGuide } from "@/components/custom/tour-guide/column";
import DataTable from "@/components/custom/data-table";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useRouter } from "next/navigation";
import ViewTourGuide from "@/components/custom/tour-guide/viewTourGuide";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TourGuideListPage() {
  const [data, setData] = useState<TourGuide[]>([]);
  const [dialogTourGuide, setDialogTourGuide] = useState<TourGuide | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("all");
  const { fetchAllTourGuideApplicants, fetchTourGuideApplicant } =
    useTourGuideManager();
  const router = useRouter();

  useEffect(() => {
    async function fetchGuides() {
      const guides = await fetchAllTourGuideApplicants();
      if (!guides) {
        setData([]);
        return;
      }
      setData(
        (guides as TourGuide[]).map((guide) => ({
          id: guide.id ? Number(guide.id) : undefined,
          first_name: guide.first_name,
          last_name: guide.last_name,
          birth_date: guide.birth_date,
          sex: guide.sex,
          mobile_number: guide.mobile_number,
          email: guide.email,
          reason_for_applying: guide.reason_for_applying,
          profile_picture: guide.profile_picture,
          application_status: guide.application_status ?? "pending",
          user_id: guide.user_id ? Number(guide.user_id) : undefined,
        }))
      );
    }
    fetchGuides();
  }, [fetchAllTourGuideApplicants]);

  const handleViewTourGuide = async (guide: TourGuide | null) => {
    if (!guide || !guide.id || !guide.user_id) return;
    const freshGuide = await fetchTourGuideApplicant(guide.user_id.toString());
    setDialogTourGuide(freshGuide);
  };

  const handleViewDocuments = (guide: TourGuide | null) => {
    if (!guide || !guide.user_id) return;
    router.push(`tour-guides/${guide.user_id}/documents`);
  };

  const filteredData =
    activeTab === "all"
      ? data
      : data.filter(
          (guide) => guide.application_status === activeTab.toUpperCase()
        );

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
            Tour Guides
          </h1>
          <p className="text-lg text-[#51702c] text-center">
            Review, approve, or reject tour guide applications.
          </p>
        </div>
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border border-[#e6f7fa] p-4 md:p-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-4"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="w-full flex flex-col items-center">
            <div className="max-w-4xl w-full mx-auto p-4 md:p-8">
              <DataTable<TourGuide, unknown>
                columns={columns(handleViewTourGuide, handleViewDocuments)}
                data={filteredData}
                searchPlaceholder="Search by name..."
                searchColumn="first_name"
              />
            </div>
          </div>
        </div>
      </div>
      {/* View Dialog */}
      <Dialog
        open={!!dialogTourGuide}
        onOpenChange={() => setDialogTourGuide(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1c5461]">
              Tour Guide Details
            </DialogTitle>
            <DialogDescription>
              View and manage tour guide details.
            </DialogDescription>
          </DialogHeader>
          {dialogTourGuide && <ViewTourGuide tourGuide={dialogTourGuide} />}
        </DialogContent>
      </Dialog>
    </main>
  );
}
