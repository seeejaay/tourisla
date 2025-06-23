"use client";

import React, { useState, useEffect } from "react";
import { columns, TourGuide } from "@/components/custom/tour-guide/column";
import DataTable from "@/components/custom/data-table";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { useRouter } from "next/navigation";
import ViewTourGuide from "@/components/custom/tour-guide/viewTourGuide";

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

  const {
    fetchAllTourGuideApplicants,
    fetchTourGuideApplicant,
    approveTourGuideApplicant,
    rejectTourGuideApplicant,
  } = useTourGuideManager();
  const router = useRouter();

  useEffect(() => {
    async function fetchGuides() {
      const guides = await fetchAllTourGuideApplicants();
      setData(
        (guides || []).map((guide: any) => ({
          id: guide.id,
          first_name: guide.first_name,
          last_name: guide.last_name,
          birth_date: guide.birth_date,
          sex: guide.sex,
          mobile_number: guide.mobile_number,
          email: guide.email,
          reason_for_applying: guide.reason_for_applying,
          profile_picture: guide.profile_picture,
          application_status: guide.application_status ?? "pending",
          user_id: guide.user_id,
        }))
      );
    }
    fetchGuides();
  }, [fetchAllTourGuideApplicants]);

  // Handler for viewing a tour guide (fetches latest data)
  const handleViewTourGuide = async (guide: TourGuide | null) => {
    if (!guide?.id) return;
    const freshGuide = await fetchTourGuideApplicant(guide.user_id.toString());
    setDialogTourGuide(freshGuide);
  };

  // Handler for viewing documents
  const handleViewDocuments = (guide: TourGuide) => {
    router.push(`tour-guides/${guide.user_id}/documents`);
  };

  // Handler for approving a tour guide
  const handleApprove = async (guide: TourGuide) => {
    await approveTourGuideApplicant(guide.id);
    const guides = await fetchAllTourGuideApplicants();
    setData(guides || []);
  };

  // Handler for rejecting a tour guide
  const handleReject = async (guide: TourGuide) => {
    await rejectTourGuideApplicant(guide.id);
    const guides = await fetchAllTourGuideApplicants();
    setData(guides || []);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tour Guides</h1>
      <DataTable<TourGuide, unknown>
        columns={columns(
          handleViewTourGuide,
          handleViewDocuments,
          handleApprove,
          handleReject,
          router
        )}
        data={data}
        searchPlaceholder="Search by name..."
        searchColumn="first_name"
      />
      {/* Render your dialog/modal for viewing a tour guide */}
      {dialogTourGuide && (
        <Dialog
          open={!!dialogTourGuide}
          onOpenChange={() => setDialogTourGuide(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tour Guide Details</DialogTitle>
              <DialogDescription>
                View and manage tour guide details.
              </DialogDescription>
            </DialogHeader>
            <ViewTourGuide tourGuide={dialogTourGuide} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
