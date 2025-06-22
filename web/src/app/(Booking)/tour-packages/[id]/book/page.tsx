"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOperatorQrManager } from "@/hooks/useOperatorQr";
import { useCreateBooking } from "@/hooks/useBookingManager";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import Header from "@/components/custom/header";
import BookingSchema from "@/app/static/booking/bookingSchema";
import { bookingFields } from "@/app/static/booking/booking";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  // Hooks
  const { fetchOne: fetchTourPackage } = useTourPackageManager();
  const {
    fetchQr,
    loading: qrLoading,
    error: qrError,
  } = useOperatorQrManager();
  const {
    create,
    loading: bookingLoading,
    error: bookingError,
  } = useCreateBooking();

  // State
  const [tourPackage, setTourPackage] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({
    scheduled_date: "",
    number_of_guests: 1,
    total_price: 0,
    proof_of_payment: null,
    notes: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch tour package and QR code on mount
  useEffect(() => {
    async function fetchPackageAndQr() {
      const pkg = await fetchTourPackage(packageId);
      if (pkg) {
        setTourPackage(pkg);
        setForm((prev) => ({
          ...prev,
          total_price: Number(pkg.price) * (prev.number_of_guests || 1),
        }));
        // Use correct property for operator ID
        const operatorId = pkg.touroperator_id || pkg.tour_operator_id;
        if (operatorId) {
          try {
            const qr = await fetchQr(String(operatorId));
            setQrData(qr?.data?.[0] || null);
          } catch {
            setQrData(null);
          }
        }
      }
    }
    fetchPackageAndQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId, fetchTourPackage, fetchQr]);

  // Dynamically update total_price when number_of_guests changes
  useEffect(() => {
    if (tourPackage) {
      setForm((prev) => ({
        ...prev,
        total_price: Number(tourPackage.price) * (prev.number_of_guests || 1),
      }));
    }
  }, [form.number_of_guests, tourPackage]);

  // Handle form input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    setFormError(null);
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({
        ...prev,
        proof_of_payment: e.target.files![0],
      }));
    }
  };

  // Handle booking submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Zod validation
    const result = BookingSchema.safeParse(form);
    if (!result.success) {
      const errorMessages = Object.values(result.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean)
        .join("\n");
      setFormError(errorMessages || "Invalid input.");
      return;
    }
    if (!qrData) {
      setFormError("Payment QR code not available.");
      return;
    }

    // Prepare booking data
    const bookingData: any = {
      ...form,
      scheduled_date: tourPackage.date_start,
      package_id: tourPackage.id,
      operator_qr_id: qrData.id,
      payment_method: "QR",
    };

    // If proof_of_payment is a file, use FormData
    let payload: any = bookingData;
    if (form.proof_of_payment) {
      payload = new FormData();
      Object.entries(bookingData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });
    }

    try {
      await create(payload);
      alert("Booking successful!");
      router.push("/booking/tour-packages");
    } catch (err) {
      setFormError("Booking failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <main className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 mt-12 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Book: {tourPackage?.package_name || "Loading..."}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {bookingFields.map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-1">{field.label}</label>
                {field.name === "scheduled_date" ? (
                  <input
                    type="date"
                    name="scheduled_date"
                    value={
                      tourPackage?.date_start
                        ? new Date(tourPackage.date_start)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                ) : field.name === "total_price" ? (
                  <input
                    type="number"
                    name="total_price"
                    value={form.total_price}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                ) : field.type === "file" ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={
                      form[field.name] || (field.type === "number" ? 1 : "")
                    }
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    min={field.type === "number" ? 1 : undefined}
                    required={field.name !== "notes"}
                  />
                )}
              </div>
            ))}
            {/* Payment Section */}
            <div>
              <label className="block font-medium mb-1">Pay via QR Code</label>
              {qrLoading ? (
                <p className="text-gray-500">Loading QR code...</p>
              ) : qrError ? (
                <p className="text-red-500">Failed to load QR code.</p>
              ) : qrData ? (
                <div className="flex flex-col items-center">
                  <img
                    src={qrData.qr_image_url}
                    alt="Operator QR Code"
                    className="w-40 h-40 object-contain border-2 border-blue-200 rounded mb-2"
                  />
                  <span className="text-sm text-gray-600 mb-2">
                    Scan this QR code to pay the package fee.
                  </span>
                </div>
              ) : (
                <p className="text-gray-500">No QR code available.</p>
              )}
            </div>
            {formError && <p className="text-red-600 text-sm">{formError}</p>}
            {bookingError && (
              <p className="text-red-600 text-sm">{bookingError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
