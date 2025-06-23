"use client";
import React, { useState, useEffect } from "react";
import { AccommodationLogFields } from "@/app/static/accommodation/accommodationlog";
import accommodationLogSchema, {
  AccommodationLog,
} from "@/app/static/accommodation/accommodationlogSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface AddAccommodationLogProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  editingLog?: AccommodationLog | null;
  loading?: boolean;
}

export default function AddAccommodationLog({
  onClose,
  onSubmit,
  editingLog,
  loading,
}: AddAccommodationLogProps) {
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingLog) {
      setForm({
        ...editingLog,
        log_date: editingLog.log_date?.slice(0, 10) || "",
        checkout_date: editingLog.checkout_date?.slice(0, 10) || "",
      });
    } else {
      setForm({});
    }
    setError(null);
  }, [editingLog]);

  // Auto-fill day_of_week when log_date changes
  useEffect(() => {
    if (form.log_date) {
      const date = new Date(form.log_date);
      if (!isNaN(date.getTime())) {
        const day = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
        setForm((prev: any) => ({ ...prev, day_of_week: day }));
      }
    }
  }, [form.log_date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        log_date: form.log_date ? new Date(form.log_date).toISOString() : "",
        checkout_date: form.checkout_date
          ? new Date(form.checkout_date).toISOString()
          : "",
        // Convert comma-separated string to array of numbers
        rooms_occupied: form.rooms_occupied
          ? form.rooms_occupied
              .split(",")
              .map((v: string) => Number(v.trim()))
              .filter((v: number) => !isNaN(v))
          : [],
        number_of_guests_check_in: Number(form.number_of_guests_check_in),
        number_of_guests_overnight: Number(form.number_of_guests_overnight),
      };
      accommodationLogSchema.parse(data); // validate
      await onSubmit(data);
      setForm({});
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || "Validation error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-2" autoComplete="off">
      {error && (
        <div className="text-red-500 text-sm mb-2 rounded bg-red-50 px-2 py-1">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {/* Log Date */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="log_date" className="font-medium text-gray-700 mb-1">
            Log Date
          </Label>
          <Input
            id="log_date"
            type="date"
            name="log_date"
            value={form.log_date || ""}
            onChange={handleChange}
            required
          />
        </div>
        {/* Checkout Date */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="checkout_date"
            className="font-medium text-gray-700 mb-1"
          >
            Checkout Date
          </Label>
          <Input
            id="checkout_date"
            type="date"
            name="checkout_date"
            value={form.checkout_date || ""}
            onChange={handleChange}
            required
          />
        </div>
        {/* Day of Week */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="day_of_week"
            className="font-medium text-gray-700 mb-1"
          >
            Day of Week
          </Label>
          <select
            id="day_of_week"
            name="day_of_week"
            value={form.day_of_week || ""}
            onChange={handleChange}
            required
            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Select day</option>
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        {/* Rooms Occupied */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="rooms_occupied"
            className="font-medium text-gray-700 mb-1"
          >
            Rooms Occupied
          </Label>
          <Input
            id="rooms_occupied"
            type="text"
            name="rooms_occupied"
            placeholder="Enter comma-separated room numbers (e.g. 1,2,3)"
            value={form.rooms_occupied || ""}
            onChange={handleChange}
            required
          />
          <span className="text-xs text-gray-500">
            Separate multiple room numbers with commas.
          </span>
        </div>
        {/* Number of Guests Check-in */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="number_of_guests_check_in"
            className="font-medium text-gray-700 mb-1"
          >
            Number of Guests Check-in
          </Label>
          <Input
            id="number_of_guests_check_in"
            type="number"
            name="number_of_guests_check_in"
            placeholder="Enter number of guests checking in"
            value={form.number_of_guests_check_in || ""}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
        {/* Number of Guests Overnight */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="number_of_guests_overnight"
            className="font-medium text-gray-700 mb-1"
          >
            Number of Guests Overnight
          </Label>
          <Input
            id="number_of_guests_overnight"
            type="number"
            name="number_of_guests_overnight"
            placeholder="Enter number of guests staying overnight"
            value={form.number_of_guests_overnight || ""}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <Button type="submit" disabled={loading}>
          {editingLog ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
