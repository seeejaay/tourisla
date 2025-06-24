"use client";

import { useState, useEffect } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { TourPackage } from "@/app/static/tour-packages/tour-packageSchema";
import { useParams } from "next/navigation";

interface AddTourPackageProps {
  onSuccess: () => void;
  onCancel: () => void;
}
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
export default function AddTourPackage({
  onSuccess,
  onCancel,
}: AddTourPackageProps) {
  const { create, loading, error } = useTourPackageManager();
  const { fetchAllTourGuideApplicants } = useTourGuideManager();
  const params = useParams();
  const touroperator_id = Array.isArray(params.id) ? params.id[0] : params.id;

  // State for guides and selected guides
  const [guides, setGuides] = useState<TourGuide[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);

  // Fetch guides on mount
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
    package_name: "",
    location: "",
    description: "",
    price: 0,
    duration_days: 1,
    inclusions: "",
    exclusions: "",
    available_slots: 1,
    date_start: "",
    date_end: "",
    start_time: "",
    end_time: "",
    cancellation_days: 0,
    cancellation_note: "",
    touroperator_id: touroperator_id,
  });
  const [formError, setFormError] = useState<string | null>(null);

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
          : value,
    }));
  };

  const handleGuideChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedGuides(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await create({
        ...form,
        touroperator_id,
        assigned_guides: selectedGuides,
      });
      onSuccess();
    } catch (err) {
      setFormError((err as Error)?.message || "Failed to create tour package.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section: Basic Info */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b pb-3">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Package Name
            </label>
            <input
              name="package_name"
              value={form.package_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
            required
          />
        </div>
      </div>

      {/* Section: Details */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b pb-3">
          Package Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                min={0}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Duration (days)
            </label>
            <input
              name="duration_days"
              type="number"
              value={form.duration_days}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              min={1}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Available Slots
            </label>
            <input
              name="available_slots"
              type="number"
              value={form.available_slots}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              min={1}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Inclusions
            </label>
            <input
              name="inclusions"
              value={form.inclusions}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="What's included in the package"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Exclusions
            </label>
            <input
              name="exclusions"
              value={form.exclusions}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="What's not included in the package"
              required
            />
          </div>
        </div>
      </div>

      {/* Section: Schedule & Guides */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b pb-3">
          Schedule & Guides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Start Date
            </label>
            <input
              name="date_start"
              type="date"
              value={form.date_start}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              End Date
            </label>
            <input
              name="date_end"
              type="date"
              value={form.date_end}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Assign Tour Guides
            </label>
            <select
              multiple
              value={selectedGuides}
              onChange={handleGuideChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[42px]"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Start Time
            </label>
            <input
              name="start_time"
              type="time"
              value={form.start_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              End Time
            </label>
            <input
              name="end_time"
              type="time"
              value={form.end_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
        </div>
      </div>

      {/* Section: Cancellation Policy */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b pb-3">
          Cancellation Policy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Cancellation Days
            </label>
            <input
              name="cancellation_days"
              type="number"
              value={form.cancellation_days}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              min={0}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Cancellation Policy
            </label>
            <input
              name="cancellation_note"
              value={form.cancellation_note}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="E.g., Full refund if cancelled 7 days before"
              required
            />
          </div>
        </div>
      </div>

      {/* Error messages */}
      {formError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </span>
          ) : (
            "Create"
          )}
        </button>
      </div>
    </form>
  );
}
