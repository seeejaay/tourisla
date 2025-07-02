"use client";

import { useState, useEffect } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { TourPackage } from "@/app/static/tour-packages/tour-packageSchema";
import { useParams } from "next/navigation";

export default function EditTourPackage({
  tourPackage,
  onSuccess,
  onCancel,
}: {
  tourPackage: TourPackage;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { edit, loading, error } = useTourPackageManager();
  const { fetchAllTourGuideApplicants } = useTourGuideManager();
  const params = useParams();
  const touroperator_id = Array.isArray(params.id) ? params.id[0] : params.id;

  type TourGuide = {
    id: string;
    first_name: string;
    last_name: string;
    application_status?: string;
    birth_date: string;
    created_at: string;
    email: string;
    mobile_number: string;
    profile_picture: string;
    reason_for_applying: string;
    sex: string;
    updated_at: string;
    user_id: string;
  };
  const fixTime = (time: string) => (time.length > 5 ? time.slice(0, 5) : time);
  const handleGuideChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedGuides(selected);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "duration_days" ||
        name === "available_slots" ||
        name === "cancellation_days"
          ? Number(value)
          : name === "start_time" || name === "end_time"
          ? fixTime(value)
          : value,
    }));
  };
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<string[]>(
    tourPackage.assigned_guides
      ? tourPackage.assigned_guides.map((g: { tourguide_id: number }) =>
          String(g.tourguide_id)
        )
      : []
  );

  useEffect(() => {
    async function loadGuides() {
      const allGuides = await fetchAllTourGuideApplicants();
      if (!allGuides) {
        setGuides([]);
        return;
      }
      setGuides(
        allGuides
          .map((g: Record<string, unknown>) => ({
            id: g.id !== undefined ? String(g.id) : "",
            first_name: typeof g.first_name === "string" ? g.first_name : "",
            last_name: typeof g.last_name === "string" ? g.last_name : "",
            application_status:
              typeof g.application_status === "string"
                ? g.application_status
                : "",
            birth_date: typeof g.birth_date === "string" ? g.birth_date : "",
            created_at: typeof g.created_at === "string" ? g.created_at : "",
            email: typeof g.email === "string" ? g.email : "",
            mobile_number:
              typeof g.mobile_number === "string" ? g.mobile_number : "",
            profile_picture:
              typeof g.profile_picture === "string" ? g.profile_picture : "",
            reason_for_applying:
              typeof g.reason_for_applying === "string"
                ? g.reason_for_applying
                : "",
            sex: typeof g.sex === "string" ? g.sex : "",
            updated_at: typeof g.updated_at === "string" ? g.updated_at : "",
            user_id: typeof g.user_id === "string" ? g.user_id : "",
          }))
          .filter(
            (g) =>
              g.application_status.toUpperCase() === "APPROVED" &&
              g.user_id !== touroperator_id
          )
      );
    }
    loadGuides();
  }, [fetchAllTourGuideApplicants, touroperator_id]);

  const [form, setForm] = useState<Partial<TourPackage>>({
    ...tourPackage,
    id: tourPackage.id,
    price:
      typeof tourPackage.price === "number"
        ? tourPackage.price
        : Number(tourPackage.price),
    start_time: fixTime(tourPackage.start_time || "09:00"),
    end_time: fixTime(tourPackage.end_time || "17:00"),
    cancellation_note: tourPackage.cancellation_note || "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-compute duration_days based on start and end date
  useEffect(() => {
    if (form.date_start && form.date_end) {
      const start = new Date(form.date_start);
      const end = new Date(form.date_end);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.max(
        Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1,
        1
      );
      if (!isNaN(diffDays)) {
        setForm((prev) => ({
          ...prev,
          duration_days: diffDays,
        }));
      }
    }
  }, [form.date_start, form.date_end]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await edit(
        tourPackage.id, // first argument: id
        {
          ...form,
          touroperator_id,
          assigned_guides: selectedGuides,
        } // second argument: data
      );
      onSuccess();
    } catch (err) {
      setFormError((err as Error)?.message || "Failed to update tour package.");
    }
  };

  return (
    <main className="w-full">
      <div className="p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Package Name & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Package Name
              </label>
              <input
                name="package_name"
                value={form.package_name}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                placeholder="Enter package name"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                placeholder="Enter location"
                required
              />
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block font-semibold mb-2 text-[#1c5461]">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd] min-h-[80px]"
              placeholder="Describe the package"
              required
            />
          </div>
          {/* Price, Duration, Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Price (₱)
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                min={0}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Duration (days)
              </label>
              <input
                name="duration_days"
                type="number"
                value={form.duration_days}
                readOnly
                className="w-full border border-[#3e979f] bg-gray-100 rounded-lg px-3 py-2 text-sm min-h-[42px] cursor-not-allowed"
                min={1}
                required
                tabIndex={-1}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Available Slots
              </label>
              <input
                name="available_slots"
                type="number"
                value={form.available_slots}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                min={1}
                required
              />
            </div>
          </div>
          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Inclusions
              </label>
              <input
                name="inclusions"
                value={form.inclusions}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                placeholder="What's included in the package"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Exclusions
              </label>
              <input
                name="exclusions"
                value={form.exclusions}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                placeholder="What's not included in the package"
                required
              />
            </div>
          </div>
          {/* Dates & Guides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Start Date
              </label>
              <input
                name="date_start"
                type="date"
                value={form.date_start}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                End Date
              </label>
              <input
                name="date_end"
                type="date"
                value={form.date_end}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Assign Tour Guides
              </label>
              <select
                multiple
                value={selectedGuides}
                onChange={handleGuideChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd] min-h-[42px]"
              >
                {guides.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.first_name} {g.last_name}
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple guides
              </div>
            </div>
          </div>
          {/* Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Start Time
              </label>
              <input
                name="start_time"
                type="time"
                value={form.start_time || ""}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                End Time
              </label>
              <input
                name="end_time"
                type="time"
                value={form.end_time || ""}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                required
              />
            </div>
          </div>
          {/* Cancellation Policy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Cancellation Days
              </label>
              <input
                name="cancellation_days"
                type="number"
                value={form.cancellation_days}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                min={0}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-[#1c5461]">
                Cancellation Policy
              </label>
              <input
                name="cancellation_note"
                value={form.cancellation_note}
                onChange={handleChange}
                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                placeholder="E.g., Full refund if cancelled 7 days before"
                required
              />
            </div>
          </div>
          {/* Error messages */}
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow w-full"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="border border-[#e6f7fa] text-[#1c5461] font-semibold px-6 py-2 rounded-lg bg-white hover:bg-[#e6f7fa] w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
