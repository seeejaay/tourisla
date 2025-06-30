"use client";

import React, { useEffect, useState } from "react";
import {
  useUpdateBookingStatus,
  useCompleteBooking,
  useBookingById,
  useBookingsByOperator,
} from "@/hooks/useBookingManager";
import { useParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";

export default function Bookings() {
  const {
    data: bookings,
    fetchByOperator,
    loading,
    error,
  } = useBookingsByOperator();
  const { updateStatus, loading: updating } = useUpdateBookingStatus();
  const { complete, loading: completing } = useCompleteBooking();
  const { data: bookingDetails, loading: detailsLoading } = useBookingById();

  const [detailsOpen, setDetailsOpen] = useState(false);

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) fetchByOperator(id);
  }, [id, fetchByOperator]);

  // Approve booking
  const handleApprove = async (bookingId: string | number) => {
    await updateStatus(bookingId, "Approved");
    fetchByOperator(id);
  };

  // Reject booking
  const handleReject = async (bookingId: string | number) => {
    await updateStatus(bookingId, "Rejected");
    fetchByOperator(id);
  };

  // Complete booking
  const handleComplete = async (bookingId: string | number) => {
    await complete(bookingId);
    fetchByOperator(id);
  };

  // View details

  const closeDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-3xl font-extrabold text-[#1c5461] tracking-tight mb-4">
          Bookings for Your Tour Packages
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100 max-w-md mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800">Loading Error</h3>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-1 text-gray-500 mb-6">
              You currently have no bookings for your tour packages.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-[#e6f7fa] rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-bold text-lg text-[#1c5461]">
                    {booking.package_name}
                  </div>
                  <div className="text-sm text-[#51702c]">
                    Tourist:{" "}
                    <span className="font-medium">
                      {booking.tourist_name || booking.tourist_id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Guests: {booking.number_of_guests}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total:{" "}
                    <span className="font-semibold text-[#3e979f]">
                      ₱{booking.total_price}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        booking.status === "Approved"
                          ? "text-green-600"
                          : booking.status === "Rejected"
                          ? "text-red-600"
                          : booking.status === "Pending"
                          ? "text-yellow-600"
                          : "text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Scheduled:{" "}
                    {booking.scheduled_date
                      ? new Date(booking.scheduled_date).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "-"}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  {booking.proof_of_payment && (
                    <a
                      href={booking.proof_of_payment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm mb-2"
                    >
                      View Proof of Payment
                    </a>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-semibold transition"
                      disabled={updating || booking.status === "Approved"}
                      onClick={() => handleApprove(booking.id)}
                    >
                      {updating ? "Approving..." : "Approve"}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-semibold transition"
                      disabled={updating || booking.status === "Rejected"}
                      onClick={() => handleReject(booking.id)}
                    >
                      {updating ? "Rejecting..." : "Reject"}
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-semibold transition"
                      disabled={completing}
                      onClick={() => handleComplete(booking.id)}
                    >
                      {completing ? "Completing..." : "Complete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Details Modal */}
        {detailsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={closeDetails}
                aria-label="Close"
              >
                ×
              </button>
              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-gray-600 mt-2">Loading details...</p>
                </div>
              ) : bookingDetails ? (
                <div>
                  <h2 className="text-xl font-bold mb-2 text-[#1c5461]">
                    Booking Details
                  </h2>
                  <div className="mb-2">
                    <span className="font-semibold">Package:</span>{" "}
                    {bookingDetails.package_name}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Tourist:</span>{" "}
                    {bookingDetails.tourist_name || bookingDetails.tourist_id}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Guests:</span>{" "}
                    {bookingDetails.number_of_guests}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Total:</span> ₱
                    {bookingDetails.total_price}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    {bookingDetails.status}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Scheduled:</span>{" "}
                    {bookingDetails.scheduled_date
                      ? new Date(
                          bookingDetails.scheduled_date
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Notes:</span>{" "}
                    {bookingDetails.notes}
                  </div>
                  {bookingDetails.proof_of_payment && (
                    <div className="mb-2">
                      <span className="font-semibold">Proof:</span>{" "}
                      <a
                        href={bookingDetails.proof_of_payment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Proof of Payment
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-600">No details found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
