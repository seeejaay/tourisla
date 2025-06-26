"use client";
import React, { useEffect, useState } from "react";
import { useBookingsByTourist } from "@/hooks/useBookingManager";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">
        Booking History
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
      <ul className="space-y-6">
        {bookings && bookings.length > 0
          ? bookings.map((booking) => (
              <li
                key={booking.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      #{booking.id}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold text-gray-700">
                      Package:
                    </span>{" "}
                    <span className="text-blue-900">
                      {booking.package_name || booking.tour_package_id}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold text-gray-700">
                      Scheduled Date:
                    </span>{" "}
                    <span className="text-gray-800">
                      {booking.scheduled_date
                        ? new Date(booking.scheduled_date).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold text-gray-700">Guests:</span>{" "}
                    <span className="text-gray-800">
                      {booking.number_of_guests}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold text-gray-700">
                      Total Price:
                    </span>{" "}
                    <span className="text-gray-800">
                      ₱{booking.total_price}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold text-gray-700">
                      Tour Operator:
                    </span>{" "}
                    <span className="text-gray-800">
                      {booking.tour_operator_name || 'N/A'}
                    </span>
                  </div>
                  {booking.tour_guides && booking.tour_guides.length > 0 && (
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">
                        Tour Guide{booking.tour_guides.length > 1 ? 's' : ''}:
                      </span>{" "}
                      <span className="text-gray-800">
                        {booking.tour_guides
                          .map(
                            (g: { first_name: string; last_name: string }) =>
                              g.first_name && g.last_name
                                ? `${g.first_name} ${g.last_name}`
                                : null
                          )
                          .filter(Boolean)
                          .join(", ") || 'N/A'}
                      </span>
                    </div>
                  )}
                  {booking.proof_of_payment && (
                    <div className="mt-2">
                      <a
                        href={booking.proof_of_payment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Proof of Payment
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-400">
                    Booked: {new Date(booking.created_at).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">
                    Updated: {new Date(booking.updated_at).toLocaleString()}
                  </span>
                </div>
              </li>
            ))
          : !loading && (
              <div className="text-center text-gray-500 py-12">
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
      </ul>
    </div>
  );
}
