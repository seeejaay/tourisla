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
  onSubmit: (data: AccommodationLog) => Promise<void>;
  editingLog?: AccommodationLog | null;
  loading?: boolean;
}

export default function AddAccommodationLog({
  onClose,
  onSubmit,
  editingLog,
  loading,
}: AddAccommodationLogProps) {
  const [form, setForm] = useState<Partial<AccommodationLog>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingLog) {
      setForm({
        ...editingLog,
        log_date: editingLog.log_date?.slice(0, 10) || "",
        checkout_date: editingLog.checkout_date?.slice(0, 10) || "",
        rooms_occupied: Array.isArray(editingLog.rooms_occupied)
          ? editingLog.rooms_occupied.join(",")
          : editingLog.rooms_occupied,
      });
    } else {
      setForm({});
    }
    setError(null);
  }, [editingLog]);

  // Auto-fill day_of_week when log_date changes
  useEffect(() => {
    if (form.log_date) {
      const date = new Date(form.log_date as string);
      if (!isNaN(date.getTime())) {
        const day = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
        setForm((prev) => ({ ...prev, day_of_week: day }));
      }
    }
  }, [form.log_date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: AccommodationLog = {
        ...form,
        log_date: form.log_date
          ? new Date(form.log_date as string).toISOString()
          : "",
        checkout_date: form.checkout_date
          ? new Date(form.checkout_date as string).toISOString()
          : "",
        rooms_occupied: form.rooms_occupied
          ? typeof form.rooms_occupied === "string"
            ? (form.rooms_occupied as string)
                .split(",")
                .map((v) => Number(v.trim()))
                .filter((v) => !isNaN(v))
            : form.rooms_occupied
          : [],
        number_of_guests_check_in: Number(form.number_of_guests_check_in) || 0,
        number_of_guests_overnight:
          Number(form.number_of_guests_overnight) || 0,
        day_of_week: form.day_of_week || "",
      } as AccommodationLog;
      accommodationLogSchema.parse(data); // validate
      await onSubmit(data);
      setForm({});
    } catch (err) {
      setError(
        "Validation error: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-5" autoComplete="off">
      <h2 className="text-2xl font-extrabold text-[#1c5461] mb-2">
        {editingLog ? "Edit Accommodation Log" : "Add Accommodation Log"}
      </h2>
      {error && (
        <div className="text-red-600 text-sm mb-2 rounded bg-red-50 px-2 py-1">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {AccommodationLogFields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <Label
              htmlFor={field.name}
              className="font-medium text-[#3e979f] mb-1"
            >
              {field.label}
            </Label>
            {field.name === "day_of_week" ? (
              <select
                id={field.name}
                name={field.name}
                value={form[field.name as keyof AccommodationLog] ?? ""}
                onChange={handleChange}
                required
                className="border border-[#e6f7fa] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e979f] bg-gray-50 transition"
              >
                <option value="">Select day</option>
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name as keyof AccommodationLog] ?? ""}
                onChange={handleChange}
                required
                className="border border-[#e6f7fa] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3e979f] bg-gray-50"
              />
            )}
            {field.helperText && (
              <span className="text-xs text-gray-500">{field.helperText}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {editingLog ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="border-[#3e979f] text-[#1c5461] font-semibold px-4 py-2 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
