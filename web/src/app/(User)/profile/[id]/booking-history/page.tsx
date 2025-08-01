"use client";
import React, { useEffect, useState } from "react";
import { useBookingsByTourist } from "@/hooks/useBookingManager";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { OperatorFeedbackModal } from "@/components/custom/booking-history/OperatorFeedbackModal";
import { GuideFeedbackModal } from "@/components/custom/booking-history/GuideFeedbackModal";

export default function BookingHistoryPage() {
  const { loggedInUser } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const {
    data: bookings,
    fetchByTourist,
    loading,
    error,
  } = useBookingsByTourist();
  const router = useRouter();
  const [operatorFeedbackOpen, setOperatorFeedbackOpen] = useState<null | {
    bookingId: number;
    operatorId: number;
    operatorName: string;
  }>(null);
  const [guideFeedbackOpen, setGuideFeedbackOpen] = useState<null | {
    bookingId: number;
    guideId: number;
    guideName: string;
  }>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await loggedInUser(router);
      if (res?.data?.user?.id) {
        setUserId(res.data.user.id);
      }
      fetchByTourist(res.data.user.user_id);
    }
    fetchUser();
  }, [loggedInUser, router, fetchByTourist, userId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#e6f7fa]">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#1c5461]">
            Loading booking history...
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
          Booking History
        </h1>
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={`${booking.id}-${booking.created_at}`}
              className="bg-[#f8fcfd] rounded-xl border border-[#e6f7fa] shadow flex flex-col md:flex-row items-stretch justify-between p-6"
            >
              {/* Left: Booking Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-[#1c5461]">
                      Booking: {booking.id}
                    </h2>
                    <span
                      className={`text-xs text-start  font-semibold px-3 py-1 rounded-full ${
                        booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "FINISHED"
                          ? "bg-[#51702c] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="font-bold text-lg text-[#1c5461] mb-1">
                  {booking.package_name || booking.tour_package_id}
                </div>
                <div className="font-semibold text-[#51702c] mb-1">
                  Scheduled Date:{" "}
                  {booking.scheduled_date
                    ? new Date(booking.scheduled_date).toLocaleDateString()
                    : "N/A"}
                </div>
                <div className="text-[#3e979f] text-sm mb-1">
                  Guests:{" "}
                  <span className="font-mono">{booking.number_of_guests}</span>
                </div>
                <div className="text-[#3e979f] text-sm mb-1">
                  Total Price:{" "}
                  <span className="font-mono">₱{booking.total_price}</span>
                </div>
                <div className="text-[#3e979f] text-sm mb-1">
                  Tour Operator:{" "}
                  <span className="font-mono">
                    {booking.tour_operator_name || "N/A"}
                  </span>
                </div>
                {(
                  booking.tour_guides as
                    | {
                        tourguide_id: number;
                        first_name: string;
                        last_name: string;
                      }[]
                    | undefined
                )?.length > 0 && (
                  <div className="text-[#3e979f] text-sm mb-1">
                    Tour Guide
                    {(
                      booking.tour_guides as {
                        tourguide_id: number;
                        first_name: string;
                        last_name: string;
                      }[]
                    ).length > 1
                      ? "s"
                      : ""}
                    :{" "}
                    {(
                      booking.tour_guides as {
                        tourguide_id: number;
                        first_name: string;
                        last_name: string;
                      }[]
                    )
                      .map((g) =>
                        g.first_name && g.last_name
                          ? `${g.first_name} ${g.last_name}`
                          : null
                      )
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </div>
                )}
                {booking.status === "FINISHED" && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {(
                      booking.tour_guides as
                        | {
                            tourguide_id: number;
                            first_name: string;
                            last_name: string;
                          }[]
                        | undefined
                    )?.map((g) => (
                      <button
                        key={g.tourguide_id + "-" + booking.id}
                        className="px-3 py-1 bg-[#51702c] text-white rounded hover:bg-[#3e979f] text-sm transition"
                        onClick={() => {
                          setGuideFeedbackOpen({
                            bookingId: booking.id,
                            guideId: g.tourguide_id,
                            guideName: `${g.first_name} ${g.last_name}`,
                          });
                        }}
                      >
                        Leave Feedback for Tour Guide: {g.first_name}{" "}
                        {g.last_name}
                      </button>
                    ))}
                    <button
                      className="px-3 py-1 bg-[#3e979f] text-white rounded hover:bg-[#1c5461] text-sm transition"
                      onClick={() =>
                        setOperatorFeedbackOpen({
                          bookingId: booking.id,
                          operatorId: booking.touroperator_id,
                          operatorName:
                            booking.tour_operator_name || "Tour Operator",
                        })
                      }
                    >
                      Leave Feedback for Tour Operator
                    </button>
                  </div>
                )}
                <div className="mt-4 flex flex-col items-start gap-2">
                  <span className="text-xs text-gray-400">
                    Booked: {new Date(booking.created_at).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">
                    Updated: {new Date(booking.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
              {/* Right: Proof of Payment */}
              <div className="flex items-center justify-center md:ml-8 mt-6 md:mt-0">
                {booking.proof_of_payment && (
                  <div className="bg-white p-2 rounded-lg border-2 border-[#e6f7fa] shadow">
                    <img
                      src={booking.proof_of_payment}
                      alt="Proof of Payment"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-[#51702c] py-12">
            <svg
              className="mx-auto mb-4 w-16 h-16 text-blue-100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m10.5 0v10.5A2.25 2.25 0 0116.5 21h-9a2.25 2.25 0 01-2.25-2.25V9m13.5 0H4.5m13.5 0V7.5A2.25 2.25 0 0015.75 5.25h-7.5A2.25 2.25 0 006 7.5V9"
              />
            </svg>
            <span className="block text-lg font-medium">
              No bookings found.
            </span>
          </div>
        )}
        {/* Feedback Modals */}
        <OperatorFeedbackModal
          open={!!operatorFeedbackOpen}
          onClose={() => setOperatorFeedbackOpen(null)}
          bookingId={operatorFeedbackOpen?.bookingId || null}
          operatorId={operatorFeedbackOpen?.operatorId || undefined}
          operatorName={operatorFeedbackOpen?.operatorName || "Tour Operator"}
        />
        {guideFeedbackOpen && (
          <GuideFeedbackModal
            open={true}
            onClose={() => setGuideFeedbackOpen(null)}
            bookingId={guideFeedbackOpen.bookingId}
            guideId={guideFeedbackOpen.guideId}
            guideName={guideFeedbackOpen.guideName}
          />
        )}
      </div>
    </div>
  );
}
