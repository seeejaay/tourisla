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
  const {
    data: bookingDetails,
    fetchById,
    loading: detailsLoading,
  } = useBookingById();

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
  const handleViewDetails = async (bookingId: string | number) => {
    setDetailsOpen(true);
    await fetchById(bookingId);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center py-12 px-4 sm:px-6 w-full">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bookings for Your Tour Packages
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800">Loading Error</h3>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
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
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-semibold text-lg">
                    {booking.package_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Tourist: {booking.tourist_name || booking.tourist_id}
                  </div>
                  <div className="text-sm text-gray-500">
                    Guests: {booking.number_of_guests}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total: ₱{booking.total_price}
                  </div>
                  <div className="text-sm text-gray-500">
                    Status:{" "}
                    <span className="font-medium">{booking.status}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Scheduled: {booking.scheduled_date}
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
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      disabled={updating || booking.status === "Approved"}
                      onClick={() => handleApprove(booking.id)}
                    >
                      {updating ? "Approving..." : "Approve"}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      disabled={updating || booking.status === "Rejected"}
                      onClick={() => handleReject(booking.id)}
                    >
                      {updating ? "Rejecting..." : "Reject"}
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      disabled={completing}
                      onClick={() => handleComplete(booking.id)}
                    >
                      {completing ? "Completing..." : "Complete"}
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                      onClick={() => handleViewDetails(booking.id)}
                    >
                      View Details
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
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={closeDetails}
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
                  <h2 className="text-xl font-bold mb-2">Booking Details</h2>
                  <div className="mb-2">
                    Package: {bookingDetails.package_name}
                  </div>
                  <div className="mb-2">
                    Tourist:{" "}
                    {bookingDetails.tourist_name || bookingDetails.tourist_id}
                  </div>
                  <div className="mb-2">
                    Guests: {bookingDetails.number_of_guests}
                  </div>
                  <div className="mb-2">
                    Total: ₱{bookingDetails.total_price}
                  </div>
                  <div className="mb-2">Status: {bookingDetails.status}</div>
                  <div className="mb-2">
                    Scheduled: {bookingDetails.scheduled_date}
                  </div>
                  <div className="mb-2">Notes: {bookingDetails.notes}</div>
                  {bookingDetails.proof_of_payment && (
                    <div className="mb-2">
                      Proof:{" "}
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
    </div>
  );
}
