"use client";

import { useState, useEffect } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import { useTourGuideManager } from "@/hooks/useTourGuideManager";
import { TourPackage } from "@/app/static/tour-packages/tour-packageSchema";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

interface AddTourPackageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddTourPackage({
  onSuccess,
  onCancel,
}: AddTourPackageProps) {
  const { create, loading, error } = useTourPackageManager();
  const { fetchAllTourGuideApplicants } = useTourGuideManager();
  const params = useParams();
  const touroperator_id = Array.isArray(params.id) ? params.id[0] : params.id;

  // State for guides and selected guides
  const [guides, setGuides] = useState<any[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);

  // Fetch guides on mount
  useEffect(() => {
    async function loadGuides() {
      const allGuides = await fetchAllTourGuideApplicants();
      // Only show approved guides
      setGuides(
        allGuides
          ? allGuides.filter((g: any) => g.application_status === "APPROVED")
          : []
      );
    }
    loadGuides();
  }, [fetchAllTourGuideApplicants]);

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
      <h2 className="text-xl font-semibold mb-2">Create Tour Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Package Name</label>
          <input
            name="package_name"
            value={form.package_name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input input-bordered w-full"
          rows={2}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="input input-bordered w-full"
            min={0}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Duration (days)
          </label>
          <input
            name="duration_days"
            type="number"
            value={form.duration_days}
            onChange={handleChange}
            className="input input-bordered w-full"
            min={1}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Available Slots
          </label>
          <input
            name="available_slots"
            type="number"
            value={form.available_slots}
            onChange={handleChange}
            className="input input-bordered w-full"
            min={1}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Inclusions</label>
          <input
            name="inclusions"
            value={form.inclusions}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Exclusions</label>
          <input
            name="exclusions"
            value={form.exclusions}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            name="date_start"
            type="date"
            value={form.date_start}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            name="date_end"
            type="date"
            value={form.date_end}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Assign Tour Guides
          </label>
          <select
            multiple
            value={selectedGuides}
            onChange={handleGuideChange}
            className="input input-bordered w-full"
          >
            {guides.map((g) => (
              <option key={g.id} value={g.id}>
                {g.first_name} {g.last_name}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">
            Hold Ctrl/Cmd to select multiple guides.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            name="start_time"
            type="time"
            value={form.start_time}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            name="end_time"
            type="time"
            value={form.end_time}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Cancellation Days
          </label>
          <input
            name="cancellation_days"
            type="number"
            value={form.cancellation_days}
            onChange={handleChange}
            className="input input-bordered w-full"
            min={0}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Cancellation Policy
          </label>
          <input
            name="cancellation_note"
            value={form.cancellation_note}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      {formError && <div className="text-red-600 text-sm">{formError}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
