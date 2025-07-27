"use client";

import React, { useCallback, useState, useMemo } from "react";
import {
  useUpdateBookingStatus,
  useCompleteBooking,
  useBookingsByOperator,
} from "@/hooks/useBookingManager";
import { useParams } from "next/navigation";
import {
  Loader2,
  AlertTriangle,
  Check,
  Clock,
  Ban,
  Calendar,
  Users,
  CreditCard,
  User,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { DialogTitle } from "@radix-ui/react-dialog";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Pending",
  },
  approved: {
    color: "bg-blue-100 text-blue-800",
    icon: Check,
    label: "Verified",
  },
  rejected: { color: "bg-red-100 text-red-800", icon: Ban, label: "Rejected" },
  complete: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Completed",
  },
  completed: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Completed",
  },
  finished: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Completed",
  },
};

export default function Bookings() {
  const {
    data: bookings,
    fetchByOperator,
    loading,
    error,
  } = useBookingsByOperator();
  const { updateStatus } = useUpdateBookingStatus();
  const { complete } = useCompleteBooking();
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [completingId, setCompletingId] = useState<string | number | null>(
    null
  );
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const [updatingAction, setUpdatingAction] = useState<null | {
    id: string | number;
    action: string;
  }>(null);
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter((booking) => {
      const status = booking.status?.toLowerCase();
      switch (activeTab) {
        case "Complete":
          return ["complete", "completed", "finished"].includes(status);
        default:
          return status === activeTab.toLowerCase();
      }
    });
  }, [bookings, activeTab]);

  React.useEffect(() => {
    if (id) fetchByOperator(id);
  }, [id, fetchByOperator]);

  const handleStatusUpdate = useCallback(
    async (bookingId: string | number, status: string) => {
      setUpdatingId(bookingId);
      await updateStatus(bookingId, status);
      setUpdatingId(null);
      fetchByOperator(id ?? "");
    },
    [updateStatus, fetchByOperator, id]
  );

  const handleComplete = useCallback(
    async (bookingId: string | number) => {
      setCompletingId(bookingId);
      await complete(bookingId);
      setCompletingId(null);
      fetchByOperator(id ?? "");
    },
    [complete, fetchByOperator, id]
  );

  const openImageModal = useCallback(
    (imageUrl: string) => setEnlargedImage(imageUrl),
    []
  );
  const closeImageModal = useCallback(() => setEnlargedImage(null), []);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Booking Management
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Review and manage all bookings for your tour packages in one place
        </p>
      </header>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="grid gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto">
          <Card className="border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-800">Loading Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg h-auto">
              {["Pending", "Approved", "Rejected", "Complete"].map((tab) => {
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="flex flex-col items-center gap-1 text-sm font-medium text-gray-700 hover:bg-gray-200  cursor-pointer rounded-lg transition-colors"
                  >
                    <span>{tab}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {filteredBookings.length === 0 ? (
            <Card className="max-w-md mx-auto text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-gray-400" />
                </div>
                <CardTitle>No {activeTab.toLowerCase()} bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  When you have {activeTab.toLowerCase()} bookings, they&apos;ll
                  appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBookings.map((booking) => {
                const statusKey =
                  booking.status.toLowerCase() as keyof typeof statusConfig;
                const status =
                  statusConfig[statusKey] || statusConfig["pending"];
                const StatusIcon = status.icon;
                return (
                  <Card
                    key={booking.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">
                          {booking.package_name}
                        </CardTitle>
                        <Badge
                          className={`${status.color} flex items-center gap-1 text-xs capitalize`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {format(
                          new Date(booking.scheduled_date),
                          "MMM d, yyyy"
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        {booking.location}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Tourist</p>
                          <p className="font-medium">
                            {booking.first_name} {booking.last_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Guests</p>
                          <p className="font-medium">
                            {booking.number_of_guests}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="font-medium text-emerald-600">
                            ₱{booking.total_price}
                          </p>
                        </div>
                      </div>

                      {booking.proof_of_payment && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 mb-2">
                            Proof of Payment
                          </p>
                          <div
                            className="relative w-full h-40 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition border"
                            onClick={() =>
                              openImageModal(booking.proof_of_payment || "")
                            }
                          >
                            <Image
                              src={booking.proof_of_payment}
                              alt="Proof of payment"
                              fill
                              className="object-cover"
                              priority
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2 pt-4">
                      {activeTab === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setUpdatingAction({
                                id: booking.id,
                                action: "Approved",
                              });
                              handleStatusUpdate(booking.id, "Approved");
                            }}
                            disabled={updatingAction?.id === booking.id}
                          >
                            {updatingAction?.id === booking.id &&
                            updatingAction?.action === "Approved" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Approve"
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setUpdatingAction({
                                id: booking.id,
                                action: "Rejected",
                              });
                              handleStatusUpdate(booking.id, "Rejected");
                            }}
                            disabled={updatingAction?.id === booking.id}
                          >
                            {updatingAction?.id === booking.id &&
                            updatingAction?.action === "Rejected" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        </>
                      )}
                      {activeTab === "Approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleComplete(booking.id)}
                          disabled={completingId === booking.id}
                        >
                          {completingId === booking.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Complete"
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      <Dialog
        open={!!enlargedImage}
        onOpenChange={(open) => !open && closeImageModal()}
      >
        <DialogContent className="max-w-2xl w-full bg-white border-none p-0 rounded-lg">
          <div className="flex flex-col">
            <DialogTitle className="flex items-center justify-between px-6 pt-6">
              <span className="text-lg font-semibold text-gray-900">
                Proof of Payment
              </span>
            </DialogTitle>
            <div className="flex items-center justify-center px-6 pb-6 pt-2">
              {enlargedImage && (
                <div className="relative w-full h-[60vh]">
                  <Image
                    src={enlargedImage}
                    alt="Proof of payment"
                    fill
                    className="object-contain rounded-lg"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
