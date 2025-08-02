"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOperatorQrManager } from "@/hooks/useOperatorQr";
import { useCreateBooking } from "@/hooks/useBookingManager";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import Header from "@/components/custom/header";
import BookingSchema from "@/app/static/booking/bookingSchema";
import { bookingFields } from "@/app/static/booking/booking";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/custom/footer";
import Image from "next/image";
// Types matching your API response
type TourPackage = {
  id: number;
  touroperator_id: number;
  package_name: string;
  location: string;
  description: string;
  price: string;
  duration_days: number;
  inclusions: string;
  exclusions: string;
  available_slots: number;
  date_start: string;
  date_end: string;
  start_time: string;
  end_time: string;
  cancellation_days: number;
  cancellation_note: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tourguide_id: number | null;
};

type QrData = {
  id: number;
  qr_image_url: string;
  qr_name: string;
  tour_operator_id: number;
  created_at: string;
};

type Companion = {
  first_name: string;
  last_name: string;
  age: number;
  sex: string;
  phone_number: string;
};

type BookingForm = {
  scheduled_date: string;
  number_of_guests: number;
  total_price: number;
  proof_of_payment: File | null;
  notes: string;
  companions: Companion[]; // <-- add this
  [key: string]: string | number | File | null | Companion[];
};

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;
  const { loggedInUser } = useAuth();
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
  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [qrData, setQrData] = useState<QrData | null>(null);
  const [form, setForm] = useState<BookingForm>({
    scheduled_date: "",
    number_of_guests: 1,
    total_price: 0,
    proof_of_payment: null,
    notes: "",
    companions: [], // <-- initialize
  });
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch tour package and QR code on mount
  useEffect(() => {
    async function checkUser() {
      const user = await loggedInUser(router);
      if (!user) {
        router.push("/auth/login");
        return;
      }
    }

    async function fetchPackageAndQr() {
      const pkg = await fetchTourPackage(packageId);
      if (pkg) {
        setTourPackage(pkg); // No normalization needed if API matches type
        setForm((prev) => ({
          ...prev,
          total_price: Number(pkg.price) * (prev.number_of_guests || 1),
        }));
        const operatorId = pkg.touroperator_id;
        if (operatorId) {
          try {
            const qr = await fetchQr(String(operatorId));
            setQrData(
              Array.isArray(qr?.data) && qr.data.length > 0
                ? (qr.data[0] as QrData)
                : null
            );
          } catch {
            setQrData(null);
          }
        }
      }
    }
    checkUser();
    fetchPackageAndQr();
  }, [packageId, fetchTourPackage, fetchQr, loggedInUser, router]);

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
    if (!qrData || !tourPackage) {
      setFormError("Payment QR code or package data not available.");
      return;
    }

    // Prepare booking data
    const bookingData = {
      ...form,
      scheduled_date: tourPackage.date_start,
      package_id: tourPackage.id,
      operator_qr_id: qrData.id,
      payment_method: "QR",
      companions: form.companions, // <-- include companions
    };

    // If proof_of_payment is a file, use FormData
    let payload: FormData | typeof bookingData = bookingData;
    if (form.proof_of_payment) {
      payload = new FormData();
      Object.entries(bookingData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Stringify companions array before appending
          if (key === "companions") {
            (payload as FormData).append(key, JSON.stringify(value));
          } else {
            (payload as FormData).append(key, value as Blob | string);
          }
        }
      });
    }

    try {
      await create(payload);
      alert("Booking successful!");
      router.push("/tour-packages");
    } catch (err) {
      setFormError("Booking failed. Please try again." + err);
    }
  };

  return (
    <>
      <Header />
      <main className="w-full pt-20 min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] flex flex-col items-center pb-20">
        {/* Hero Section */}
        <section className="relative h-56 w-full flex items-center justify-center overflow-hidden mb-10">
          <div className="absolute inset-0">
            <Image
              src="/images/article_image.webp"
              alt="Book Tour Package"
              width={500}
              height={500}
              className="w-full h-full object-cover object-center brightness-[40%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c5461]/80 via-[#1c5461]/40 to-transparent" />
          </div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-xl mb-2">
              Book Your Adventure
            </h1>
            <p className="text-md md:text-lg text-[#51702c] drop-shadow-md max-w-xl mx-auto">
              Secure your spot and pay easily via QR code.
            </p>
          </div>
        </section>

        <section className="w-full flex justify-center">
          <div className="max-w-lg w-full bg-white/90 rounded-2xl shadow-2xl border border-[#e6f7fa] p-8">
            <h2 className="text-2xl font-bold text-[#1c5461] mb-6 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-[#3e979f]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>
              Book: {tourPackage?.package_name || "Loading..."}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              {bookingFields.map((field) =>
                field.type === "file" ? null : (
                  <div key={field.name}>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      {field.label}
                    </label>
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
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                      />
                    ) : field.name === "total_price" ? (
                      <input
                        type="number"
                        name="total_price"
                        value={form.total_price}
                        readOnly
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                      />
                    ) : field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        value={(form[field.name] as string) || ""}
                        onChange={handleChange}
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2"
                        rows={3}
                      />
                    ) : (
                      <>
                        {field.name === "number_of_guests" && tourPackage && (
                          <p className="text-xs text-gray-600 mb-1">
                            Maximum Guests: {tourPackage.available_slots}
                          </p>
                        )}
                        <input
                          type={field.type}
                          name={field.name}
                          value={
                            form[field.name] !== undefined &&
                            form[field.name] !== null &&
                            typeof form[field.name] !== "object"
                              ? form[field.name]
                              : field.type === "number"
                              ? 1
                              : ""
                          }
                          onChange={handleChange}
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2"
                          min={field.type === "number" ? 1 : undefined}
                          max={
                            field.type === "number" &&
                            tourPackage &&
                            field.name === "number_of_guests"
                              ? tourPackage.available_slots
                              : undefined
                          }
                          required={field.name !== "notes"}
                        />
                      </>
                    )}
                  </div>
                )
              )}

              {form.number_of_guests > 1 && (
                <div className="space-y-6">
                  <h3 className="font-bold text-[#1c5461] text-lg flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[#3e979f]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-7.13a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 10-8 0 4 4 0 008 0z"
                      />
                    </svg>
                    Companion Details
                  </h3>
                  {[...Array(form.number_of_guests - 1)].map((_, idx) => (
                    <div key={idx} className="p-4 flex flex-col gap-4">
                      <h4 className="font-semibold text-[#1c5461]">
                        Companion {idx + 1}
                      </h4>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-[#3e979f] mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            placeholder="First Name"
                            value={form.companions[idx]?.first_name || ""}
                            onChange={(e) => {
                              const companions = [...form.companions];
                              companions[idx] = {
                                ...companions[idx],
                                first_name: e.target.value,
                              };
                              setForm((f) => ({ ...f, companions }));
                            }}
                            className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] transition"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-[#3e979f] mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={form.companions[idx]?.last_name || ""}
                            onChange={(e) => {
                              const companions = [...form.companions];
                              companions[idx] = {
                                ...companions[idx],
                                last_name: e.target.value,
                              };
                              setForm((f) => ({ ...f, companions }));
                            }}
                            className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] transition"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/4">
                          <label className="block text-xs font-semibold text-[#3e979f] mb-1">
                            Age
                          </label>
                          <input
                            type="number"
                            placeholder="Age"
                            value={form.companions[idx]?.age || ""}
                            onChange={(e) => {
                              const companions = [...form.companions];
                              companions[idx] = {
                                ...companions[idx],
                                age: Number(e.target.value),
                              };
                              setForm((f) => ({ ...f, companions }));
                            }}
                            className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] transition"
                            required
                          />
                        </div>
                        <div className="w-full md:w-1/4">
                          <label className="block text-xs font-semibold text-[#3e979f] mb-1">
                            Sex
                          </label>
                          <select
                            value={form.companions[idx]?.sex || ""}
                            onChange={(e) => {
                              const companions = [...form.companions];
                              companions[idx] = {
                                ...companions[idx],
                                sex: e.target.value,
                              };
                              setForm((f) => ({ ...f, companions }));
                            }}
                            className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] transition"
                            required
                          >
                            <option value="">Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-[#3e979f] mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            placeholder="Phone Number"
                            value={form.companions[idx]?.phone_number || ""}
                            onChange={(e) => {
                              const companions = [...form.companions];
                              companions[idx] = {
                                ...companions[idx],
                                phone_number: e.target.value,
                              };
                              setForm((f) => ({ ...f, companions }));
                            }}
                            className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] transition"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Section */}
              <div>
                <label className="block font-semibold mb-2 text-[#1c5461]">
                  Pay via QR Code
                </label>
                <div className="flex flex-col items-center">
                  {qrLoading ? (
                    <p className="text-gray-500">Loading QR code...</p>
                  ) : qrError ? (
                    <p className="text-red-500">Failed to load QR code.</p>
                  ) : qrData ? (
                    <>
                      <Image
                        src={qrData.qr_image_url}
                        alt="Operator QR Code"
                        width={160}
                        height={160}
                        className="w-40 h-40 object-contain border-2 border-[#3e979f] rounded mb-2"
                      />
                      <span className="text-sm text-gray-600 mb-2">
                        Scan this QR code to pay the package fee.
                      </span>
                    </>
                  ) : (
                    <p className="text-gray-500">No QR code available.</p>
                  )}
                </div>
              </div>
              {/* Proof of Payment input moved below QR code */}
              <div>
                <label className="block font-semibold mb-2 text-[#1c5461]">
                  Proof of Payment
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="w-full"
                />
              </div>
              {formError && <p className="text-red-600 text-sm">{formError}</p>}
              {bookingError && (
                <p className="text-red-600 text-sm">{bookingError}</p>
              )}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#3e979f] text-white hover:bg-[#1c5461] transition font-bold text-lg py-3 shadow"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Book Now"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
